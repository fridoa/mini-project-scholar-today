import { useNavigate, useLocation } from "react-router";
import {
  MdDynamicFeed,
  MdBookmark,
  MdChecklist,
  MdPersonAdd,
} from "react-icons/md";
import { useFollowRequests } from "@/hooks/useFollowRequests";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pendingCount } = useFollowRequests();

  const navItems = [
    { name: "Feed", href: "/", icon: MdDynamicFeed },
    { name: "Tasks", href: "/todos", icon: MdChecklist },
    { name: "Bookmarks", href: "/bookmarks", icon: MdBookmark },
    {
      name: "Followers",
      href: "/follow-requests",
      icon: MdPersonAdd,
      badge: pendingCount || undefined,
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/90 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.href)}
              className={`relative flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-xl py-2 transition-colors ${
                isActive
                  ? "text-[#ec5b13]"
                  : "text-gray-400 active:text-gray-600"
              }`}
            >
              <div className="relative">
                <item.icon size={22} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ec5b13] px-0.5 text-[9px] font-bold text-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">{item.name}</span>

              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#ec5b13]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Safe area for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default MobileBottomNav;
