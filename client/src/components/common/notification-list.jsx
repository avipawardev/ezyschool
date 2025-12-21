import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import {
  fetchNotificationsService,
  markNotificationAsReadService,
} from "@/services/notification-service";

function NotificationList({ userId, onNotificationChange }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    const response = await fetchNotificationsService(userId);
    if (response.success) {
      setNotifications(response.data);
    }
  };

  const handleMarkAsRead = async (id) => {
    const response = await markNotificationAsReadService(id);
    if (response.success) {
      fetchNotifications();
      if(onNotificationChange) onNotificationChange();
    }
  };

  if(!userId) return null;

  return (
    <div className="w-full max-h-[400px] overflow-y-auto space-y-2">
      {notifications && notifications.length > 0 ? (
        notifications.map((item) => (
          <div
            key={item._id}
            className={`p-3 border rounded-lg flex justify-between items-start ${
              item.isRead
                ? "bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                : "bg-white dark:bg-gray-950 border-blue-200 dark:border-blue-800 shadow-sm"
            }`}
          >
            <div>
               <p className={`text-sm text-black dark:text-white ${!item.isRead ? "font-semibold" : ""}`}>
                {item.message}
              </p>
              <span className="text-xs text-muted-foreground">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>
            {!item.isRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkAsRead(item._id)}
                className="text-xs h-6 px-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Mark Read
              </Button>
            )}
          </div>
        ))
      ) : (
        <p className="text-sm text-center text-muted-foreground p-4">
          No notifications
        </p>
      )}
    </div>
  );
}

export default NotificationList;
