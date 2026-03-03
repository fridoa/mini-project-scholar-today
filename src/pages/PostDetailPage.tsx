import { useParams, useNavigate } from "react-router";
import { MdArrowBack } from "react-icons/md";
import { usePostDetail } from "@/hooks/usePostDetail";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import Spinner from "@/components/ui/Spinner";
import PostCard from "@/components/posts/PostCard";
import LikeButton from "@/components/posts/LikeButton";
import BookmarkButton from "@/components/posts/BookmarkButton";
import CommentList from "@/components/comments/CommentList";

const PostDetailPage = () => {
  useDocumentTitle("Post Detail");
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = id!;
  const { post, author, isLoading, isError } = usePostDetail(postId);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Post tidak ditemukan.</p>
        <button
          onClick={() => navigate("/")}
          className="text-sm font-medium text-[#ec5b13] hover:underline"
        >
          Kembali ke Home
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex cursor-pointer items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
      >
        <MdArrowBack size={18} />
        Back
      </button>

      <PostCard
        post={post}
        author={author ?? undefined}
        showFooter={false}
        clickable={false}
      />

      <div className="mt-3 flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-3 shadow-sm">
        <LikeButton postId={postId} autoFetch />
        <BookmarkButton postId={postId} autoFetch />
      </div>

      <CommentList postId={postId} />
    </div>
  );
};

export default PostDetailPage;
