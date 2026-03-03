import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { MdLogout, MdPerson } from "react-icons/md";
import useAuthStore from "@/stores/useAuthStore";
import Logo from "@/components/ui/Logo";
import SearchInput from "@/components/ui/SearchInput";
import NotificationBell from "@/components/notifications/NotificationBell";
import { getAvatarByUserId } from "@/utils/avatar";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between px-4 py-4 lg:px-6 xl:px-8">
        <button
          onClick={() => {
            if (location.pathname !== "/") navigate("/");
          }}
          className="cursor-pointer"
        >
          <Logo size="sm" />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden w-64 sm:block">
            <SearchInput placeholder="Search users..." />
          </div>

          <NotificationBell />

          <div className="relative flex items-center" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="h-9 w-9 cursor-pointer overflow-hidden rounded-full transition-transform hover:scale-105"
            >
              <img
                src={getAvatarByUserId(user?.id || 1)}
                alt={user?.name || "User"}
                className="h-full w-full object-cover"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      const targetPath = `/users/${user?.id}`;
                      if (location.pathname !== targetPath) {
                        navigate(targetPath);
                      }
                      setDropdownOpen(false);
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <MdPerson size={18} />
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <MdLogout size={18} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
