import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useLike } from "@/hooks/useLike";

const mockToggle = vi.fn();
const mockGetStatus = vi.fn();

vi.mock("@/services/like.service", () => ({
  default: {
    toggle: (...args: unknown[]) => mockToggle(...args),
    getStatus: (...args: unknown[]) => mockGetStatus(...args),
  },
}));

vi.mock("@/stores/useAuthStore", () => ({
  default: () => ({ user: { id: 1, name: "Test User" } }),
}));

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

describe("useLike", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createQueryClient();
  });

  it("should return default values when no data is cached", () => {
    const { result } = renderHook(() => useLike("1"), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.liked).toBe(false);
    expect(result.current.count).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isToggling).toBe(false);
    expect(typeof result.current.toggleLike).toBe("function");
  });

  it("should fetch like status when autoFetch is true", async () => {
    mockGetStatus.mockResolvedValue({
      data: { data: { liked: true, count: 10 } },
    });

    const { result } = renderHook(
      () => useLike("42", { autoFetch: true }),
      { wrapper: createWrapper(queryClient) },
    );

    await waitFor(() => {
      expect(result.current.liked).toBe(true);
      expect(result.current.count).toBe(10);
    });

    expect(mockGetStatus).toHaveBeenCalledWith("42", 1);
  });

  it("should not fetch when autoFetch is false (default)", () => {
    renderHook(() => useLike("1"), {
      wrapper: createWrapper(queryClient),
    });

    expect(mockGetStatus).not.toHaveBeenCalled();
  });

  it("should call likeService.toggle when toggleLike is called", async () => {
    mockToggle.mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useLike("5"), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.toggleLike();
    });

    expect(mockToggle).toHaveBeenCalledWith("5", 1);
  });

  it("should optimistically toggle liked from false to true and increment count", async () => {
    queryClient.setQueryData(["posts", "like", "10"], {
      liked: false,
      count: 3,
    });

    mockToggle.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useLike("10"), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.liked).toBe(false);
    expect(result.current.count).toBe(3);

    await act(async () => {
      result.current.toggleLike();
    });

    await waitFor(() => {
      expect(result.current.liked).toBe(true);
      expect(result.current.count).toBe(4);
    });
  });

  it("should optimistically toggle liked from true to false and decrement count", async () => {
    queryClient.setQueryData(["posts", "like", "11"], {
      liked: true,
      count: 5,
    });

    mockToggle.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useLike("11"), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.liked).toBe(true);
    expect(result.current.count).toBe(5);

    await act(async () => {
      result.current.toggleLike();
    });

    await waitFor(() => {
      expect(result.current.liked).toBe(false);
      expect(result.current.count).toBe(4);
    });
  });

  it("should handle optimistic update when cache is empty (defaults to liked: true, count: 1)", async () => {
    mockToggle.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useLike("99"), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.toggleLike();
    });

    await waitFor(() => {
      expect(result.current.liked).toBe(true);
      expect(result.current.count).toBe(1);
    });
  });

  it("should rollback on mutation error", async () => {
    queryClient.setQueryData(["posts", "like", "20"], {
      liked: false,
      count: 7,
    });

    mockToggle.mockRejectedValue(new Error("Network error"));
    mockGetStatus.mockResolvedValue({
      data: { data: { liked: false, count: 7 } },
    });

    const { result } = renderHook(() => useLike("20"), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.toggleLike();
    });

    await waitFor(() => {
      expect(result.current.liked).toBe(false);
      expect(result.current.count).toBe(7);
    });
  });

  it("should convert postId to string internally", async () => {
    mockToggle.mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useLike(55), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.toggleLike();
    });

    expect(mockToggle).toHaveBeenCalledWith("55", 1);
  });
});
