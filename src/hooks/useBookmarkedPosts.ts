import { useQuery, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import bookmarkService from "@/services/bookmark.service";
import userService from "@/services/user.service";
import useAuthStore from "@/stores/useAuthStore";
import { useBatchPostInteractions } from "@/hooks/useBatchPostInteractions";
import type { IPost } from "@/types/post.type";
import type { IUser } from "@/types/user.type";

export const useBookmarkedPosts = () => {
  const { user } = useAuthStore();

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["posts", "bookmarks", user?.id],
    queryFn: () => bookmarkService.getBookmarkedPosts(user!.id),
    enabled: !!user,
    staleTime: 30 * 1000,
  });

  const posts: IPost[] = useMemo(() => response?.data?.data || [], [response]);

  const userIds = useMemo(
    () => [...new Set(posts.map((p) => p.userId))],
    [posts],
  );

  const usersMap = useQueries({
    queries: userIds.map((id) => ({
      queryKey: ["users", "detail", id],
      queryFn: () => userService.getUserById(id),
      staleTime: 5 * 60 * 1000,
      enabled: !!id,
      select: (res: { data: { data: IUser } }) => res.data.data,
    })),
    combine: (results) => {
      const map: Record<number, IUser> = {};
      results.forEach((r) => {
        if (r.data) map[r.data.id] = r.data;
      });
      return map;
    },
  });

  const postIds = useMemo(() => posts.map((p) => String(p.id)), [posts]);

  useBatchPostInteractions({
    scope: ["bookmarks", user?.id ?? 0],
    postIds,
  });

  return {
    posts,
    usersMap,
    isLoading,
    isError,
    refetch,
  };
};
