import { AppSidebar, BreadcrumbProvider, SidebarInset } from "@/components";
import { RouteProtector } from "@/contexts";
import { FeatureGateProvider, StoreProvider } from "@/providers";

type Props = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: Props) {
  return (
    <RouteProtector allowed={["OWNER", "MANAGER"]}>
      <StoreProvider>
        <FeatureGateProvider>
          <AppSidebar />
          <SidebarInset>
            <BreadcrumbProvider>{children}</BreadcrumbProvider>
          </SidebarInset>
        </FeatureGateProvider>
      </StoreProvider>
    </RouteProtector>
  );
}
