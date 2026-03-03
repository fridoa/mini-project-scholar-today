import { MdBookmarkBorder } from "react-icons/md";
import { useBookmarkedPosts } from "@/hooks/useBookmarkedPosts";
import PostCard from "@/components/posts/PostCard";
import { PostCardSkeleton } from "@/components/ui/Skeleton";
import Card from "@/components/ui/Card";

const BookmarksPage = () => {
  const { posts, usersMap, isLoading, isError } = useBookmarkedPosts();

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">
          Gagal memuat bookmarks. Coba lagi nanti.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-170 flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookmarks</h1>
        <p className="mt-1 text-sm text-gray-500">
          Posts that you've saved for later
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <MdBookmarkBorder size={32} className="text-gray-300" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-gray-700">
                No saved posts yet
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Tap the bookmark icon on any post to save it here.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-400">
            {posts.length} saved {posts.length === 1 ? "post" : "posts"}
          </p>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              author={usersMap[post.userId]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
