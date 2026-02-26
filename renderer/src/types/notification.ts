
export interface NotificationResponse {
  data: NotificationType[];
  total: number;
  page: number;
  pageCount: number;
}

export type NotificationType = {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "ERROR";
  userId: string;
  isRead: boolean;
  createdAt: string;
};

export interface NotificationParams {
  skip: number;
  take: number;
  type?: "INFO" | "WARNING" | "ERROR";
  isRead?: boolean;
}
