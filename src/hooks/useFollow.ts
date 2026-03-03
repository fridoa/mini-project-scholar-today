import { useCallback } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  notifyManager,
} from "@tanstack/react-query";
import followService from "@/services/follow.service";
import useAuthStore from "@/stores/useAuthStore";

export interface IFollowInfo {
  followed: boolean;
  isFriend: boolean;
  followsYou: boolean;
  followersCount: number;
  followingCount: number;
}

const FOLLOW_STALE_TIME = 5 * 60 * 1000;

interface UseFollowOptions {
  autoFetch?: boolean;
}

export const useFollow = (targetUserId: number, options?: UseFollowOptions) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const autoFetch = options?.autoFetch ?? true;

  const { data, isLoading } = useQuery({
    queryKey: ["follow", "info", targetUserId],
    queryFn: async () => {
      const res = await followService.getInfo(targetUserId, user!.id);
      return res.data.data as IFollowInfo;
    },
    enabled: !!user && targetUserId > 0 && autoFetch,
    staleTime: FOLLOW_STALE_TIME,
  });

  const mutation = useMutation({
    mutationFn: () => followService.toggle(targetUserId, user!.id),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["follow", "info", targetUserId],
      });

      const previous = queryClient.getQueryData<IFollowInfo>([
        "follow",
        "info",
        targetUserId,
      ]);

      queryClient.setQueryData(
        ["follow", "info", targetUserId],
        (old: IFollowInfo | undefined): IFollowInfo => {
          if (!old)
            return {
              followed: true,
              isFriend: false,
              followsYou: false,
              followersCount: 1,
              followingCount: 0,
            };
          if (old.followed) {
            return {
              ...old,
              followed: false,
              isFriend: false,
              followersCount: old.followersCount - 1,
            };
          }
          return {
            ...old,
            followed: true,
            isFriend: old.followsYou,
            followersCount: old.followersCount + 1,
          };
        },
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["follow", "info", targetUserId],
          context.previous,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["follow", "info", targetUserId],
      });
      queryClient.invalidateQueries({
        queryKey: ["follow", "batch"],
      });
    },
  });

  return {
    followed: data?.followed ?? false,
    isFriend: data?.isFriend ?? false,
    followsYou: data?.followsYou ?? false,
    followersCount: data?.followersCount ?? 0,
    followingCount: data?.followingCount ?? 0,
    isLoading,
    toggleFollow: mutation.mutate,
    isToggling: mutation.isPending,
  };
};

export const useSeedFollowCache = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (batchData: Record<number, IFollowInfo>) => {
      notifyManager.batch(() => {
        for (const [userId, info] of Object.entries(batchData)) {
          queryClient.setQueryData(["follow", "info", Number(userId)], info);
        }
      });
    },
    [queryClient],
  );
};
