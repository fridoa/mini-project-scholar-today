import { useQuery } from "@tanstack/react-query";
import followService from "@/services/follow.service";
import userService from "@/services/user.service";
import useAuthStore from "@/stores/useAuthStore";
import type { IUser } from "@/types/user.type";

export const useFriends = (limit?: number) => {
  const { user } = useAuthStore();

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends", user?.id],
    queryFn: async () => {
      const [friendsRes, usersRes] = await Promise.all([
        followService.getFriends(user!.id),
        userService.getAllUsers(),
      ]);

      const friendIds: number[] = friendsRes.data.data ?? [];
      const allUsers: IUser[] = usersRes?.data?.data ?? usersRes?.data ?? [];

      const usersMap = new Map(allUsers.map((u) => [u.id, u]));

      const result = friendIds
        .map((id) => usersMap.get(id))
        .filter((u): u is IUser => u !== undefined);

      return limit ? result.slice(0, limit) : result;
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  return { friends, isLoading };
};
