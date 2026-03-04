import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import PostCard from "@/components/posts/PostCard";
import type { IPost } from "@/types/post.type";
import type { IUser } from "@/types/user.type";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("@/stores/useAuthStore", () => ({
  default: () => ({ user: { id: 1, name: "Test User" } }),
}));

vi.mock("@/hooks/useLike", () => ({
  useLike: () => ({
    liked: false,
    count: 5,
    toggleLike: vi.fn(),
    isToggling: false,
    isLoading: false,
  }),
}));

vi.mock("@/hooks/useBookmark", () => ({
  useBookmark: () => ({
    bookmarked: false,
    toggleBookmark: vi.fn(),
    isToggling: false,
    isLoading: false,
  }),
}));

const mockPost: IPost = {
  id: 1,
  userId: 2,
  title: "Test Post Title",
  body: "This is the body of a test post.",
};

const mockAuthor: IUser = {
  id: 2,
  name: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  phone: "123-456-7890",
  website: "johndoe.com",
  address: { street: "Main St", suite: "Apt 1", city: "Jakarta", zipcode: "12345" },
  company: { name: "Doe Inc", catchPhrase: "Test", bs: "test" },
};

const renderPostCard = (props?: Partial<{ post: IPost; author: IUser; showFooter: boolean; clickable: boolean }>) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const author = props && "author" in props ? props.author : mockAuthor;

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <PostCard
          post={props?.post ?? mockPost}
          author={author}
          showFooter={props?.showFooter}
          clickable={props?.clickable}
        />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("PostCard", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render author name and username", () => {
    renderPostCard();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("@johndoe")).toBeInTheDocument();
  });

  it("should render author avatar", () => {
    renderPostCard();

    const avatar = screen.getByAltText("John Doe");
    expect(avatar).toBeInTheDocument();
    expect(avatar.tagName).toBe("IMG");
  });

  it("should render post title and body", () => {
    renderPostCard();

    expect(screen.getByText("Test Post Title")).toBeInTheDocument();
    expect(screen.getByText("This is the body of a test post.")).toBeInTheDocument();
  });

  it("should navigate to post detail when card is clicked", async () => {
    renderPostCard();

    await user.click(screen.getByText("Test Post Title"));

    expect(mockNavigate).toHaveBeenCalledWith("/posts/1");
  });

  it("should navigate to author profile when author name is clicked", async () => {
    renderPostCard();

    await user.click(screen.getByText("John Doe"));

    expect(mockNavigate).toHaveBeenCalledWith("/users/2");
  });

  it("should render footer with like and comments by default", () => {
    renderPostCard();

    expect(screen.getByText("Comments")).toBeInTheDocument();
  });

  it("should hide footer when showFooter is false", () => {
    renderPostCard({ showFooter: false });

    expect(screen.queryByText("Comments")).not.toBeInTheDocument();
  });

  it("should show 'Unknown User' when author is not provided", () => {
    renderPostCard({ author: undefined });

    expect(screen.getByText("Unknown User")).toBeInTheDocument();
    expect(screen.getByText("@unknown")).toBeInTheDocument();
  });
});
