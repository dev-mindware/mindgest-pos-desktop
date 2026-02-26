"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger, Appearance, Icon } from "@/components";
import { useRouter, useSearchParams } from "next/navigation";
import { PosGeneralSettings, PosWorkspaceSettings } from "./contents";
import { currentStoreStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { cashSessionsService } from "@/services";

export function PosSettingsSetup() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab");
    const { currentStore } = currentStoreStore();

    const tabs = [
        {
            id: "general",
            label: "Geral",
            icon: "Settings",
            component: (data: any, loading: boolean) => (
                <PosGeneralSettings currentSession={data} />
            ),
        },
        {
            id: "workspace",
            label: "Workspace",
            icon: "Monitor",
            component: () => <PosWorkspaceSettings />,
        },
        {
            id: "appearance",
            label: "Aparência",
            icon: "Palette",
            component: () => <Appearance />,
        },
    ];

    const defaultTab = tabs[0].id;
    const activeTab = currentTab && tabs.some((t) => t.id === currentTab) ? currentTab : defaultTab;

    const { data: currentSession, isLoading } = useQuery({
        queryKey: ["current-cash-session", currentStore?.id],
        queryFn: () => cashSessionsService.getCurrentSession(currentStore?.id),
        enabled: activeTab === "general",
    });

    const handleTabChange = (value: string) => {
        router.push(`?tab=${value}`);
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold">Definições do POS</h1>
            <div className="hidden md:block">
                <Tabs
                    value={activeTab}
                    className="flex-row w-full mt-5"
                    onValueChange={handleTabChange}
                >
                    <div className="h-screen bg-sidebar rounded-md w-64 shrink-0">
                        <TabsList className="sticky top-0 flex-col gap-1 px-1 font-normal bg-transparent rounded-none w-full text-foreground items-stretch">
                            <div className="p-4 space-y-2">
                                {tabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.id}
                                        value={tab.id}
                                        className="hover:bg-accent hover:text-foreground data-[state=active]:bg-accent relative w-full justify-start"
                                    >
                                        <Icon name={tab.icon as any} className="mr-2 h-4 w-4" />
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </div>
                        </TabsList>
                    </div>

                    <div className="border rounded-md grow text-start ml-6">
                        {tabs.map((tab) => (
                            <TabsContent key={tab.id} value={tab.id} className="p-6">
                                {tab.component(currentSession, isLoading)}
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            </div>

            {/* Mobile View */}
            <div className="block mt-6 md:hidden">
                <Tabs value={activeTab} className="w-full" onValueChange={handleTabChange}>
                    <TabsList className="w-full justify-start overflow-x-auto">
                        {tabs.map((tab) => (
                            <TabsTrigger key={tab.id} value={tab.id}>
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <div className="mt-4">
                        {tabs.map((tab) => (
                            <TabsContent key={tab.id} value={tab.id}>
                                {tab.component(currentSession, isLoading)}
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
