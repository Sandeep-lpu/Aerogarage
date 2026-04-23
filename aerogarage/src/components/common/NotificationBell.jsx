import { useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "../../app/router/routerStore";
import { Bell } from "lucide-react";
import { fetchNotifications, markNotificationRead } from "../../services/api/notificationApi";
import { useSocket } from "../../app/auth/SocketProvider";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();
  const socket = useSocket();
  const { navigate } = useRouter();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetchNotifications();
        return res?.data || { notifications: [], unreadCount: 0 };
      } catch (err) {
        console.error(err);
        return { notifications: [], unreadCount: 0 };
      }
    },
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (!socket) return;
    const handleNotification = () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };
    socket.on("new_notification", handleNotification);
    return () => socket.off("new_notification", handleNotification);
  }, [socket, queryClient]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkRead = async (id = null) => {
    try {
      await markNotificationRead(id);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (e) {
      console.error("Failed to mark notification as read", e);
    }
  };

  const unreadCount = data?.unreadCount || 0;
  const notifications = data?.notifications || [];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center p-2 text-[var(--amc-text-body)] hover:text-[var(--amc-accent-400)] transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-md border border-[var(--amc-border)] bg-[var(--amc-bg-surface)] shadow-lg z-50">
          <div className="flex items-center justify-between border-b border-[var(--amc-border)] p-3">
            <h3 className="text-sm font-semibold text-[var(--amc-text-strong)]">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => handleMarkRead()}
                className="text-xs text-[var(--amc-accent-500)] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-[var(--amc-text-muted)]">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`cursor-pointer border-b border-[var(--amc-border)] p-3 last:border-0 hover:bg-[var(--amc-bg-main)] transition-colors ${
                    !n.read ? "bg-[var(--amc-bg-main)]" : ""
                  }`}
                  onClick={() => {
                    if (!n.read) handleMarkRead(n._id);
                    if (n.link) {
                      setIsOpen(false);
                      if (n.link.startsWith("http")) window.location.href = n.link;
                      else navigate(n.link);
                    }
                  }}
                >
                  <p className="text-sm font-medium text-[var(--amc-text-strong)]">{n.title}</p>
                  <p className="mt-1 text-xs text-[var(--amc-text-body)]">{n.message}</p>
                  <span className="mt-2 block text-[10px] text-[var(--amc-text-muted)]">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
