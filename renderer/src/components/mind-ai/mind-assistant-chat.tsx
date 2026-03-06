"use client";

import { useState, useRef, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetDescription,
    SheetTrigger
} from "@/components/ui/sheet";
import ReactMarkdown from "react-markdown";
import { useAuthStore } from "@/stores";
import { Icon } from "../common";

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
    isTyping?: boolean;
}

interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
}

const MAX_PROMPT_LENGTH = 150;
const MAX_MESSAGES_PER_USER = 10;

const TypewriterMarkdown = ({ content, isTyping, onComplete }: { content: string, isTyping?: boolean, onComplete?: () => void }) => {
    const [displayedContent, setDisplayedContent] = useState(isTyping ? "" : content);

    useEffect(() => {
        if (!isTyping) {
            setDisplayedContent(content);
            return;
        }

        let i = 0;
        const intervalId = setInterval(() => {
            setDisplayedContent(content.slice(0, i));
            i += 2;
            if (i > content.length) {
                clearInterval(intervalId);
                setDisplayedContent(content);
                onComplete?.();
            }
        }, 15);

        return () => clearInterval(intervalId);
    }, [content, isTyping, onComplete]);

    return (
        <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{displayedContent}</ReactMarkdown>
        </div>
    );
};

export function MindAssistantChat() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuthStore();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"chat" | "history">("chat");

    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Load history from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("mind_chat_history");
        if (stored) {
            try {
                setConversations(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse chat history");
            }
        }
    }, []);

    // Save history to localStorage
    useEffect(() => {
        if (conversations.length > 0) {
            localStorage.setItem("mind_chat_history", JSON.stringify(conversations));
        }
    }, [conversations]);

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const messages = activeConversation?.messages || [];

    // Calculate total user messages across ALL history to enforce the 10 message limit
    const totalUserMessages = conversations.reduce((acc, conv) => {
        return acc + conv.messages.filter(m => m.role === "user").length;
    }, 0);

    const isLimitReached = totalUserMessages >= MAX_MESSAGES_PER_USER;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const startNewChat = () => {
        setActiveConversationId(null);
        setActiveTab("chat");
        setInputValue("");
    };

    const handleSend = async (forcedInitialMessage?: string) => {
        const textToSend = forcedInitialMessage || inputValue;
        if (!textToSend.trim() || isLimitReached || textToSend.length > MAX_PROMPT_LENGTH) return;

        let currentConvId = activeConversationId;

        // Create new conversation if none active
        if (!currentConvId) {
            currentConvId = Date.now().toString();
            const newConv: Conversation = {
                id: currentConvId,
                title: textToSend.slice(0, 30) + (textToSend.length > 30 ? "..." : ""),
                messages: [],
                createdAt: Date.now()
            };
            setConversations(prev => [newConv, ...prev]);
            setActiveConversationId(currentConvId);
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: textToSend,
        };

        setConversations(prev => prev.map(c =>
            c.id === currentConvId
                ? { ...c, messages: [...c.messages, userMessage] }
                : c
        ));

        setInputValue("");
        setIsLoading(true);
        setActiveTab("chat");

        try {
            const res = await fetch("http://localhost:5001/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: textToSend }),
            });

            if (!res.ok) throw new Error("Falha na comunicação com o MIND AI");

            const data = await res.json();

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: data.reply || "Desculpe, ocorreu um erro.",
                isTyping: true,
            };

            setConversations(prev => prev.map(c =>
                c.id === currentConvId
                    ? { ...c, messages: [...c.messages, aiMessage] }
                    : c
            ));
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: "Ocorreu um erro ao conectar com o serviço local. Tente novamente.",
            };
            setConversations(prev => prev.map(c =>
                c.id === currentConvId
                    ? { ...c, messages: [...c.messages, errorMessage] }
                    : c
            ));
        } finally {
            setIsLoading(false);
        }
    };

    const getGreetingName = () => {
        if (!user) return "Utilizador";
        if (user.company?.name) return `${user.company.name} - ${user.name.split(' ')[0]}`;
        return user.name;
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button
                    className="flex items-center justify-center gap-2 px-4 h-9 border-2 border-primary/20 rounded-full text-sm font-semibold transition-all hover:border-primary/50 bg-background text-foreground animate-pulse-twice shadow-sm group whitespace-nowrap shrink-0"
                >
                    <Icon name="Sparkles" className="h-4 w-4 text-primary shrink-0" />
                    <span>Fale com MIND</span>
                </button>
            </SheetTrigger>

            <SheetContent
                side="right"
                hideClose
                className="w-full sm:max-w-md p-0 border-l border-[#222] bg-[#121212] text-zinc-100 flex flex-col h-full z-110"
            >
                {/* Visually hidden title for screen reader accessibility */}
                <SheetTitle className="sr-only">MIND AI Assistant</SheetTitle>
                <SheetDescription className="sr-only">Assistente de IA do Mindgest POS</SheetDescription>

                {/* Custom Header */}
                <div className="flex items-center justify-between p-4 shrink-0 border-b border-[#222]">
                    <div className="flex items-center bg-[#1a1a1a] rounded-lg p-1 border border-[#2a2a2a]">
                        <button
                            onClick={() => setActiveTab("chat")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "chat" ? "bg-primary/20 text-primary" : "text-zinc-400 hover:text-zinc-200"}`}
                        >
                            Chat
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "history" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"}`}
                        >
                            Histórico
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={startNewChat}
                            className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] hover:bg-[#2a2a2a] text-zinc-300 transition-colors"
                            title="Nova Conversa"
                        >
                            <Icon name="SquarePen" className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-lg hover:bg-[#1a1a1a] text-zinc-400 hover:text-zinc-100 transition-colors"
                        >
                            <Icon name="X" className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col scrollbar-hide" ref={scrollRef}>
                    {activeTab === "history" ? (
                        <div className="p-4 space-y-3">
                            <h3 className="text-sm font-medium text-zinc-400 mb-4 px-1">Histórico de Conversas</h3>
                            {conversations.length === 0 ? (
                                <p className="text-zinc-500 text-sm text-center py-10">Nenhuma conversa encontrada.</p>
                            ) : (
                                conversations.map(conv => (
                                    <button
                                        key={conv.id}
                                        onClick={() => {
                                            setActiveConversationId(conv.id);
                                            setActiveTab("chat");
                                        }}
                                        className="w-full text-left p-4 rounded-xl border border-[#222] bg-[#181818] hover:bg-[#222] transition-colors group flex items-start gap-3"
                                    >
                                        <Icon name="MessageSquare" className="w-5 h-5 text-zinc-500 group-hover:text-primary mt-0.5 shrink-0" />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm text-zinc-200 truncate pr-4">{conv.title}</p>
                                            <p className="text-xs text-zinc-500 mt-1">{new Date(conv.createdAt).toLocaleDateString()} • {conv.messages.length} mensagens</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex-1 p-6 flex flex-col justify-center animate-in fade-in duration-500">
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold tracking-tight mb-2">Olá {getGreetingName()} 👋</h2>
                                <p className="text-zinc-400">Como posso ajudar você hoje?</p>
                            </div>

                            <div className="space-y-2 mb-8">
                                {[
                                    "Como abro uma sessão?",
                                    "Como fecho o meu caixa?",
                                    "Como crio uma fatura?",
                                    "Como emitir uma fatura proforma?"
                                ].map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => handleSend(q)}
                                        className="w-full flex items-center gap-3 p-4 rounded-xl border border-transparent hover:border-[#2a2a2a] hover:bg-[#1a1a1a] text-left transition-colors border-b-[#1a1a1a]"
                                    >
                                        <Icon name="ArrowUpRight" className="w-4 h-4 text-zinc-500" />
                                        <span className="text-sm font-medium text-zinc-300">{q}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 p-4 pb-8">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 fade-in duration-300`}
                                >
                                    {msg.role === "user" ? (
                                        <div className="max-w-[85%] bg-[#2a2a2a] text-zinc-100 px-5 py-3 rounded-2xl rounded-tr-sm text-[15px] leading-relaxed">
                                            {msg.content}
                                        </div>
                                    ) : (
                                        <div className="w-full text-zinc-300 text-[15px] leading-relaxed pr-6">
                                            <TypewriterMarkdown
                                                content={msg.content}
                                                isTyping={msg.isTyping}
                                                onComplete={() => {
                                                    setConversations(prev => prev.map(c =>
                                                        c.id === activeConversationId
                                                            ? { ...c, messages: c.messages.map(m => m.id === msg.id ? { ...m, isTyping: false } : m) }
                                                            : c
                                                    ));
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start animate-in fade-in w-full pl-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Categories & Input Area */}
                {activeTab === "chat" && (
                    <div className="shrink-0 flex flex-col pt-2">
                        {messages.length === 0 && (
                            <div className="flex items-center gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
                                {["Vendas", "Stock", "Clientes", "Documentos", "Definições"].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setInputValue(prev => prev + (prev.length > 0 ? " " : "") + cat)}
                                        className="shrink-0 px-4 py-1.5 rounded-full border border-[#2a2a2a] bg-[#121212] hover:bg-[#1a1a1a] text-xs font-medium transition-colors text-zinc-300"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="px-4 pb-4">
                            <div className={`relative bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-3 flex flex-col shadow-sm focus-within:border-primary/50 transition-colors ${isLimitReached ? 'opacity-50 pointer-events-none' : ''}`}>
                                <textarea
                                    className="w-full bg-transparent resize-none outline-none text-[15px] px-1 py-1 text-zinc-100 placeholder-zinc-500 min-h-[44px] max-h-[120px] scrollbar-hide"
                                    placeholder={isLimitReached ? "Limite de mensagens alcançado" : "Pergunte qualquer coisa..."}
                                    value={inputValue}
                                    maxLength={MAX_PROMPT_LENGTH}
                                    rows={1}
                                    disabled={isLimitReached || isLoading}
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                        e.target.style.height = "auto";
                                        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                />

                                <div className="flex items-center justify-between mt-2 px-1">
                                    <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
                                        <span className={inputValue.length >= MAX_PROMPT_LENGTH ? "text-amber-500" : ""}>{inputValue.length}/{MAX_PROMPT_LENGTH}</span>
                                        <span className={isLimitReached ? "text-red-400" : ""}>Mensagens: {totalUserMessages}/{MAX_MESSAGES_PER_USER}</span>
                                    </div>

                                    <button
                                        onClick={() => handleSend()}
                                        disabled={!inputValue.trim() || isLoading || isLimitReached}
                                        className="bg-primary/20 text-primary p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center"
                                        title="Enviar"
                                    >
                                        <Icon name="Send" className="w-4 h-4 ml-0.5" strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                            <div className="text-center mt-3 mb-1">
                                <span className="text-[11px] font-medium text-zinc-600">
                                    MIND pode cometer erros. Verifique as respostas.
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
