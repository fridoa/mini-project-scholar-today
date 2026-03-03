import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import likeService from "@/services/like.service";
import useAuthStore from "@/stores/useAuthStore";

interface UseLikeOptions {
  autoFetch?: boolean;
}

export const useLike = (postId: string | number, options?: UseLikeOptions) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const postIdStr = String(postId);
  const autoFetch = options?.autoFetch ?? false;

  const { data, isLoading } = useQuery({
    queryKey: ["posts", "like", postIdStr],
    queryFn: async () => {
      const res = await likeService.getStatus(postIdStr, user!.id);
      return res.data.data as { liked: boolean; count: number };
    },
    enabled: !!user && autoFetch,
    staleTime: 30 * 1000,
  });

  const mutation = useMutation({
    mutationFn: () => likeService.toggle(postIdStr, user!.id),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["posts", "like", postIdStr],
      });

      const previous = queryClient.getQueryData<{
        liked: boolean;
        count: number;
      }>(["posts", "like", postIdStr]);

      queryClient.setQueryData(
        ["posts", "like", postIdStr],
        (old: { liked: boolean; count: number } | undefined) => {
          if (!old) return { liked: true, count: 1 };
          return {
            liked: !old.liked,
            count: old.liked ? old.count - 1 : old.count + 1,
          };
        },
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["posts", "like", postIdStr],
          context.previous,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", "like", postIdStr],
      });
    },
  });

  return {
    liked: data?.liked ?? false,
    count: data?.count ?? 0,
    isLoading,
    toggleLike: mutation.mutate,
    isToggling: mutation.isPending,
  };
};
