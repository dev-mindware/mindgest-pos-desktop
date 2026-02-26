import {
  AppSidebar,
  BreadcrumbProvider,
  SidebarInset,
  SidebarProvider,
  PosSessionGuard,
} from "@/components";
import { RouteProtector } from "@/contexts";
import { StoreProvider } from "@/providers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { KeyboardGuard } from "@/components/client/pos/common";

type Props = {
  children: React.ReactNode;
};

export default function POSLayout({ children }: Props) {
  return (
    <RouteProtector allowed={["CASHIER"]}>
      <StoreProvider>
        <PosSessionGuard>
          <SidebarProvider defaultOpen={false}>
            <KeyboardGuard>
              <TooltipProvider delayDuration={200}>
                <AppSidebar />
                <SidebarInset>
                  <BreadcrumbProvider>{children}</BreadcrumbProvider>
                </SidebarInset>
              </TooltipProvider>
            </KeyboardGuard>
          </SidebarProvider>
        </PosSessionGuard>
      </StoreProvider>
    </RouteProtector>
  );
}
