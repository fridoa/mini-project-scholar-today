import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import notificationService from "@/services/notification.service";
import useAuthStore from "@/stores/useAuthStore";
import type { INotification } from "@/types/notification.type";

const POLLING_INTERVAL = 30 * 1000;

export const useNotifications = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const res = await notificationService.getByUser(user!.id);
      return res.data.data as {
        notifications: INotification[];
        unreadCount: number;
      };
    },
    enabled: !!user,
    refetchInterval: POLLING_INTERVAL,
    staleTime: 15 * 1000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.markAsRead(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({
        queryKey: ["notifications", user?.id],
      });

      const previous = queryClient.getQueryData<{
        notifications: INotification[];
        unreadCount: number;
      }>(["notifications", user?.id]);

      if (previous) {
        queryClient.setQueryData(["notifications", user?.id], {
          notifications: previous.notifications.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n,
          ),
          unreadCount: Math.max(0, previous.unreadCount - 1),
        });
      }

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notifications", user?.id], context.previous);
      }
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationService.markAllRead(user!.id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["notifications", user?.id],
      });

      const previous = queryClient.getQueryData<{
        notifications: INotification[];
        unreadCount: number;
      }>(["notifications", user?.id]);

      if (previous) {
        queryClient.setQueryData(["notifications", user?.id], {
          notifications: previous.notifications.map((n) => ({
            ...n,
            isRead: true,
          })),
          unreadCount: 0,
        });
      }

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notifications", user?.id], context.previous);
      }
    },
  });

  return {
    notifications: data?.notifications ?? [],
    unreadCount: data?.unreadCount ?? 0,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllRead: markAllReadMutation.mutate,
  };
};
