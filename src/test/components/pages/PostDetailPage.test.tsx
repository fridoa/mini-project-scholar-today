import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import PostDetailPage from "@/pages/PostDetailPage";

const mockUsePostDetail = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/hooks/usePostDetail", () => ({
  usePostDetail: (...args: unknown[]) => mockUsePostDetail(...args),
}));

vi.mock("@/hooks/useDocumentTitle", () => ({
  default: vi.fn(),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("@/stores/useAuthStore", () => ({
  default: () => ({
    user: { id: 1, name: "Test User", username: "testuser" },
  }),
}));

vi.mock("@/hooks/useLike", () => ({
  useLike: () => ({
    liked: false, count: 3, toggleLike: vi.fn(), isToggling: false, isLoading: false,
  }),
}));

vi.mock("@/hooks/useBookmark", () => ({
  useBookmark: () => ({
    bookmarked: false, toggleBookmark: vi.fn(), isToggling: false, isLoading: false,
  }),
}));

vi.mock("@/hooks/useComments", () => ({
  useComments: () => ({ comments: [], isLoading: false, isError: false }),
}));

const mockPost = {
  id: 42,
  userId: 2,
  title: "Test Post Title",
  body: "This is the body of the test post.",
};

const mockAuthor = {
  id: 2, name: "Jane Doe", username: "janedoe", email: "jane@e.com",
  phone: "123", website: "jane.com",
  address: { street: "St", suite: "1", city: "JK", zipcode: "0" },
  company: { name: "Co", catchPhrase: "", bs: "" },
};

const renderPostDetailPage = (postId = "42") => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/posts/${postId}`]}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("PostDetailPage", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show error state when post not found", () => {
    mockUsePostDetail.mockReturnValue({
      post: null,
      author: null,
      isLoading: false,
      isError: true,
    });

    renderPostDetailPage();

    expect(screen.getByText("Post tidak ditemukan.")).toBeInTheDocument();
    expect(screen.getByText("Kembali ke Home")).toBeInTheDocument();
  });

  it("should navigate to home when 'Kembali ke Home' is clicked", async () => {
    mockUsePostDetail.mockReturnValue({
      post: null,
      author: null,
      isLoading: false,
      isError: true,
    });

    renderPostDetailPage();

    await user.click(screen.getByText("Kembali ke Home"));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should render post content when loaded", () => {
    mockUsePostDetail.mockReturnValue({
      post: mockPost,
      author: mockAuthor,
      isLoading: false,
      isError: false,
    });

    renderPostDetailPage();

    expect(screen.getByText("Test Post Title")).toBeInTheDocument();
    expect(
      screen.getByText("This is the body of the test post."),
    ).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("should render Back button", () => {
    mockUsePostDetail.mockReturnValue({
      post: mockPost,
      author: mockAuthor,
      isLoading: false,
      isError: false,
    });

    renderPostDetailPage();

    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("should navigate back when Back button is clicked", async () => {
    mockUsePostDetail.mockReturnValue({
      post: mockPost,
      author: mockAuthor,
      isLoading: false,
      isError: false,
    });

    renderPostDetailPage();

    await user.click(screen.getByText("Back"));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("should not render post content during loading", () => {
    mockUsePostDetail.mockReturnValue({
      post: null,
      author: null,
      isLoading: true,
      isError: false,
    });

    renderPostDetailPage();

    expect(screen.queryByText("Test Post Title")).not.toBeInTheDocument();
    expect(screen.queryByText("Post tidak ditemukan.")).not.toBeInTheDocument();
  });
});
