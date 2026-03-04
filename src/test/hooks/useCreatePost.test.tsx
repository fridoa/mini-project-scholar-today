import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useCreatePost } from "@/hooks/useCreatePost";

// ── Mocks ──────────────────────────────────────────────────────────
const mockCreatePost = vi.fn();
const mockUpload = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
const mockScrollTo = vi.fn();

vi.mock("@/services/post.service", () => ({
  default: {
    createPost: (...args: unknown[]) => mockCreatePost(...args),
  },
}));

vi.mock("@/services/media.service", () => ({
  default: {
    upload: (...args: unknown[]) => mockUpload(...args),
  },
}));

vi.mock("@/stores/useAuthStore", () => ({
  default: () => ({ user: { id: 1, name: "Test User" } }),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
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
describe("useCreatePost", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createQueryClient();
    window.scrollTo = mockScrollTo;
  });

  it("should return initial state", () => {
    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isUploading).toBe(false);
    expect(typeof result.current.createPost).toBe("function");
  });

  it("should create a post without image", async () => {
    mockCreatePost.mockResolvedValue({ data: { data: { id: 101 } } });

    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.createPost({ title: "Hello", body: "World" });
    });

    await waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalledWith({
        userId: 1,
        title: "Hello",
        body: "World",
        image: undefined,
        imageFileId: undefined,
      });
    });

    expect(mockUpload).not.toHaveBeenCalled();
  });

  it("should upload image before creating post when image is provided", async () => {
    const fakeFile = new File(["test"], "photo.jpg", { type: "image/jpeg" });

    mockUpload.mockResolvedValue({
      data: { data: { url: "https://img.test/photo.jpg", fileId: "abc123" } },
    });
    mockCreatePost.mockResolvedValue({ data: { data: { id: 102 } } });

    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.createPost({
        title: "With Image",
        body: "Post body",
        image: fakeFile,
      });
    });

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalledWith(fakeFile);
      expect(mockCreatePost).toHaveBeenCalledWith({
        userId: 1,
        title: "With Image",
        body: "Post body",
        image: "https://img.test/photo.jpg",
        imageFileId: "abc123",
      });
    });
  });

  it("should show success toast and scroll to top on success", async () => {
    mockCreatePost.mockResolvedValue({ data: { data: { id: 103 } } });

    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.createPost({ title: "Nice", body: "Post" });
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Post created successfully!",
      );
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: "smooth",
      });
    });
  });

  it("should show error toast on failure", async () => {
    mockCreatePost.mockRejectedValue(new Error("Server error"));

    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.createPost({ title: "Fail", body: "Post" });
    });

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Failed to create post.");
    });
  });

  it("should not pass image fields when image is null", async () => {
    mockCreatePost.mockResolvedValue({ data: { data: { id: 104 } } });

    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.createPost({
        title: "No Image",
        body: "Post body",
        image: null,
      });
    });

    await waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalledWith({
        userId: 1,
        title: "No Image",
        body: "Post body",
        image: undefined,
        imageFileId: undefined,
      });
    });

    expect(mockUpload).not.toHaveBeenCalled();
  });
});
