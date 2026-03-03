import { useQuery } from "@tanstack/react-query";
import userService from "@/services/user.service";
import useAuthStore from "@/stores/useAuthStore";
import type { ITodo } from "@/types/user.type";

export type TodoFilter = "all" | "pending" | "done";

export const useTodos = (filter: TodoFilter = "all") => {
  const { user } = useAuthStore();

  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos", user?.id],
    queryFn: async () => {
      const response = await userService.getTodosByUserId(user!.id);
      const data: ITodo[] = response?.data?.data || response?.data || [];
      return data;
    },
    enabled: !!user?.id,
    staleTime: 60 * 60 * 1000,
  });

  const filteredTodos =
    filter === "all"
      ? todos
      : filter === "done"
        ? todos.filter((t) => t.completed)
        : todos.filter((t) => !t.completed);

  const totalCount = todos.length;
  const doneCount = todos.filter((t) => t.completed).length;
  const pendingCount = totalCount - doneCount;
  const progress =
    totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return {
    todos: filteredTodos,
    totalCount,
    doneCount,
    pendingCount,
    progress,
    isLoading,
    isError,
  };
};
