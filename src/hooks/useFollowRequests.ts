import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import followService from "@/services/follow.service";
import userService from "@/services/user.service";
import useAuthStore from "@/stores/useAuthStore";
import { useSeedFollowCache } from "@/hooks/useFollow";
import type { IFollowInfo } from "@/hooks/useFollow";
import type { IUser } from "@/types/user.type";

export interface IFollowerItem {
  id: number;
  user: IUser;
  followedBack: boolean;
}

export const useFollowRequests = () => {
  const { user } = useAuthStore();
  const seedFollowCache = useSeedFollowCache();

  const { data: followerUsers = [], isLoading: isLoadingFollowers } = useQuery({
    queryKey: ["followers", user?.id],
    queryFn: async () => {
      const [followersRes, usersRes] = await Promise.all([
        followService.getFollowers(user!.id),
        userService.getAllUsers(),
      ]);

      const followerIds: number[] = followersRes.data.data ?? [];
      const allUsers: IUser[] = usersRes?.data?.data ?? usersRes?.data ?? [];
      const usersMap = new Map(allUsers.map((u) => [u.id, u]));

      return followerIds
        .map((id) => usersMap.get(id))
        .filter((u): u is IUser => u !== undefined);
    },
    enabled: !!user,
    staleTime: 30 * 1000,
  });

  const followerIds = followerUsers.map((u) => u.id);

  const { data: batchData, isLoading: isLoadingBatch } = useQuery({
    queryKey: ["follow", "batch", followerIds],
    queryFn: async () => {
      const res = await followService.getBatch(followerIds, user!.id);
      return res.data.data as Record<number, IFollowInfo>;
    },
    enabled: !!user && followerIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (batchData) seedFollowCache(batchData);
  }, [batchData, seedFollowCache]);

  const followers: IFollowerItem[] = followerUsers.map((u) => ({
    id: u.id,
    user: u,
    followedBack: batchData?.[u.id]?.followed ?? false,
  }));

  const pendingFollowBack = followers.filter((f) => !f.followedBack);

  return {
    followers,
    pendingFollowBack,
    pendingCount: pendingFollowBack.length,
    isLoading: isLoadingFollowers || (followerIds.length > 0 && isLoadingBatch),
  };
};
