import { useState } from "react";
import { useParams } from "react-router";
import { useProfile } from "@/hooks/useProfile";
import Spinner from "@/components/ui/Spinner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfilePostsTab from "@/components/profile/ProfilePostsTab";
import ProfileAlbumsTab from "@/components/profile/ProfileAlbumsTab";
import ProfileIntro from "@/components/profile/ProfileIntro";
import CreatePostBox from "@/components/posts/CreatePostBox";
import useAuthStore from "@/stores/useAuthStore";

const ProfilePage = () => {
  const { userId } = useParams();
  const id = Number(userId);
  const { user } = useAuthStore();
  const { profile, isLoading, isError } = useProfile(id);
  const [activeTab, setActiveTab] = useState<"posts" | "albums">("posts");

  const isOwnProfile = user?.id === id;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-gray-500">
        User tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="w-full">
      <ProfileHeader id={id} profile={profile} isOwnProfile={isOwnProfile} />
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        id={id}
        profileName={profile.name}
      />

      <div className="mx-auto mt-4 max-w-300 px-4 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-6 pb-12 lg:grid-cols-[380px_1fr]">
          {/* Left Content */}
          <div className="sticky top-30 flex flex-col gap-6">
            <ProfileIntro profile={profile} isOwnProfile={isOwnProfile} />
          </div>

          {/* Right Content */}
          <div className="flex flex-col gap-6">
            {activeTab === "posts" && isOwnProfile && <CreatePostBox />}
            {activeTab === "posts" && (
              <ProfilePostsTab userId={id} profile={profile} />
            )}
            {activeTab === "albums" && <ProfileAlbumsTab userId={id} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
