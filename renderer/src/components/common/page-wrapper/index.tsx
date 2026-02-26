"use client"
import { DinamicBreadcrumb } from "@/components/custom";
import { NotificationDropdown } from "@/components/shared/notifications";
import { Separator, SidebarTrigger } from "@/components/ui";
import { useQueryState } from "nuqs";
import { Icon, Input, Avatar, AvatarFallback, AvatarImage } from "@/components";
import { useAuth } from "@/hooks/auth";

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
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    shallow: true,
  });

  return (
    <div className="bg-background">
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
          <div className="flex items-center gap-4 w-full justify-between px-4">
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
          <NotificationDropdown />
          {variant === "counter" && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.name} />
                  <AvatarFallback className="text-xs">{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col text-start overflow-hidden">
                  <span
                    className="text-xs font-semibold truncate max-w-[120px]"
                    title={user?.name}
                  >
                    {user?.name}
                  </span>
                  <span
                    className="text-[10px] text-muted-foreground truncate"
                    title={user?.role}
                  >
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      <div className={`flex flex-col flex-1 ${variant === "counter" ? "w-full max-w-[98%]" : "w-full"} mx-auto space-y-4 md:space-y-6`}>
        <div className={`@container/main flex flex-1 ${variant === "counter" ? "p-2 md:p-4" : "p-4 md:p-8 lg:p-12"} flex-col gap-2`}>
          {children}
        </div>
      </div>
    </div>
  );
}
