import { PageWrapper, AllNotifications } from "@/components";

export default function NotificationPage() {
    return (
        <PageWrapper subRoute="notifications" routeLabel="Notificações">
            <AllNotifications />
        </PageWrapper>
    );
}