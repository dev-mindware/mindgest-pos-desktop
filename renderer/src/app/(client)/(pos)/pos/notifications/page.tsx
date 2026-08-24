"use client";
import { PageWrapper, AllNotifications } from "@/components";
import { NotificationDetail } from "@/components/shared/notifications";

export default function PosNotificationsPage() {
    return (
        <PageWrapper routeLabel="Notificações" subRoute="Notificações">
            <div className="p-4 space-y-6">
                <AllNotifications />
            </div>
            <NotificationDetail />
        </PageWrapper>
    );
}
