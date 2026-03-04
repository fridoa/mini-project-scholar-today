import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import CreatePostBox from "@/components/posts/CreatePostBox";

vi.mock("@/stores/useAuthStore", () => ({
  default: () => ({
    user: { id: 1, name: "Frida Afriyanto", username: "frida" },
  }),
}));

const mockCreatePost = vi.fn();
vi.mock("@/hooks/useCreatePost", () => ({
  useCreatePost: () => ({
    createPost: mockCreatePost,
    isLoading: false,
  }),
}));

const renderCreatePostBox = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CreatePostBox />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("CreatePostBox", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render collapsed state with prompt text", () => {
    renderCreatePostBox();

    expect(
      screen.getByText(/what's on your mind, frida/i),
    ).toBeInTheDocument();
  });

  it("should expand form when prompt is clicked", async () => {
    renderCreatePostBox();

    await user.click(screen.getByText(/what's on your mind, frida/i));

    expect(screen.getByPlaceholderText(/post title/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /post/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cancel/i }),
    ).toBeInTheDocument();
  });

  it("should collapse form when Cancel is clicked", async () => {
    renderCreatePostBox();

    await user.click(screen.getByText(/what's on your mind, frida/i));
    expect(screen.getByPlaceholderText(/post title/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.queryByPlaceholderText(/post title/i)).not.toBeInTheDocument();
  });

  it("should disable Post button when title and body are empty", async () => {
    renderCreatePostBox();

    await user.click(screen.getByText(/what's on your mind, frida/i));

    expect(screen.getByRole("button", { name: /^post$/i })).toBeDisabled();
  });

  it("should enable Post button when title and body are filled", async () => {
    renderCreatePostBox();

    await user.click(screen.getByText(/what's on your mind, frida/i));

    await user.type(screen.getByPlaceholderText(/post title/i), "My Post");
    await user.type(
      screen.getByPlaceholderText(/what's on your mind/i),
      "Post body content",
    );

    expect(screen.getByRole("button", { name: /^post$/i })).not.toBeDisabled();
  });

  it("should call createPost when submitting with valid data", async () => {
    renderCreatePostBox();

    await user.click(screen.getByText(/what's on your mind, frida/i));
    await user.type(screen.getByPlaceholderText(/post title/i), "My Title");
    await user.type(
      screen.getByPlaceholderText(/what's on your mind/i),
      "My body text",
    );
    await user.click(screen.getByRole("button", { name: /^post$/i }));

    expect(mockCreatePost).toHaveBeenCalledWith(
      { title: "My Title", body: "My body text", image: null },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it("should show Photo button for image upload", () => {
    renderCreatePostBox();

    expect(screen.getByText("Photo")).toBeInTheDocument();
  });
});
