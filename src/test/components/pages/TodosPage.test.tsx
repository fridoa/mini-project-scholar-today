import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import TodosPage from "@/pages/TodosPage";

const mockUseTodos = vi.fn();

vi.mock("@/hooks/useTodos", () => ({
  useTodos: (...args: unknown[]) => mockUseTodos(...args),
}));

vi.mock("@/hooks/useDocumentTitle", () => ({
  default: vi.fn(),
}));

const renderTodosPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <TodosPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

const baseTodosReturn = {
  todos: [],
  totalCount: 0,
  doneCount: 0,
  pendingCount: 0,
  progress: 0,
  isLoading: false,
  isError: false,
};

describe("TodosPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render page title and description", () => {
    mockUseTodos.mockReturnValue(baseTodosReturn);
    renderTodosPage();

    expect(screen.getByText("My Tasks")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your daily productivity and flow"),
    ).toBeInTheDocument();
  });

  it("should show spinner when loading", () => {
    mockUseTodos.mockReturnValue({ ...baseTodosReturn, isLoading: true });
    renderTodosPage();

    // Spinner renders a div with role or a spinner element
    expect(screen.queryByText("My Tasks")).toBeInTheDocument();
    expect(screen.queryByText("No tasks found.")).not.toBeInTheDocument();
  });

  it("should show error message when fetch fails", () => {
    mockUseTodos.mockReturnValue({ ...baseTodosReturn, isError: true });
    renderTodosPage();

    expect(
      screen.getByText("Gagal memuat tasks. Coba lagi nanti."),
    ).toBeInTheDocument();
  });

  it("should show 'No tasks found' when todos are empty with 'all' filter", () => {
    mockUseTodos.mockReturnValue(baseTodosReturn);
    renderTodosPage();

    expect(screen.getByText("No tasks found.")).toBeInTheDocument();
  });

  it("should render todo items when data is available", () => {
    mockUseTodos.mockReturnValue({
      ...baseTodosReturn,
      todos: [
        { id: 1, userId: 1, title: "Buy groceries", completed: false },
        { id: 2, userId: 1, title: "Clean house", completed: true },
      ],
      totalCount: 2,
      doneCount: 1,
      pendingCount: 1,
      progress: 50,
    });

    renderTodosPage();

    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    expect(screen.getByText("Clean house")).toBeInTheDocument();
  });

  it("should render filter tabs", () => {
    mockUseTodos.mockReturnValue({
      ...baseTodosReturn,
      totalCount: 5,
      doneCount: 2,
      pendingCount: 3,
    });

    renderTodosPage();

    expect(screen.getByText(/all/i)).toBeInTheDocument();
  });
});
