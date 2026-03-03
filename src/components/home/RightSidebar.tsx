import { useEffect, useMemo } from "react";
import { MdPersonAdd, MdPersonRemove, MdPeople } from "react-icons/md";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useFollow, useSeedFollowCache } from "@/hooks/useFollow";
import type { IFollowInfo } from "@/hooks/useFollow";
import { useFriends } from "@/hooks/useFriends";
import { useSuggestedUsers } from "@/hooks/useSuggestedUsers";
import { useFollowRequests } from "@/hooks/useFollowRequests";
import followService from "@/services/follow.service";
import useAuthStore from "@/stores/useAuthStore";
import { getAvatarByUserId } from "@/utils/avatar";
import Card from "@/components/ui/Card";
import FooterLinks from "@/components/ui/FooterLinks";

const FollowUserButton = ({ userId }: { userId: number }) => {
  const { followed, toggleFollow, isToggling } = useFollow(userId, {
    autoFetch: false,
  });

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFollow();
      }}
      disabled={isToggling}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
        followed
          ? "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500"
          : "bg-[#fdeee7] text-[#ec5b13] hover:bg-[#f6d7c7]"
      }`}
      title={followed ? "Unfollow" : "Follow"}
    >
      {followed ? <MdPersonRemove size={18} /> : <MdPersonAdd size={18} />}
    </button>
  );
};

const RightSidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { suggestedUsers, isLoading } = useSuggestedUsers(4);
  const seedFollowCache = useSeedFollowCache();
  const { friends } = useFriends(5);
  const { pendingFollowBack } = useFollowRequests();
  const newFollowers = pendingFollowBack.slice(0, 3);

  const userIds = useMemo(
    () => suggestedUsers.map((u) => u.id),
    [suggestedUsers],
  );
  const { data: batchData } = useQuery({
    queryKey: ["follow", "batch", userIds],
    queryFn: async () => {
      const res = await followService.getBatch(userIds, user!.id);
      return res.data.data as Record<number, IFollowInfo>;
    },
    enabled: !!user && userIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (batchData) seedFollowCache(batchData);
  }, [batchData, seedFollowCache]);

  const visibleUsers = useMemo(() => {
    if (!batchData) return suggestedUsers.slice(0, 4);
    return suggestedUsers.filter((u) => !batchData[u.id]?.followed).slice(0, 4);
  }, [suggestedUsers, batchData]);

  return (
    <div className="sticky top-25 flex flex-col gap-4">
      {/* Who to follow */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Who to follow</h2>
          <button className="text-xs font-semibold text-[#ec5b13] hover:underline">
            View All
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex animate-pulse items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 rounded bg-gray-200" />
                  <div className="h-2 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {visibleUsers.map((user) => (
              <li key={user.id} className="flex items-center gap-3">
                <img
                  src={getAvatarByUserId(user.id)}
                  alt={user.name}
                  className="h-10 w-10 cursor-pointer rounded-full object-cover"
                  onClick={() => navigate(`/users/${user.id}`)}
                />
                <div
                  className="flex-1 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  <p className="truncate text-sm font-bold text-gray-900 hover:text-[#ec5b13]">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-gray-400">
                    @{user.username}
                  </p>
                </div>
                <FollowUserButton userId={user.id} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* New Followers */}
      {newFollowers.length > 0 && (
        <div className="px-1">
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-gray-700">New Followers</h2>
            <button
              className="text-xs font-semibold text-[#ec5b13] hover:underline"
              onClick={() => navigate("/follow-requests")}
            >
              View All
            </button>
          </div>
          <ul className="flex flex-col divide-y divide-gray-100">
            {newFollowers.map((f) => (
              <li key={f.id} className="flex items-center gap-3 py-2.5">
                <img
                  src={getAvatarByUserId(f.user.id)}
                  alt={f.user.name}
                  className="h-9 w-9 shrink-0 cursor-pointer rounded-full object-cover"
                  onClick={() => navigate(`/users/${f.id}`)}
                />
                <div
                  className="flex-1 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/users/${f.id}`)}
                >
                  <p className="truncate text-sm font-semibold text-gray-900 hover:text-[#ec5b13]">
                    {f.user.name}
                  </p>
                  <p className="truncate text-xs text-gray-400">
                    @{f.user.username}
                  </p>
                </div>
                <FollowUserButton userId={f.id} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Friends */}
      {friends.length > 0 && (
        <div className="px-1">
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-gray-700">Friends</h2>
            <MdPeople size={18} className="text-gray-300" />
          </div>
          <ul className="flex flex-col gap-1">
            {friends.map((friend) => (
              <li
                key={friend.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-1 py-1 transition-colors hover:bg-gray-50"
                onClick={() => navigate(`/users/${friend.id}`)}
              >
                <div className="relative">
                  <img
                    src={getAvatarByUserId(friend.id)}
                    alt={friend.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-400" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {friend.name}
                  </p>
                  <p className="truncate text-xs text-gray-400">
                    @{friend.username}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <FooterLinks />
    </div>
  );
};

export default RightSidebar;
