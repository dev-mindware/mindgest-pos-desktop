"use client"
import { DinamicBreadcrumb } from "@/components/custom";
import { NotificationDropdown } from "@/components/shared/notifications";
import { Separator, SidebarTrigger } from "@/components/ui";
import { useQueryState } from "nuqs";
import { Icon, Input, Avatar, AvatarFallback, AvatarImage } from "@/components";
import { useAuth } from "@/hooks/auth";
import { useNetworkStatus } from "@/hooks/common/use-network-status";
import { useOfflineSync } from "@/hooks/offline/use-offline-sync";
import { useEffect } from "react";
import { useOfflineStore } from "@/stores/offline/offline-store";
import { MindAssistantChat } from "@/components/mind-ai/mind-assistant-chat";

type Props = {
  routePath?: string;
  routeLabel?: string;
  subRoute: string;
  showSeparator?: boolean;
  children: React.ReactNode;
  variant?: "default" | "counter";
};

export function PageWrapper({
  routePath,
  routeLabel,
  subRoute,
  showSeparator = true,
  children,
  variant = "default",
}: Props) {
  const { user } = useAuth();
  const { isOnline } = useNetworkStatus();
  const { isSyncing, pendingCount } = useOfflineSync();
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    shallow: true,
  });

  const { initialize } = useOfflineStore();

  useEffect(() => {
    if (user?.id) {
      initialize(user.id);
    }
  }, [initialize, user?.id]);

  return (
    <div className="bg-background h-screen flex flex-col overflow-hidden w-full">
      <header className="flex h-16 sticky top-0 z-50 shrink-0 bg-sidebar border-b items-center gap-2 transition-[width,height] ease-linear justify-between">
        {/* Default Variant Left side */}
        {variant === "default" && (
          <div className="flex items-center gap-2 px-4 text-center">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DinamicBreadcrumb
              routePath={routePath}
              routeLabel={routeLabel}
              subRoute={subRoute}
              showSeparator={showSeparator}
            />
          </div>
        )}

        {/* Counter Variant Header Content */}
        {variant === "counter" && (
          <div className="flex items-center gap-4 w-full justify-center px-4">
            <div className="relative w-96">
              <Icon name="Search" className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar no Menu..."
                className="pl-8 bg-muted/50 border-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex items-center mr-4 space-x-2 md:space-x-4">
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-muted/30 border">
            <div className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mr-1">
              {isOnline ? 'Online' : 'Offline'}
            </span>
            {pendingCount > 0 && (
              <div className="flex items-center gap-1 ml-1 border-l pl-2 border-muted-foreground/30">
                <Icon name={isSyncing ? "RefreshCcw" : "CloudUpload"} className={`h-3 w-3 ${isSyncing ? 'animate-spin text-amber-500' : 'text-blue-500'}`} />
                <span className="text-[10px] font-bold text-foreground">{pendingCount}</span>
              </div>
            )}
          </div>

          <MindAssistantChat />
          <NotificationDropdown />
        </div>
      </header>
      {variant === "counter" ? (
        <div className="flex-1 overflow-hidden min-w-0 w-full">
          {children}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto min-w-0 w-full">
          <div className="flex flex-col flex-1 w-full mx-auto space-y-4 md:space-y-6">
            <div className="@container/main flex flex-1 p-4 md:p-8 lg:p-12 flex-col gap-2">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
