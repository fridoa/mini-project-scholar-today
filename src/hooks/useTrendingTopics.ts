import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getTrendingWords } from "@/utils/text";
import type { IPost } from "@/types/post.type";

interface PostsCache {
  pages: { posts: IPost[] }[];
}

export const useTrendingTopics = (limit: number = 5): string[] => {
  const queryClient = useQueryClient();
  const dataUpdatedAt = queryClient.getQueryState(["posts", "feed"])?.dataUpdatedAt;

  return useMemo(() => {
    const cached = queryClient.getQueryData<PostsCache>(["posts", "feed"]);
    if (!cached) return [];
    const posts = cached.pages.flatMap((p) => p.posts);
    return getTrendingWords(posts, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUpdatedAt, queryClient, limit]);
};
