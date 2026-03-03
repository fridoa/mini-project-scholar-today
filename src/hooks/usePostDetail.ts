import { useQuery, useQueryClient } from "@tanstack/react-query";
import postService from "@/services/post.service";
import userService from "@/services/user.service";
import type { IPost } from "@/types/post.type";
import type { IUser } from "@/types/user.type";

export const usePostDetail = (postId: number | string) => {
  const queryClient = useQueryClient();

  const cachedPost = (() => {
    const queries = queryClient.getQueriesData<{
      pages?: { posts: IPost[] }[];
      data?: { data: IPost[] };
    }>({ queryKey: ["posts"] });
    for (const [, data] of queries) {
      if (data?.pages) {
        for (const page of data.pages) {
          const found = page.posts?.find((p: IPost) => p.id === postId);
          if (found) return found;
        }
      }

      const found = data?.data?.data?.find((p: IPost) => p.id === postId);
      if (found) return found;
    }
    return null;
  })();

  const {
    data: postResponse,
    isLoading: isLoadingPost,
    isError: isErrorPost,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => postService.getPostById(postId),
    enabled: !!postId,
    initialData: cachedPost
      ? ({
          data: {
            data: cachedPost,
          },
        } as unknown as Awaited<ReturnType<typeof postService.getPostById>>)
      : undefined,
  });

  const post: IPost | null = postResponse?.data?.data || null;

  const { data: authorResponse } = useQuery({
    queryKey: ["users", "detail", post?.userId],
    queryFn: () => userService.getUserById(post!.userId),
    enabled: !!post?.userId,
    staleTime: 5 * 60 * 1000,
  });

  const author: IUser | null = authorResponse?.data?.data || null;

  return {
    post,
    author,
    isLoading: isLoadingPost,
    isError: isErrorPost,
  };
};
