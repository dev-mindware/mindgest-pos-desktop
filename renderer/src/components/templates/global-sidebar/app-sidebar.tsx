"use client";
import {
  NavMenu,
  UserInfo,
  Sidebar,
  SidebarRail,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarSkeleton,
  SidebarCompanyInfo,
} from "@/components";
import { menuItems } from "@/constants/menu-items";
import { useAuth } from "@/hooks/auth";
import { getSidebarForUser } from "@/lib/get-sidebar-for-user";
import { PlanType } from "@/types";
import { SyncButton } from "./sync-button";
import { UpdateButton } from "./update-button";
import { LanStatusBadge } from "./lan-status-badge";

export function AppSidebar() {
  const { user } = useAuth();

  if (!user) return <SidebarSkeleton />;

  const plan = user?.company?.subscription
    ? (user.company?.subscription?.plan?.name as PlanType)
    : undefined;

  const filteredMenu = getSidebarForUser(menuItems.items, user.role, user.company?.subscription, plan);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarCompanyInfo />
      </SidebarHeader>
      <SidebarContent className="group-data-[collapsible=icon]:items-center mt-4">
        <NavMenu items={filteredMenu} />
      </SidebarContent>
      <div className="px-1 group-data-[collapsible=icon]:px-0 space-y-1">
        <UpdateButton />
        <LanStatusBadge />
      </div>
      <SyncButton />
      <SidebarFooter>
        <UserInfo />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
