import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useBookmark } from "@/hooks/useBookmark";

// ── Mocks ──────────────────────────────────────────────────────────
const mockToggle = vi.fn();
const mockGetStatus = vi.fn();

vi.mock("@/services/bookmark.service", () => ({
  default: {
    toggle: (...args: unknown[]) => mockToggle(...args),
    getStatus: (...args: unknown[]) => mockGetStatus(...args),
  },
}));

vi.mock("@/stores/useAuthStore", () => ({
  default: () => ({ user: { id: 1, name: "Test User" } }),
}));

// ── Helpers ────────────────────────────────────────────────────────
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

// ── Tests ──────────────────────────────────────────────────────────
describe("useBookmark", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createQueryClient();
  });

  it("should return default values when no data is cached", () => {
    const { result } = renderHook(() => useBookmark("1"), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.bookmarked).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isToggling).toBe(false);
    expect(typeof result.current.toggleBookmark).toBe("function");
  });

  it("should fetch bookmark status when autoFetch is true", async () => {
    mockGetStatus.mockResolvedValue({
      data: { data: { bookmarked: true } },
    });

    const { result } = renderHook(
      () => useBookmark("42", { autoFetch: true }),
      { wrapper: createWrapper(queryClient) },
    );

    await waitFor(() => {
      expect(result.current.bookmarked).toBe(true);
    });

    expect(mockGetStatus).toHaveBeenCalledWith("42", 1);
  });

  it("should not fetch when autoFetch is false (default)", () => {
    renderHook(() => useBookmark("1"), {
      wrapper: createWrapper(queryClient),
    });

    expect(mockGetStatus).not.toHaveBeenCalled();
  });

  it("should call bookmarkService.toggle when toggleBookmark is called", async () => {
    mockToggle.mockResolvedValue({ data: { data: { bookmarked: true } } });

    const { result } = renderHook(() => useBookmark("5"), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.toggleBookmark();
    });

    expect(mockToggle).toHaveBeenCalledWith("5", 1);
  });

  it("should optimistically update bookmarked state on toggle", async () => {
    queryClient.setQueryData(["posts", "bookmark", "10"], {
      bookmarked: false,
    });

    mockToggle.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useBookmark("10"), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.bookmarked).toBe(false);

    await act(async () => {
      result.current.toggleBookmark();
    });

    await waitFor(() => {
      expect(result.current.bookmarked).toBe(true);
    });
  });

  it("should rollback on mutation error", async () => {
    queryClient.setQueryData(["posts", "bookmark", "20"], {
      bookmarked: false,
    });

    mockToggle.mockRejectedValue(new Error("Network error"));
    mockGetStatus.mockResolvedValue({
      data: { data: { bookmarked: false } },
    });

    const { result } = renderHook(() => useBookmark("20"), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.toggleBookmark();
    });

    await waitFor(() => {
      expect(result.current.bookmarked).toBe(false);
    });
  });

  it("should convert postId to string internally", async () => {
    mockToggle.mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useBookmark(99), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.toggleBookmark();
    });

    expect(mockToggle).toHaveBeenCalledWith("99", 1);
  });
});
