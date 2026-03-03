import { useQuery } from "@tanstack/react-query";
import postService from "@/services/post.service";
import type { IComment } from "@/types/post.type";

export const useComments = (postId: number | string) => {
  const isLocal =
    typeof postId === "string" && String(postId).startsWith("local-");

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => postService.getCommentsByPostId(postId as number),
    enabled: !!postId && !isLocal,
  });

  const comments: IComment[] = response?.data?.data || [];

  return {
    comments,
    isLoading,
    isError,
  };
};
