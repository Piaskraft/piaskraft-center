import "./NotificationsPage.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getNotifications,
  markNotificationAsRead,
} from "../features/notifications/notificationApi";
import type { Notification } from "../features/notifications/notificationTypes";
import { useUser } from "../features/users/useUser";

function formatNotificationDate(createdAt: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt));
}

export function NotificationsPage() {
  const { currentUser } = useUser();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    async function loadNotifications() {
      setIsLoading(true);
      setLoadError("");

      try {
        const loadedNotifications = await getNotifications(currentUser.role);
        setNotifications(loadedNotifications);
      } catch {
        setLoadError("Nie udało się pobrać powiadomień.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadNotifications();
  }, [currentUser.role]);

  async function handleMarkAsRead(notificationId: number) {
    setActionError("");

    try {
      await markNotificationAsRead(notificationId, currentUser.role);

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
    } catch {
      setActionError("Nie udało się oznaczyć powiadomienia jako przeczytane.");
    }
  }

  if (isLoading) {
    return <p>Ładowanie powiadomień...</p>;
  }

  if (loadError) {
    return <p className="error-message">{loadError}</p>;
  }

  return (
    <section className="notifications-page">
      {actionError && <p className="error-message">{actionError}</p>}

      {notifications.length === 0 ? (
        <div className="notifications-empty">
          <h2>Brak powiadomień</h2>
          <p>Nowe informacje o zadaniach pojawią się tutaj.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={
                notification.isRead
                  ? "notification-card"
                  : "notification-card notification-card-unread"
              }
            >
              <div className="notification-card-content">
                <span className="notification-type">{notification.type}</span>

                <h2>{notification.title}</h2>
                <p>{notification.message}</p>

                <small>{formatNotificationDate(notification.createdAt)}</small>
              </div>

              <div className="notification-actions">
                {notification.taskId && (
                  <Link to={`/zadania?task=${notification.taskId}`}>
                    Otwórz zadanie
                  </Link>
                )}

                {!notification.isRead && (
                  <button
                    type="button"
                    onClick={() => void handleMarkAsRead(notification.id)}
                  >
                    Oznacz jako przeczytane
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
