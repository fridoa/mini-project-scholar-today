import { useNavigate } from "react-router";
import { MdPersonAdd } from "react-icons/md";
import { useFollowRequests } from "@/hooks/useFollowRequests";
import { useFollow } from "@/hooks/useFollow";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import type { IUser } from "@/types/user.type";
import { getAvatarByUserId } from "@/utils/avatar";
import Card from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

const FollowerRow = ({ id, user }: { id: number; user: IUser }) => {
  const navigate = useNavigate();
  const { followed, toggleFollow, isToggling } = useFollow(id, {
    autoFetch: false,
  });

  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50">
      <img
        src={getAvatarByUserId(id)}
        alt={user.name}
        className="h-12 w-12 shrink-0 cursor-pointer rounded-full object-cover"
        onClick={() => navigate(`/users/${id}`)}
      />
      <div
        className="min-w-0 flex-1 cursor-pointer"
        onClick={() => navigate(`/users/${id}`)}
      >
        <p className="truncate text-sm font-semibold text-gray-900">
          {user.name}
        </p>
        <p className="truncate text-xs text-gray-400">@{user.username}</p>
      </div>
      <button
        onClick={() => toggleFollow()}
        disabled={isToggling}
        className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
          followed
            ? "border border-gray-300 text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
            : "bg-[#ec5b13] text-white hover:bg-[#d44f0e]"
        }`}
      >
        {followed ? "Following" : "Follow Back"}
      </button>
    </div>
  );
};

const FollowRequestsPage = () => {
  useDocumentTitle("Followers");
  const { followers, isLoading } = useFollowRequests();

  return (
    <div className="flex w-full max-w-170 flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Followers</h1>
        <p className="mt-1 text-sm text-gray-500">People following you</p>
      </div>

      {isLoading ? (
        <Card className="flex flex-col divide-y divide-gray-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          ))}
        </Card>
      ) : followers.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <MdPersonAdd size={32} className="text-gray-300" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-gray-700">
                No followers yet
              </p>
              <p className="mt-1 text-sm text-gray-400">
                When someone follows you, they'll show up here.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex flex-col divide-y divide-gray-100 overflow-hidden p-0">
          {followers.map((f) => (
            <FollowerRow key={f.id} id={f.id} user={f.user} />
          ))}
        </Card>
      )}
    </div>
  );
};

export default FollowRequestsPage;
