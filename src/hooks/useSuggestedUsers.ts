import { useQuery } from "@tanstack/react-query";
import userService from "@/services/user.service";
import type { IUser } from "@/types/user.type";
import useAuthStore from "@/stores/useAuthStore";

export const useSuggestedUsers = (limit: number = 4) => {
  const { user: currentUser } = useAuthStore();

  const {
    data: suggestedUsers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["suggestedUsers", currentUser?.id, limit],
    queryFn: async () => {
      const response = await userService.getAllUsers();
      const allUsers: IUser[] = response?.data?.data || response?.data || [];
      const filtered = allUsers.filter((u) => u.id !== currentUser?.id);
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit * 3);
    },
    staleTime: 60 * 60 * 1000,
  });

  return {
    suggestedUsers,
    isLoading,
    isError,
  };
};
