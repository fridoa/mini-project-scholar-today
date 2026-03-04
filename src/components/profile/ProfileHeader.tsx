import { toast } from "react-toastify";
import {
  MdWork,
  MdPersonAdd,
  MdPersonRemove,
  MdShare,
  MdPeople,
} from "react-icons/md";
import { getAvatarByUserId } from "@/utils/avatar";
import type { IUser } from "@/types/user.type";
import { useFollow } from "@/hooks/useFollow";
import Button from "@/components/ui/Button";

interface ProfileHeaderProps {
  id: number;
  profile: IUser;
  isOwnProfile: boolean;
}

const ProfileHeader = ({ id, profile, isOwnProfile }: ProfileHeaderProps) => {
  const {
    followed,
    isFriend,
    followsYou,
    followersCount,
    followingCount,
    toggleFollow,
    isToggling,
  } = useFollow(id);

  const handleShareProfile = async () => {
    const url = `${window.location.origin}/users/${id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.name,
          text: `Check out ${profile.name}'s profile on Scholar Today!`,
          url,
        });
      } catch {
        toast.error("Failed to share profile.");
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied to clipboard!");
    }
  };

  return (
    <div className="overflow-hidden bg-white shadow-sm">
      <div className="group relative h-62.5 bg-linear-to-b from-gray-200 to-gray-400 sm:h-87.5" />

      <div className="w-full">
        <div className="border-b border-gray-200 px-4 pb-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            {/* Avatar + Name row on mobile, stacked on desktop */}
            <div className="flex items-center gap-4 sm:contents">
              {/* Avatar — overlaps banner */}
              <div className="relative -mt-12 shrink-0 sm:-mt-20">
                <div className="rounded-full bg-white p-1 shadow-md sm:p-1.5">
                  <img
                    src={getAvatarByUserId(id)}
                    alt={profile.name}
                    className="h-20 w-20 rounded-full border-3 border-white object-cover sm:h-40 sm:w-40 sm:border-4"
                  />
                </div>
                <button className="absolute right-1 bottom-1 rounded-full bg-gray-100 p-1.5 shadow-sm transition-colors hover:bg-gray-200 sm:right-3 sm:bottom-3 sm:p-2">
                  <MdWork size={16} className="text-[#ec5b13] sm:hidden" />
                  <MdWork size={20} className="hidden text-[#ec5b13] sm:block" />
                </button>
              </div>

              {/* Name + stats */}
              <div className="min-w-0 flex-1 pb-1">
                <h1 className="truncate text-xl font-extrabold text-gray-900 sm:text-3xl">
                  {profile.name}
                </h1>
                <p className="mt-0.5 text-sm font-bold text-gray-500 sm:text-base">
                  @{profile.username}
                </p>
                <div className="mt-1.5 flex gap-4 sm:mt-2.5 sm:gap-5">
                  <span className="text-xs text-gray-500 sm:text-sm">
                    <span className="font-bold text-gray-900">
                      {followingCount}
                    </span>{" "}
                    Following
                  </span>
                  <span className="text-xs text-gray-500 sm:text-sm">
                    <span className="font-bold text-gray-900">
                      {followersCount}
                    </span>{" "}
                    Followers
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex shrink-0 gap-2 sm:pb-1">
              {isOwnProfile ? (
                <>
                  <Button size="sm" className="flex-1 sm:flex-none">+ Add to Story</Button>
                  <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                    Edit Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant={followed ? "outline" : "primary"}
                    icon={
                      isFriend ? (
                        <MdPeople size={16} />
                      ) : followed ? (
                        <MdPersonRemove size={16} />
                      ) : (
                        <MdPersonAdd size={16} />
                      )
                    }
                    onClick={() => toggleFollow()}
                    disabled={isToggling}
                  >
                    {isFriend
                      ? "Friends"
                      : followed
                        ? "Following"
                        : followsYou
                          ? "Follow Back"
                          : "Follow"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<MdShare size={16} />}
                    onClick={handleShareProfile}
                    className="flex-1 sm:flex-none"
                  >
                    Share Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
