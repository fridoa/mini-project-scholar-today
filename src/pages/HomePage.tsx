import { motion } from "framer-motion";
import { usePosts } from "@/hooks/usePosts";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import PostCard from "@/components/posts/PostCard";
import { PostCardSkeleton } from "@/components/ui/Skeleton";
import CreatePostBox from "@/components/posts/CreatePostBox";
import InfiniteScrollTrigger from "@/components/posts/InfiniteScrollTrigger";
import RightSidebar from "@/components/home/RightSidebar";

const HomePage = () => {
  useDocumentTitle("Home");
  const { posts, usersMap, isLoading, isError, hasNextPage } = usePosts();

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Gagal memuat posts. Coba lagi nanti.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Main Content */}
      <div className="flex w-full max-w-300 flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CreatePostBox />
        </motion.div>

        <div className="flex flex-col gap-4">
          {isLoading && posts.length === 0
            ? Array.from({ length: 5 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))
            : posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-5%" }}
                  transition={{ duration: 0.4 }}
                >
                  <PostCard post={post} author={usersMap[post.userId]} />
                </motion.div>
              ))}
        </div>

        <InfiniteScrollTrigger />

        {!hasNextPage && !isLoading && posts.length > 0 && (
          <p className="py-6 text-center text-sm text-gray-400">
            Tidak ada post lagi.
          </p>
        )}
      </div>

      {/* Right Content */}
      <div className="mr-4 hidden w-full max-w-100 shrink-0 lg:block">
        <div className="sticky top-25">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
