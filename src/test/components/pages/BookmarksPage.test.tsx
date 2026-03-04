import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import BookmarksPage from "@/pages/BookmarksPage";

const mockUseBookmarkedPosts = vi.fn();

vi.mock("@/hooks/useBookmarkedPosts", () => ({
  useBookmarkedPosts: () => mockUseBookmarkedPosts(),
}));

vi.mock("@/hooks/useDocumentTitle", () => ({
  default: vi.fn(),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock("@/stores/useAuthStore", () => ({
  default: () => ({
    user: { id: 1, name: "Test User", username: "testuser" },
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

const renderBookmarksPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <BookmarksPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

const baseReturn = {
  posts: [],
  usersMap: {},
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
};

describe("BookmarksPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render page title and subtitle", () => {
    mockUseBookmarkedPosts.mockReturnValue(baseReturn);
    renderBookmarksPage();

    expect(screen.getByText("Bookmarks")).toBeInTheDocument();
    expect(
      screen.getByText("Posts that you've saved for later"),
    ).toBeInTheDocument();
  });

  it("should show loading skeletons when loading", () => {
    mockUseBookmarkedPosts.mockReturnValue({
      ...baseReturn,
      isLoading: true,
    });

    renderBookmarksPage();

    expect(screen.getByText("Bookmarks")).toBeInTheDocument();
    expect(screen.queryByText("No saved posts yet")).not.toBeInTheDocument();
  });

  it("should show error message when fetch fails", () => {
    mockUseBookmarkedPosts.mockReturnValue({
      ...baseReturn,
      isError: true,
    });

    renderBookmarksPage();

    expect(
      screen.getByText("Gagal memuat bookmarks. Coba lagi nanti."),
    ).toBeInTheDocument();
  });

  it("should show empty state when no bookmarks exist", () => {
    mockUseBookmarkedPosts.mockReturnValue(baseReturn);
    renderBookmarksPage();

    expect(screen.getByText("No saved posts yet")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Tap the bookmark icon on any post to save it here.",
      ),
    ).toBeInTheDocument();
  });

  it("should render bookmarked posts with count", () => {
    mockUseBookmarkedPosts.mockReturnValue({
      ...baseReturn,
      posts: [
        { id: 1, userId: 2, title: "Saved Post A", body: "Body A" },
        { id: 2, userId: 3, title: "Saved Post B", body: "Body B" },
      ],
      usersMap: {
        2: {
          id: 2, name: "Author A", username: "authora", email: "a@e.com",
          phone: "123", website: "a.com",
          address: { street: "St", suite: "1", city: "JK", zipcode: "0" },
          company: { name: "Co", catchPhrase: "", bs: "" },
        },
        3: {
          id: 3, name: "Author B", username: "authorb", email: "b@e.com",
          phone: "456", website: "b.com",
          address: { street: "St", suite: "2", city: "JK", zipcode: "0" },
          company: { name: "Co", catchPhrase: "", bs: "" },
        },
      },
    });

    renderBookmarksPage();

    expect(screen.getByText("Saved Post A")).toBeInTheDocument();
    expect(screen.getByText("Saved Post B")).toBeInTheDocument();
    expect(screen.getByText("2 saved posts")).toBeInTheDocument();
  });

  it("should show singular 'post' when only one bookmark", () => {
    mockUseBookmarkedPosts.mockReturnValue({
      ...baseReturn,
      posts: [{ id: 1, userId: 2, title: "Only Post", body: "Body" }],
      usersMap: {
        2: {
          id: 2, name: "Author", username: "author", email: "a@e.com",
          phone: "123", website: "a.com",
          address: { street: "St", suite: "1", city: "JK", zipcode: "0" },
          company: { name: "Co", catchPhrase: "", bs: "" },
        },
      },
    });

    renderBookmarksPage();

    expect(screen.getByText("1 saved post")).toBeInTheDocument();
  });
});
