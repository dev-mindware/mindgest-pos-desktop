"use client";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useModal } from "@/stores/modal/use-modal-store";
import { useCurrentNotificationStore } from "@/stores";
import { NotificationParams, NotificationType } from "@/types/notification";
import { notificationsService } from "@/services/notifications-service";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

let socket: Socket;

export function useNotifications(
  initialFilters: Omit<NotificationParams, "skip" | "take"> = {}
) {
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const { setCurrentNotification } = useCurrentNotificationStore();

  const TAKE = 5;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["notifications", initialFilters],
    queryFn: ({ pageParam = 0 }) =>
      notificationsService.getNotifications({
        ...initialFilters,
        skip: pageParam as number,
        take: TAKE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length < TAKE) return undefined;
      return allPages.length * TAKE;
    },
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 5,
  });

  const notifications = data?.pages.flatMap((page) => page.data) ?? [];

  // Socket.IO Connection
  useEffect(() => {
    // Only connect if URL is defined
    if (!process.env.NEXT_PUBLIC_API_URL) return;

    socket = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to notification socket");
    });

    socket.on("new_notification", (newNotification: NotificationType) => {
      // Optimistically update the cache
      queryClient.setQueryData<any>(["notifications", initialFilters], (oldData: any) => {
        if (!oldData) return oldData;

        // Insert into the first page
        const newPages = [...oldData.pages];
        if (newPages.length > 0) {
          newPages[0] = {
            ...newPages[0],
            data: [newNotification, ...newPages[0].data]
          };
        }

        return {
          ...oldData,
          pages: newPages,
        };
      });
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [queryClient, initialFilters]);

  // Mutations
  const { mutateAsync: markAsRead } = useMutation({
    mutationFn: notificationsService.markAsRead,
    onMutate: async (id) => {
      // Optimistic update would be complex with infinite pages, disabling for simplicity or implementing basic toggle
      // For now, simpler to just invalidate or manually update if critical.
      // Let's manually update cache for responsiveness

      queryClient.setQueryData<any>(["notifications", initialFilters], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((n: NotificationType) =>
              n.id === id ? { ...n, isRead: true } : n
            )
          }))
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] }); 
      // Optional: Re-fetch to confirm
    },
  });

  const { mutateAsync: deleteNotification } = useMutation({
    mutationFn: notificationsService.deleteNotification,
    onMutate: async (id) => {
      queryClient.setQueryData<any>(["notifications", initialFilters], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((n: NotificationType) => n.id !== id)
          }))
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleNotificationClick = (notification: NotificationType) => {
    openModal("notify-detail");
    setCurrentNotification(notification);
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  return {
    notifications,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    markAsRead,
    deleteNotification,
    handleNotificationClick,
    refetch
  };
}