"use client";

import { NotificationItem } from "./notification-item";
import type { NotificationType } from "@/types";
import { EmptyState } from "@/components/common";

interface NotificationListProps {
  notifications: NotificationType[];
  searchTerm: string;
  filterStatus: "all" | "read" | "unread";
  onNotificationClick: (notification: NotificationType) => void;
  deleteNotification: (id: string) => void;
}

export function NotificationList({
  notifications,
  searchTerm,
  filterStatus,
  onNotificationClick,
  deleteNotification,
}: NotificationListProps) {
  if (notifications.length === 0) {
    const isFiltered = searchTerm || filterStatus !== "all";
    return (
      <div className="p-4 bg-sidebar rounded-lg border border-border">
        <EmptyState
          icon="BellOff"
          title={isFiltered ? "Nenhuma notificação encontrada" : "Sem notificações"}
          description={
            isFiltered
              ? "Tente limpar os filtros para ver todas as notificações."
              : "Você não possui notificações no momento."
          }
          className="border-none"
        />
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="hover:bg-muted/50 transition-colors"
        >
          <NotificationItem
            notification={notification}
            onClick={() => onNotificationClick(notification)}
            onDelete={() => deleteNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
}
