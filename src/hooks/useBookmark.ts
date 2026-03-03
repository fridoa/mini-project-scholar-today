import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import bookmarkService from "@/services/bookmark.service";
import useAuthStore from "@/stores/useAuthStore";

interface UseBookmarkOptions {
  autoFetch?: boolean;
}

export const useBookmark = (
  postId: string | number,
  options?: UseBookmarkOptions,
) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const postIdStr = String(postId);
  const autoFetch = options?.autoFetch ?? false;

  const { data, isLoading } = useQuery({
    queryKey: ["posts", "bookmark", postIdStr],
    queryFn: async () => {
      const res = await bookmarkService.getStatus(postIdStr, user!.id);
      return res.data.data as { bookmarked: boolean };
    },
    enabled: !!user && autoFetch,
    staleTime: 30 * 1000,
  });

  const mutation = useMutation({
    mutationFn: () => bookmarkService.toggle(postIdStr, user!.id),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["posts", "bookmark", postIdStr],
      });

      const previous = queryClient.getQueryData<{ bookmarked: boolean }>([
        "posts",
        "bookmark",
        postIdStr,
      ]);

      queryClient.setQueryData(
        ["posts", "bookmark", postIdStr],
        (old: { bookmarked: boolean } | undefined) => ({
          bookmarked: !old?.bookmarked,
        }),
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["posts", "bookmark", postIdStr],
          context.previous,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", "bookmark", postIdStr],
      });
      queryClient.invalidateQueries({ queryKey: ["posts", "bookmarks"] });
    },
  });

  return {
    bookmarked: data?.bookmarked ?? false,
    isLoading,
    toggleBookmark: mutation.mutate,
    isToggling: mutation.isPending,
  };
};
