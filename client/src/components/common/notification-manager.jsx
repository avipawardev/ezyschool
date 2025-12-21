import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import NotificationList from "./notification-list";
import NotificationCreator from "../admin-view/notification-creator";
import { fetchNotificationsService } from "@/services/notification-service";

function NotificationManager({ userId, role = "student" }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [iscreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUnreadCount();
    }
  }, [userId]);

  const fetchUnreadCount = async () => {
    const response = await fetchNotificationsService(userId);
    if (response.success) {
      setUnreadCount(response.data.filter((n) => !n.isRead).length);
    }
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[300px]">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {role !== "student" && (
            <>
              <div className="p-2">
                <Button
                  className="w-full"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  Create Notification
                </Button>
              </div>
              <DropdownMenuSeparator />
            </>
          )}
          <NotificationList
            userId={userId}
            onNotificationChange={fetchUnreadCount}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={iscreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Notification</DialogTitle>
          </DialogHeader>
          <NotificationCreator mode={role} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NotificationManager;
