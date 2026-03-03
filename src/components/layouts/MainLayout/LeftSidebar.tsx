import { useNavigate, useLocation } from "react-router";
import {
  MdDynamicFeed,
  MdBookmark,
  MdChecklist,
  MdPersonAdd,
} from "react-icons/md";
import { useFollowRequests } from "@/hooks/useFollowRequests";
import useAuthStore from "@/stores/useAuthStore";
import { getAvatarByUserId } from "@/utils/avatar";
import { useFollow } from "@/hooks/useFollow";
import { useTrendingTopics } from "@/hooks/useTrendingTopics";
import Card from "@/components/ui/Card";

const LeftSidebar = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { followersCount, followingCount } = useFollow(user?.id ?? 0);
  const trendingWords = useTrendingTopics(5);
  const isHome = location.pathname === "/";
  const { pendingCount } = useFollowRequests();

  const navigation = [
    {
      name: "My Feed",
      href: "/",
      icon: MdDynamicFeed,
      badge: undefined as number | undefined,
    },
    {
      name: "My Tasks",
      href: "/todos",
      icon: MdChecklist,
      badge: undefined as number | undefined,
    },
    {
      name: "Bookmarks",
      href: "/bookmarks",
      icon: MdBookmark,
      badge: undefined as number | undefined,
    },
    {
      name: "Followers",
      href: "/follow-requests",
      icon: MdPersonAdd,
      badge: pendingCount || undefined,
    },
  ];

  if (!user) return null;

  return (
    <div className="flex flex-col gap-4">
      <Card
        className="group relative cursor-pointer overflow-hidden p-0 pb-4 transition-all hover:-translate-y-1 hover:shadow-lg"
        onClick={() => navigate(`/users/${user.id}`)}
      >
        <div className="h-24 w-full bg-linear-to-r from-[#ec5b13] to-[#ff8c42] opacity-90 transition-opacity group-hover:opacity-100">
          <div className="h-full w-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
        </div>

        <div className="px-5">
          <div className="relative -mt-12 mb-3 flex items-end justify-between">
            <img
              src={getAvatarByUserId(user.id)}
              alt={user.name}
              className="relative z-10 h-24 w-24 rounded-full border-4 border-white object-cover shadow-md transition-transform group-hover:scale-105"
            />
          </div>

          <div className="mb-3">
            <h2 className="line-clamp-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-[#ec5b13]">
              {user.name}
            </h2>
            <p className="text-sm font-medium text-gray-500">
              @{user.username}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-center">
            <div>
              <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                Post
              </p>
              <p className="text-lg font-bold text-gray-900">12</p>
            </div>
            <div className="border-l border-gray-100 px-4">
              <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                Following
              </p>
              <p className="text-lg font-bold text-gray-900">
                {followingCount}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                Followers
              </p>
              <p className="text-lg font-bold text-gray-900">
                {followersCount}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-2">
        <ul className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[#fdeee7] text-[#ec5b13]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.href !== "#") navigate(item.href);
                  }}
                >
                  <item.icon
                    size={22}
                    className={isActive ? "text-[#ec5b13]" : "text-gray-400"}
                  />
                  {item.name}
                  {item.badge !== undefined && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ec5b13] px-1 text-[10px] font-bold text-white">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </Card>

      {isHome && trendingWords.length > 0 && (
        <div className="px-2">
          <p className="mb-1 px-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
            Trending
          </p>
          <ul className="flex flex-col">
            {trendingWords.map((word, i) => (
              <li key={i} className="group cursor-pointer">
                <span className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900">
                  <span className="text-[#ec5b13]">#</span>
                  {word}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
