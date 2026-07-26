export type NotificationType =
  | "Utworzenie zadania"
  | "Zmiana statusu zadania"
  | "Dodanie komentarza";

export type NotificationUser = "Admin" | "Operator";

export type Notification = {
  id: number;
  type: NotificationType;
  recipient: NotificationUser;
  actor: NotificationUser | null;
  title: string;
  message: string;
  isRead: boolean;
  taskId: number | null;
  createdAt: string;
};
