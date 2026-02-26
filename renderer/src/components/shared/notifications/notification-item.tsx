"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { NotificationType } from "@/types";
import { Icon, Button } from "@/components";
import { icons } from "lucide-react";

interface NotificationItemProps {
  notification: NotificationType;
  onClick: () => void;
  onDelete: () => void;
}

const NOTIFICATION_STYLES: Record<string, { icon: keyof typeof icons; colorClass: string }> = {
  WARNING: { icon: "CircleAlert", colorClass: "bg-yellow-700/15 text-yellow-700" },
  ERROR: { icon: "OctagonAlert", colorClass: "bg-red-700/15 text-red-700" },
  INFO: { icon: "Info", colorClass: "bg-primary/15 text-primary-700" },
  DEFAULT: { icon: "Info", colorClass: "bg-primary/15 text-primary-700" },
};

export function NotificationItem({
  notification,
  onClick,
  onDelete,
}: NotificationItemProps) {
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  const style = NOTIFICATION_STYLES[notification.type] || NOTIFICATION_STYLES.DEFAULT;

  return (
    <div
      className={cn(
        "group flex items-start gap-3 p-4 hover:bg-card transition-colors duration-150 relative cursor-pointer",
        !notification.isRead ? "bg-primary/2" : ""
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          style.colorClass
        )}
      >
        <Icon name={style.icon} className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              "text-sm font-medium text-foreground line-clamp-1",
              !notification.isRead && "font-bold text-foreground"
            )}
          >
            {notification.title}
          </h4>
          {!notification.isRead && (
            <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-1" />
          )}
        </div>

        <p className={cn("text-sm line-clamp-2 mt-1", !notification.isRead ? "text-foreground" : "text-foreground")}>
          {notification.message}
        </p>

        <p className="text-xs text-foreground mt-2">{timeAgo}</p>
      </div>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-red-600/15 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Icon name="Trash2" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
