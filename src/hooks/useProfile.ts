import { useQuery } from "@tanstack/react-query";
import userService from "@/services/user.service";
import type { IUser } from "@/types/user.type";

export const useProfile = (userId: number) => {
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", "detail", userId],
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });

  const profile: IUser | null = response?.data?.data || null;

  return {
    profile,
    isLoading,
    isError,
  };
};
