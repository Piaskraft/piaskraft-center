import type {
  Notification,
  NotificationType,
  NotificationUser,
} from "./notificationTypes";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const notificationTypeFromApi = {
  TASK_CREATED: "Utworzenie zadania",
  TASK_STATUS_CHANGED: "Zmiana statusu zadania",
  TASK_COMMENT_ADDED: "Dodanie komentarza",
} as const satisfies Record<string, NotificationType>;

const notificationUserFromApi = {
  ADMIN: "Admin",
  OPERATOR: "Operator",
} as const satisfies Record<string, NotificationUser>;

const notificationUserToApi = {
  Admin: "ADMIN",
  Operator: "OPERATOR",
} as const;

type ApiNotification = {
  id: number;
  type: keyof typeof notificationTypeFromApi;
  recipient: keyof typeof notificationUserFromApi;
  actor: keyof typeof notificationUserFromApi | null;
  title: string;
  message: string;
  isRead: boolean;
  taskId: number | null;
  createdAt: string;
};

function mapNotificationFromApi(notification: ApiNotification): Notification {
  return {
    id: notification.id,
    type: notificationTypeFromApi[notification.type],
    recipient: notificationUserFromApi[notification.recipient],
    actor: notification.actor
      ? notificationUserFromApi[notification.actor]
      : null,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    taskId: notification.taskId,
    createdAt: notification.createdAt,
  };
}

export async function getNotifications(
  recipient: NotificationUser,
): Promise<Notification[]> {
  const response = await fetch(
    `${apiBaseUrl}/notifications?recipient=${notificationUserToApi[recipient]}`,
  );

  if (!response.ok) {
    throw new Error("Nie udało się pobrać powiadomień.");
  }

  const notifications = (await response.json()) as ApiNotification[];

  return notifications.map(mapNotificationFromApi);
}

export async function markNotificationAsRead(
  notificationId: number,
  recipient: NotificationUser,
): Promise<void> {
  const response = await fetch(
    `${apiBaseUrl}/notifications/${notificationId}/read?recipient=${notificationUserToApi[recipient]}`,
    {
      method: "PATCH",
    },
  );

  if (!response.ok) {
    throw new Error("Nie udało się oznaczyć powiadomienia jako przeczytane.");
  }
}
