import { useComments } from "@/hooks/useComments";
import CommentCard from "@/components/comments/CommentCard";
import Spinner from "@/components/ui/Spinner";

interface CommentListProps {
  postId: number | string;
}

const CommentList = ({ postId }: CommentListProps) => {
  const { comments, isLoading, isError } = useComments(postId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="mt-6 text-center text-sm text-red-500">
        Gagal memuat komentar.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="mb-4 border-b border-gray-200 pb-3 text-base font-semibold text-gray-900">
        Comments ({comments.length})
      </h2>

      <div className="flex flex-col gap-3">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentList;
