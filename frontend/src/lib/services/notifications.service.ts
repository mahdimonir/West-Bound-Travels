import api from "../api";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const notificationsService = {
  /** Get current user's notifications */
  getNotifications: () => api.get<ApiResponse<Notification[]>>("/notifications"),

  /** Delete a notification */
  deleteNotification: (id: string) => api.del<ApiResponse<void>>(`/notifications/${id}`),
};

export default notificationsService;
