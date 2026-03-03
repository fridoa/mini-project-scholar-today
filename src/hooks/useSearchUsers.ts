import { useQuery } from "@tanstack/react-query";
import userService from "@/services/user.service";
import type { IUser } from "@/types/user.type";
import useAuthStore from "@/stores/useAuthStore";

export const useSearchUsers = (query: string) => {
  const { user: currentUser } = useAuthStore();
  const trimmed = query.trim().toLowerCase();

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await userService.getAllUsers();
      const allUsers: IUser[] = response?.data?.data || response?.data || [];
      return allUsers.filter((u) => u.id !== currentUser?.id);
    },
    staleTime: 60 * 60 * 1000,
  });

  const results = trimmed
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(trimmed) ||
          u.username.toLowerCase().includes(trimmed) ||
          u.email.toLowerCase().includes(trimmed),
      )
    : [];

  return {
    results,
    isLoading,
    isError,
    hasQuery: trimmed.length > 0,
  };
};
