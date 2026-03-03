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
          <div className="flex items-end justify-between gap-4">
            {/* Avatar — overlaps banner */}
            <div className="relative -mt-12 shrink-0 sm:-mt-20">
              <div className="rounded-full bg-white p-1.5 shadow-md">
                <img
                  src={getAvatarByUserId(id)}
                  alt={profile.name}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover sm:h-40 sm:w-40"
                />
              </div>
              <button className="absolute right-3 bottom-3 rounded-full bg-gray-100 p-2 shadow-sm transition-colors hover:bg-gray-200">
                <MdWork size={20} className="text-[#ec5b13]" />
              </button>
            </div>

            {/* Name + stats */}
            <div className="flex-1 pb-1">
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                {profile.name}
              </h1>
              <p className="mt-0.5 text-base font-bold text-gray-500">
                @{profile.username}
              </p>
              <div className="mt-2.5 flex gap-5">
                <span className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900">
                    {followingCount}
                  </span>{" "}
                  Following
                </span>
                <span className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900">
                    {followersCount}
                  </span>{" "}
                  Followers
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex shrink-0 gap-2 pb-1">
              {isOwnProfile ? (
                <>
                  <Button size="sm">+ Add to Story</Button>
                  <Button size="sm" variant="outline">
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
