"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, Icon, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components";
import { toast } from "sonner";
import axios from "axios";

export function PosLanSettings() {
    const [localIp, setLocalIp] = useState<string>("");
    const [terminalMode, setTerminalMode] = useState<string>("MASTER");
    const [masterIp, setMasterIp] = useState<string>("");
    const [lanSecret, setLanSecret] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            if (typeof window !== "undefined" && (window as any).ipc?.lan) {
                try {
                    const ip = await (window as any).ipc.lan.getLocalIp();
                    setLocalIp(ip);
                    const config = await (window as any).ipc.lan.getConfig();
                    setTerminalMode(config.terminalMode || "MASTER");
                    setMasterIp(config.masterIp || "");
                    setLanSecret(config.lanSecret || "");
                } catch (e) {
                    console.error("Failed to fetch LAN config", e);
                }
            }
            setIsLoading(false);
        };
        fetchConfig();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        if (typeof window !== "undefined" && (window as any).ipc?.lan) {
            try {
                await (window as any).ipc.lan.setConfig({
                    terminalMode,
                    masterIp,
                    lanSecret
                });
                toast.success("Configuração de Rede LAN guardada com sucesso! Reinicie a aplicação para aplicar as alterações.");
            } catch (e) {
                toast.error("Erro ao guardar configuração LAN.");
            }
        }
        setIsSaving(false);
    };

    const handleTestConnection = async () => {
        if (!masterIp) {
            toast.error("Por favor, introduza o IP do Master.");
            return;
        }
        try {
            const res = await axios.get(`http://${masterIp}:3333/api/health`, { timeout: 3000 });
            if (res.data?.status === 'online') {
                toast.success("Ligação ao Master estabelecida com sucesso!");
            } else {
                toast.error("Ligação falhou. Verifique o IP.");
            }
        } catch (error) {
            toast.error("Não foi possível conectar ao Master.");
        }
    };

    if (isLoading) return <div>A carregar definições...</div>;

    return (
        <div className="space-y-6">
            <Card className="border-primary/10 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="bg-muted/30 px-6 py-4 border-b border-primary/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-test-full bg-primary/10">
                            <Icon name="Network" className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-outfit font-bold text-lg leading-none">Topologia LAN Multi-Terminal</h3>
                            <p className="text-xs text-muted-foreground mt-1 lowercase">Configure o modo de operação deste terminal</p>
                        </div>
                    </div>
                </div>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        {/* Info Section */}
                        <div className="bg-muted/20 p-4 rounded-test-lg border border-primary/5 space-y-2">
                            <p className="text-sm font-semibold">IP Local deste PC:</p>
                            <p className="font-mono text-primary bg-primary/10 px-2 py-1 rounded-test inline-block">{localIp}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Se configurar outro PC como Terminal, este é o IP que deverá ser usado como "IP do Master".
                            </p>
                        </div>

                        {/* Mode Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Modo do Terminal</label>
                            <Select value={terminalMode} onValueChange={setTerminalMode}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o modo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MASTER">Master (Servidor e Caixa Principal)</SelectItem>
                                    <SelectItem value="TERMINAL">Terminal (Apenas Caixa, liga ao Master)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Terminal Config */}
                        {terminalMode === "TERMINAL" && (
                            <div className="space-y-4 pt-4 border-t border-primary/10">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">IP do Servidor Master</label>
                                    <div className="flex gap-2">
                                        <Input 
                                            placeholder="Ex: 192.168.1.100" 
                                            value={masterIp} 
                                            onChange={(e) => setMasterIp(e.target.value)} 
                                        />
                                        <Button variant="outline" onClick={handleTestConnection}>Testar</Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2 pt-4 border-t border-primary/10">
                            <label className="text-sm font-semibold">Segurança LAN (Shared Secret)</label>
                            <p className="text-xs text-muted-foreground mb-2">Palavra-passe opcional para encriptar a comunicação entre o Master e o(s) Terminal(ais). Deve ser idêntica em todos os PCs.</p>
                            <Input 
                                type="password"
                                placeholder="Segredo da Rede Local" 
                                value={lanSecret} 
                                onChange={(e) => setLanSecret(e.target.value)} 
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button onClick={handleSave} disabled={isSaving}>
                                <Icon name="Save" className="w-4 h-4 mr-2" />
                                Guardar Configurações
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
