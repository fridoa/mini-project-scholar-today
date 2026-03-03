import { useState } from "react";
import { useTodos, type TodoFilter } from "@/hooks/useTodos";
import TodoItem from "@/components/todos/TodoItem";
import TodoFilterTabs from "@/components/todos/TodoFilterTabs";
import TodoProgressCard from "@/components/todos/TodoProgressCard";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";

const TodosPage = () => {
  const [filter, setFilter] = useState<TodoFilter>("all");
  const {
    todos,
    totalCount,
    doneCount,
    pendingCount,
    progress,
    isLoading,
    isError,
  } = useTodos(filter);

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Gagal memuat tasks. Coba lagi nanti.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <div className="flex w-full max-w-170 flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your daily productivity and flow
          </p>
        </div>

        <TodoFilterTabs
          active={filter}
          onChange={setFilter}
          totalCount={totalCount}
          pendingCount={pendingCount}
          doneCount={doneCount}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : todos.length === 0 ? (
          <Card>
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">
                {filter === "done"
                  ? "No completed tasks yet."
                  : filter === "pending"
                    ? "All tasks completed! 🎉"
                    : "No tasks found."}
              </p>
            </div>
          </Card>
        ) : (
          <Card className="divide-y divide-gray-100 overflow-hidden p-0">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </Card>
        )}
      </div>

      <div className="mr-4 hidden w-full max-w-[320px] shrink-0 lg:block">
        <div className="sticky top-25">
          <TodoProgressCard
            progress={progress}
            doneCount={doneCount}
            totalCount={totalCount}
            pendingCount={pendingCount}
          />
        </div>
      </div>
    </div>
  );
};

export default TodosPage;
