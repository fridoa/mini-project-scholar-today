import { useQuery, useQueryClient, notifyManager } from "@tanstack/react-query";
import likeService from "@/services/like.service";
import bookmarkService from "@/services/bookmark.service";
import useAuthStore from "@/stores/useAuthStore";

const INTERACTIONS_STALE_TIME = 5 * 60 * 1000; 

interface UseBatchPostInteractionsOptions {
  scope: (string | number)[];
  postIds: string[];
  enabled?: boolean;
}

export const useBatchPostInteractions = ({
  scope,
  postIds,
  enabled = true,
}: UseBatchPostInteractionsOptions) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["posts", "interactions", ...scope],
    queryFn: async () => {
      const [likesRes, bookmarksRes] = await Promise.all([
        likeService.getBatchCounts(postIds, user!.id),
        bookmarkService.getBatchStatus(postIds, user!.id),
      ]);

      const likes = likesRes.data.data as Record<
        string,
        { liked: boolean; count: number }
      >;
      const bookmarks = bookmarksRes.data.data as Record<
        string,
        { bookmarked: boolean }
      >;

      
      
      notifyManager.batch(() => {
        Object.entries(likes).forEach(([id, data]) =>
          queryClient.setQueryData(["posts", "like", id], data),
        );
        Object.entries(bookmarks).forEach(([id, data]) =>
          queryClient.setQueryData(["posts", "bookmark", id], data),
        );
      });

      return { likes, bookmarks };
    },
    enabled: !!user && postIds.length > 0 && enabled,
    staleTime: INTERACTIONS_STALE_TIME,
  });
};
