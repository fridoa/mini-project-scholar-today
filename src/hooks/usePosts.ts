import { useInfiniteQuery, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import postService from "@/services/post.service";
import userService from "@/services/user.service";
import { useBatchPostInteractions } from "@/hooks/useBatchPostInteractions";
import type { IPost } from "@/types/post.type";
import type { IUser } from "@/types/user.type";

const POSTS_PER_PAGE = 10;

export const usePosts = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPosts,
    isError,
  } = useInfiniteQuery({
    queryKey: ["posts", "feed"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await postService.getAllPosts(pageParam, POSTS_PER_PAGE);
      return {
        posts: response.data.data as IPost[],
        pagination: response.data.pagination,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.posts.length < POSTS_PER_PAGE) return undefined;
      const totalData = lastPage.pagination?.totalData;
      if (totalData && allPages.length * POSTS_PER_PAGE >= totalData) {
        return undefined;
      }
      return allPages.length + 1;
    },
    staleTime: 5 * 60 * 1000,
  });

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.posts) || [],
    [data],
  );

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

  const totalPages = data?.pages.length ?? 0;
  const latestPage = data?.pages[data.pages.length - 1];
  const latestPostIds = useMemo(
    () => latestPage?.posts.map((p) => String(p.id)) ?? [],
    [latestPage],
  );

  useBatchPostInteractions({
    scope: ["feed", totalPages],
    postIds: latestPostIds,
  });

  return {
    posts,
    usersMap,
    isLoading: isLoadingPosts,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  };
};
