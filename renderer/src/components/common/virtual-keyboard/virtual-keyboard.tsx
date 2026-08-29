"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";
import { useKeyboard } from "@/contexts/keyboard-context";
import { cn } from "@/lib/utils";
import { ChevronDown, GripHorizontal } from "lucide-react";

export function VirtualKeyboard() {
    const {
        isVisible,
        layout,
        isCaps,
        toggleCaps,
        handleKeyPress,
        closeKeyboard,
        setLayout,
    } = useKeyboard();

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [mounted, setMounted] = useState(false);

    const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
    const keyboardRef = useRef<Keyboard | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const mainContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Initialize simple-keyboard
    useEffect(() => {
        if (!isVisible || !containerRef.current) return;

        keyboardRef.current = new Keyboard(containerRef.current, {
            onChange: () => { },
            layoutName: layout,
            onKeyPress: (button: string) => {
                let key = button;
                if (button === "{bksp}" || button === "{backspace}") key = "{bksp}";
                if (button === "{enter}") key = "{enter}";
                if (button === "{space}") key = "{space}";
                if (button === "{lock}" || button === "{caps}") {
                    toggleCaps();
                    return;
                }
                if (button === "{accent}") {
                    setLayout("accent");
                    return;
                }
                if (button === "{abc}") {
                    setLayout("default");
                    return;
                }

                handleKeyPress(key);
            },
            layout: {
                default: [
                    "1 2 3 4 5 6 7 8 9 0",
                    "q w e r t y u i o p",
                    "{lock} a s d f g h j k l",
                    "z x c v b n m , . {bksp}",
                    "{accent} {space} {enter}"
                ],
                shift: [
                    "1 2 3 4 5 6 7 8 9 0",
                    "Q W E R T Y U I O P",
                    "{lock} A S D F G H J K L",
                    "Z X C V B N M , . {bksp}",
                    "{accent} {space} {enter}"
                ],
                accent: [
                    "á à â ã é ê í ó ô õ ú ç",
                    "{abc} {space} {enter}"
                ],
                accentShift: [
                    "Á À Â Ã É Ê Í Ó Ô Õ Ú Ç",
                    "{abc} {space} {enter}"
                ],
                numeric: [
                    "1 2 3",
                    "4 5 6",
                    "7 8 9",
                    "00 0 {bksp}",
                    "{enter}"
                ]
            },
            display: {
                "{bksp}": "⌫",
                "{enter}": "Enter ↵",
                "{space}": "Espaço",
                "{lock}": "Caps Lock",
                "{accent}": "Áàã...",
                "{abc}": "ABC"
            },
            theme: "hg-theme-default simple-keyboard-theme",
            mergeDisplay: true
        });

        return () => {
            if (keyboardRef.current) {
                keyboardRef.current.destroy();
                keyboardRef.current = null;
            }
        };
    }, [isVisible]);

    // Update layout whenever layout changes
    useEffect(() => {
        if (keyboardRef.current) {
            keyboardRef.current.setOptions({ layoutName: layout });
        }
    }, [layout]);

    if (!mounted || !isVisible) return null;

    // Pointer-based Dragging
    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("button")) return;

        setIsDragging(true);
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startPosX: position.x,
            startPosY: position.y,
        };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging || !dragRef.current) return;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;

        setPosition({
            x: dragRef.current.startPosX + dx,
            y: dragRef.current.startPosY + dy,
        });
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging || !dragRef.current) return;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;

        setPosition({
            x: dragRef.current.startPosX + dx,
            y: dragRef.current.startPosY + dy,
        });

        setIsDragging(false);
        dragRef.current = null;
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    };

    const keyboardContent = (
        <div
            ref={mainContainerRef}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999999] animate-in slide-in-from-bottom duration-200"
            style={{
                transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)`,
                touchAction: "none",
                willChange: "transform"
            }}
            onPointerDown={(e) => {
                e.stopPropagation();
            }}
            onMouseDown={(e) => {
                e.preventDefault();
            }}
        >
            <div
                id="virtual-keyboard"
                className={cn(
                    "bg-card/95 backdrop-blur-md border border-stone-200/90 dark:border-stone-800/90 rounded-[6px] p-3.5 overflow-hidden shadow-soft-lg pointer-events-auto",
                    layout === "numeric" ? "w-[400px]" : "w-[960px] max-w-[96vw]"
                )}
            >
                {/* Drag Handle & Fast Layout Switcher Header */}
                <div
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border/40 cursor-grab active:cursor-grabbing select-none"
                >
                    {/* Left: Layout Switcher Chips */}
                    <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-[3px] border border-border/40">
                        <button
                            type="button"
                            onClick={() => setLayout("default")}
                            className={cn(
                                "font-mono text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-[2px] transition-colors",
                                layout === "default" || layout === "shift"
                                    ? "bg-primary text-white shadow-soft-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            QWERTY
                        </button>
                        <button
                            type="button"
                            onClick={() => setLayout("numeric")}
                            className={cn(
                                "font-mono text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-[2px] transition-colors",
                                layout === "numeric"
                                    ? "bg-primary text-white shadow-soft-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            123 Num
                        </button>
                        <button
                            type="button"
                            onClick={() => setLayout("accent")}
                            className={cn(
                                "font-mono text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-[2px] transition-colors",
                                layout === "accent" || layout === "accentShift"
                                    ? "bg-primary text-white shadow-soft-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Áàã
                        </button>
                        {isCaps && (
                            <span className="font-mono text-[9px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1 rounded-[2px] font-bold">
                                CAPS
                            </span>
                        )}
                    </div>

                    {/* Center: Drag Handle */}
                    <div className="flex items-center gap-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                        <GripHorizontal className="w-5 h-4" />
                        <span className="text-[10px] font-mono text-muted-foreground/70 hidden sm:inline font-normal">Arrastar</span>
                    </div>

                    {/* Right: Close Button */}
                    <button
                        type="button"
                        onClick={closeKeyboard}
                        className="h-6 w-6 rounded-[3px] border border-border/50 bg-muted/40 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-600 text-muted-foreground flex items-center justify-center transition-colors cursor-pointer"
                        title="Ocultar Teclado (F7)"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>

                {/* Simple Keyboard Container */}
                <div
                    ref={containerRef}
                    className="simple-keyboard-theme"
                />
            </div>
        </div>
    );

    return createPortal(keyboardContent, document.body);
}
