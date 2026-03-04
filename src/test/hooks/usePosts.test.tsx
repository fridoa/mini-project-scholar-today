import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { usePosts } from "@/hooks/usePosts";
import type { IPost } from "@/types/post.type";

const mockGetAllPosts = vi.fn();
const mockGetUserById = vi.fn();

vi.mock("@/services/post.service", () => ({
  default: {
    getAllPosts: (...args: unknown[]) => mockGetAllPosts(...args),
  },
}));

vi.mock("@/services/user.service", () => ({
  default: {
    getUserById: (...args: unknown[]) => mockGetUserById(...args),
  },
}));

vi.mock("@/stores/useAuthStore", () => ({
  default: () => ({ user: { id: 1, name: "Test User" } }),
}));

vi.mock("@/hooks/useBatchPostInteractions", () => ({
  useBatchPostInteractions: () => ({ data: null }),
}));

const createMockPosts = (count: number, startId = 1): IPost[] =>
  Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    userId: (i % 3) + 1,
    title: `Post ${startId + i}`,
    body: `Body of post ${startId + i}`,
  }));

const mockUser = (id: number) => ({
  data: {
    data: {
      id,
      name: `User ${id}`,
      username: `user${id}`,
      email: `user${id}@test.com`,
      phone: "123",
      website: "test.com",
      address: { street: "St", suite: "A", city: "City", zipcode: "000" },
      company: { name: "Co", catchPhrase: "cp", bs: "bs" },
    },
  },
});

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

describe("usePosts", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createQueryClient();
  });

  it("should return loading state initially", () => {
    mockGetAllPosts.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.posts).toEqual([]);
  });

  it("should fetch and return first page of posts", async () => {
    const posts = createMockPosts(10);

    mockGetAllPosts.mockResolvedValue({
      data: { data: posts, pagination: { totalData: 25 } },
    });

    mockGetUserById.mockImplementation((id: number) =>
      Promise.resolve(mockUser(id)),
    );

    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.posts).toHaveLength(10);
    expect(result.current.posts[0].title).toBe("Post 1");
    expect(mockGetAllPosts).toHaveBeenCalledWith(1, 10);
  });

  it("should indicate hasNextPage when more posts exist", async () => {
    const posts = createMockPosts(10);

    mockGetAllPosts.mockResolvedValue({
      data: { data: posts, pagination: { totalData: 25 } },
    });

    mockGetUserById.mockImplementation((id: number) =>
      Promise.resolve(mockUser(id)),
    );

    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(true);
  });

  it("should indicate no next page when last page has fewer posts than page size", async () => {
    const posts = createMockPosts(5);

    mockGetAllPosts.mockResolvedValue({
      data: { data: posts, pagination: { totalData: 5 } },
    });

    mockGetUserById.mockImplementation((id: number) =>
      Promise.resolve(mockUser(id)),
    );

    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(false);
  });

  it("should build usersMap from fetched user data", async () => {
    const posts = createMockPosts(3);

    mockGetAllPosts.mockResolvedValue({
      data: { data: posts, pagination: { totalData: 3 } },
    });

    mockGetUserById.mockImplementation((id: number) =>
      Promise.resolve(mockUser(id)),
    );

    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await waitFor(() => {
      expect(Object.keys(result.current.usersMap).length).toBeGreaterThan(0);
    });

    expect(result.current.usersMap[1]?.name).toBe("User 1");
  });

  it("should set isError when post fetch fails", async () => {
    mockGetAllPosts.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("should expose fetchNextPage function", async () => {
    mockGetAllPosts.mockResolvedValue({
      data: { data: createMockPosts(10), pagination: { totalData: 25 } },
    });

    mockGetUserById.mockImplementation((id: number) =>
      Promise.resolve(mockUser(id)),
    );

    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.fetchNextPage).toBe("function");
  });
});
