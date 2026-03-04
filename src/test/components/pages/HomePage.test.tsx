import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import HomePage from "@/pages/HomePage";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock("@/stores/useAuthStore", () => ({
  default: () => ({
    user: { id: 1, name: "Test User", username: "testuser" },
  }),
}));

vi.mock("@/hooks/useCreatePost", () => ({
  useCreatePost: () => ({
    createPost: vi.fn(),
    isLoading: false,
  }),
}));

vi.mock("@/hooks/useLike", () => ({
  useLike: () => ({
    liked: false, count: 0, toggleLike: vi.fn(), isToggling: false, isLoading: false,
  }),
}));

vi.mock("@/hooks/useBookmark", () => ({
  useBookmark: () => ({
    bookmarked: false, toggleBookmark: vi.fn(), isToggling: false, isLoading: false,
  }),
}));

vi.mock("@/hooks/useSuggestedUsers", () => ({
  useSuggestedUsers: () => ({ suggestedUsers: [], isLoading: false }),
}));

vi.mock("@/hooks/useTrendingTopics", () => ({
  useTrendingTopics: () => [],
}));

vi.mock("@/hooks/useFriends", () => ({
  useFriends: () => ({ friends: [], isLoading: false }),
}));

vi.mock("@/hooks/useFollowRequests", () => ({
  useFollowRequests: () => ({ pendingFollowBack: [], isLoading: false }),
}));

vi.mock("@/hooks/useFollow", () => ({
  useFollow: () => ({
    followed: false,
    toggleFollow: vi.fn(),
    isToggling: false,
  }),
  useSeedFollowCache: () => vi.fn(),
}));

const mockUsePosts = vi.fn();
vi.mock("@/hooks/usePosts", () => ({
  usePosts: () => mockUsePosts(),
}));

vi.mock("@/components/posts/InfiniteScrollTrigger", () => ({
  default: () => null,
}));

const renderHomePage = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show error message when posts fail to load", () => {
    mockUsePosts.mockReturnValue({
      posts: [],
      usersMap: {},
      isLoading: false,
      isError: true,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    });

    renderHomePage();

    expect(
      screen.getByText(/gagal memuat posts/i),
    ).toBeInTheDocument();
  });

  it("should render post cards when data is loaded", () => {
    mockUsePosts.mockReturnValue({
      posts: [
        { id: 1, userId: 1, title: "Post One", body: "Body one" },
        { id: 2, userId: 1, title: "Post Two", body: "Body two" },
      ],
      usersMap: {
        1: { id: 1, name: "User One", username: "userone", email: "u@e.com", phone: "123", website: "x.com", address: { street: "St", suite: "1", city: "JK", zipcode: "0" }, company: { name: "Co", catchPhrase: "", bs: "" } },
      },
      isLoading: false,
      isError: false,
      hasNextPage: true,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    });

    renderHomePage();

    expect(screen.getByText("Post One")).toBeInTheDocument();
    expect(screen.getByText("Post Two")).toBeInTheDocument();
  });

  it("should show end message when no more posts", () => {
    mockUsePosts.mockReturnValue({
      posts: [{ id: 1, userId: 1, title: "Post One", body: "Body one" }],
      usersMap: {
        1: { id: 1, name: "User One", username: "userone", email: "u@e.com", phone: "123", website: "x.com", address: { street: "St", suite: "1", city: "JK", zipcode: "0" }, company: { name: "Co", catchPhrase: "", bs: "" } },
      },
      isLoading: false,
      isError: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    });

    renderHomePage();

    expect(
      screen.getByText(/tidak ada post lagi/i),
    ).toBeInTheDocument();
  });

  it("should not show end message when still loading", () => {
    mockUsePosts.mockReturnValue({
      posts: [],
      usersMap: {},
      isLoading: true,
      isError: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    });

    renderHomePage();

    expect(
      screen.queryByText(/tidak ada post lagi/i),
    ).not.toBeInTheDocument();
  });
});
