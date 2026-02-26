"use client";

import { Icon, Card, CardContent } from "@/components";
import { useState } from "react";

const initialNotifications = [
  {
    id: 1,
    text: "Faltam menos de 6 dias para o stock de bananas faltar",
    timestamp: "15 minutes ago",
    unread: true,
  },
  {
    id: 2,
    text: "Adicione mais 120 bananas para estabilizar o stock",
    timestamp: "45 minutes ago",
    unread: true,
  },
  {
    id: 3,
    text: "Os produtos do Fornecedor Ângelo estão com risco de ruptura",
    timestamp: "4 hours ago",
    unread: false,
  },
  {
    id: 4,
    text: "Se venderes 40 sumos por dia o item acaba em 14 dias",
    timestamp: "12 hours ago",
    unread: false,
  },
  {
    id: 5,
    text: "Os casacos da pra costumam esgotar rápido de Maio a Junho",
    timestamp: "2 days ago",
    unread: false,
  },
];

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export function AIAlerts() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="text-sm font-semibold">Alertas Inteligentes</div>
          {unreadCount > 0 && (
            <button
              className="text-xs font-medium hover:underline"
              onClick={handleMarkAllAsRead}
            >
              Marcar todos como lidos
            </button>
          )}
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="h-px my-1 -mx-1 bg-border"
        ></div>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="px-3 py-2 text-sm transition-colors rounded-md hover:bg-accent"
          >
            <div className="relative flex items-start gap-3 pe-3">
              <Icon name="Sparkles" size={16} className="text-primary" />
              <div className="flex-1 space-y-1">
                <button
                  className="text-left text-foreground/80 after:absolute after:inset-0"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <span className="font-medium text-foreground hover:underline">
                    {notification.text}
                  </span>
                  .
                </button>
                <div className="text-xs text-muted-foreground">
                  {notification.timestamp}
                </div>
              </div>
              {notification.unread && (
                <div className="absolute self-center end-0">
                  <Dot />
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
