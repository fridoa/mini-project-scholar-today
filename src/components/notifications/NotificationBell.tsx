import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  MdNotifications,
  MdNotificationsNone,
  MdFavorite,
  MdPersonAdd,
  MdComment,
  MdDoneAll,
} from "react-icons/md";
import { useNotifications } from "@/hooks/useNotifications";
import { getAvatarByUserId } from "@/utils/avatar";
import userService from "@/services/user.service";
import type {
  INotification,
  NotificationType,
} from "@/types/notification.type";

const typeConfig: Record<
  NotificationType,
  { icon: React.ElementType; color: string; bg: string }
> = {
  like: { icon: MdFavorite, color: "text-red-500", bg: "bg-red-50" },
  follow: { icon: MdPersonAdd, color: "text-blue-500", bg: "bg-blue-50" },
  comment: { icon: MdComment, color: "text-green-500", bg: "bg-green-50" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const NotificationBell = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllRead } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [userMap, setUserMap] = useState<Record<number, string>>({});

  useEffect(() => {
    if (open && notifications.length > 0) {
      // Fetch all user names for notifications
      const uniqueIds = Array.from(
        new Set(notifications.map((n) => n.fromUserId)),
      );
      userService.getAllUsers().then((res) => {
        const allUsers = res.data.data || [];
        const map: Record<number, string> = {};
        for (const u of allUsers) {
          if (uniqueIds.includes(u.id)) map[u.id] = u.name;
        }
        setUserMap(map);
      });
    }
  }, [open, notifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: INotification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    if (notification.postId) {
      navigate(`/posts/${notification.postId}`);
    } else if (notification.type === "follow") {
      navigate(`/users/${notification.fromUserId}`);
    }

    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative cursor-pointer rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
      >
        {open || unreadCount > 0 ? (
          <MdNotifications size={22} className="text-[#ec5b13]" />
        ) : (
          <MdNotificationsNone size={22} />
        )}

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="flex cursor-pointer items-center gap-1 text-xs font-medium text-[#ec5b13] transition-colors hover:text-[#d14e0e]"
              >
                <MdDoneAll size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10">
                <MdNotificationsNone size={32} className="text-gray-300" />
                <p className="text-sm text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const config = typeConfig[notification.type];
                const TypeIcon = config.icon;
                const senderName =
                  userMap[notification.fromUserId] ||
                  `User ${notification.fromUserId}`;
                return (
                  <button
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      notification.isRead ? "" : "bg-orange-50/50"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={getAvatarByUserId(notification.fromUserId)}
                        alt="User"
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <span
                        className={`absolute -right-1 -bottom-1 flex h-4.5 w-4.5 items-center justify-center rounded-full ${config.bg}`}
                      >
                        <TypeIcon size={10} className={config.color} />
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="block text-sm text-gray-700">
                        <span className="font-semibold">{senderName}</span>{" "}
                        {notification.message}
                      </span>
                      <span className="mt-0.5 block text-xs text-gray-400">
                        {timeAgo(notification.createdAt)}
                      </span>
                    </div>

                    {!notification.isRead && (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ec5b13]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
