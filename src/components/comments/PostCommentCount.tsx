import { useComments } from "@/hooks/useComments";

interface PostCommentCountProps {
  postId: number | string;
}

const PostCommentCount = ({ postId }: PostCommentCountProps) => {
  const { comments, isLoading, isError } = useComments(postId);

  if (isError || comments.length === 0) return null;

  return (
    <div className="relative z-0 -ml-2 flex h-6 w-min min-w-6 items-center justify-center rounded-full border-2 border-white bg-[#ec5b13] px-1 text-[10px] font-bold text-white">
      {isLoading ? "..." : `+${comments.length}`}
    </div>
  );
};

export default PostCommentCount;
