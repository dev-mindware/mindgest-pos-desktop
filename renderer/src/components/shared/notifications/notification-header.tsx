"use client";
import {
  Icon,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components";

interface NotificationHeaderProps {
  unreadCount: number;
  selectedUnreadCount: number;
  onMarkAllFilteredAsRead: () => void;
}

export function NotificationHeader({
  unreadCount,
  selectedUnreadCount,
  onMarkAllFilteredAsRead,
}: NotificationHeaderProps) {
  return (
    <div className="flex items-center gap-4 h-16">
      <p className="text-sm text-white">
        {unreadCount > 0
          ? `${unreadCount} não lidas`
          : "Todas as notificações lidas"}
      </p>

      <div className="flex items-center gap-2">
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Icon name="CheckCheck" className="h-4 w-4" />
            Marcar todas como lidas
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="bg-white/20 rounded-lg">
              <Icon name="EllipsisVertical" className="h-6 w-6 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={onMarkAllFilteredAsRead}
              disabled={selectedUnreadCount === 0}
            >
              <Icon name="Check" className="h-4 w-4 mr-2" />
              Marcar filtradas como lidas ({selectedUnreadCount})
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}