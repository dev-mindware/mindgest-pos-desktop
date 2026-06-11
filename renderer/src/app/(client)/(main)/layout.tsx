import {
  AppSidebar,
  BreadcrumbProvider,
  SidebarInset,
  SidebarProvider,
} from "@/components";
import { RouteProtector } from "@/contexts";
import { StoreProvider } from "@/providers";
import { TooltipProvider } from "@/components/ui/tooltip";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <RouteProtector allowed={["ADMIN", "OWNER", "MANAGER", "CASHIER"]}>
      <StoreProvider>
        <SidebarProvider>
          <TooltipProvider delayDuration={200}>
            <AppSidebar />
            <SidebarInset>
              <BreadcrumbProvider>{children}</BreadcrumbProvider>
            </SidebarInset>
          </TooltipProvider>
        </SidebarProvider>
      </StoreProvider>
    </RouteProtector>
  );
}
