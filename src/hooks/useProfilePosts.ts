import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import postService from "@/services/post.service";
import { useBatchPostInteractions } from "@/hooks/useBatchPostInteractions";
import type { IPost } from "@/types/post.type";

export const useProfilePosts = (userId: number) => {
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts", "profile", userId],
    queryFn: () => postService.getPostsByUserId(userId),
    enabled: !!userId,
  });

  const posts = useMemo<IPost[]>(() => response?.data?.data || [], [response]);

  const postIds = useMemo(() => posts.map((p) => String(p.id)), [posts]);

  useBatchPostInteractions({
    scope: ["profile", userId],
    postIds,
  });

  return {
    posts,
    isLoading,
    isError,
  };
};
