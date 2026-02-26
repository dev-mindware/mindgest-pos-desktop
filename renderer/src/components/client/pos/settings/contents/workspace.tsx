"use client";

import { Card, CardContent, Icon, Switch } from "@/components";
import { useWorkspaceStore } from "@/stores/pos/workspace-store";

export function PosWorkspaceSettings() {
    const { disableVirtualKeyboard, setDisableVirtualKeyboard } = useWorkspaceStore();

    return (
        <div className="space-y-6">
            <Card className="border-primary/10 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="bg-muted/30 px-6 py-4 border-b border-primary/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                            <Icon name="Monitor" className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-outfit font-bold text-lg leading-none">Ambiente de Trabalho</h3>
                            <p className="text-xs text-muted-foreground mt-1 lowercase">Personalize a sua experiência no POS</p>
                        </div>
                    </div>
                </div>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-primary/5">
                            <div className="space-y-1 pr-4">
                                <div className="flex items-center gap-2">
                                    <Icon name="Keyboard" className="h-4 w-4 text-primary" />
                                    <p className="font-outfit font-bold">Teclado Virtual</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Desative o teclado virtual interno se estiver a usar um teclado físico externo.
                                </p>
                            </div>
                            <Switch
                                checked={disableVirtualKeyboard}
                                onCheckedChange={setDisableVirtualKeyboard}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
