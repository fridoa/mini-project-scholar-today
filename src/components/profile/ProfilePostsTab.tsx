import { useProfilePosts } from "@/hooks/useProfilePosts";
import Spinner from "@/components/ui/Spinner";
import PostCard from "@/components/posts/PostCard";
import type { IUser } from "@/types/user.type";

interface ProfilePostsTabProps {
  userId: number;
  profile: IUser;
}

const ProfilePostsTab = ({ userId, profile }: ProfilePostsTabProps) => {
  const { posts, isLoading, isError } = useProfilePosts(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center text-red-500">
        Gagal memuat postingan.
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        Belum ada postingan.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} author={profile} />
      ))}
    </div>
  );
};

export default ProfilePostsTab;
