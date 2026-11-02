function Notifications({ notifications, setNotifications }) {
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id) => {
    setNotifications((previousNotifications) =>
      previousNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((previousNotifications) =>
      previousNotifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  return (
    <div className="admin-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">SYSTEM</p>
          <h2>Notifications</h2>
          <p>
            Stay updated about orders, bookings, messages and business alerts.
          </p>
        </div>

        <div className="page-heading-action">
          <span className="notification-count">
            {unreadCount} unread
          </span>

          <button
            className="secondary-button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
        </div>
      </section>

      <section className="notifications-section">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <h3>No notifications</h3>
            <p>You are all caught up.</p>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map((notification) => (
              <div
                className={`notification-card ${
                  notification.read ? "read" : "unread"
                }`}
                key={notification.id}
              >
                <div className="notification-icon">
                  {notification.type === "order" && "▤"}
                  {notification.type === "service" && "⚒"}
                  {notification.type === "stock" && "!"}
                </div>

                <div className="notification-content">
                  <div className="notification-top">
                    <strong>{notification.title}</strong>
                    <span>{notification.time}</span>
                  </div>

                  <p>{notification.message}</p>

                  {!notification.read && (
                    <button
                      className="text-button"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Notifications;