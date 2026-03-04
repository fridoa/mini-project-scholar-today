import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import ProfilePage from "@/pages/ProfilePage";

const mockUseProfile = vi.fn();

vi.mock("@/hooks/useProfile", () => ({
  useProfile: (...args: unknown[]) => mockUseProfile(...args),
}));

vi.mock("@/hooks/useDocumentTitle", () => ({
  default: vi.fn(),
}));

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

vi.mock("@/hooks/useFollow", () => ({
  useFollow: () => ({
    followed: false,
    isFriend: false,
    followsYou: false,
    followersCount: 0,
    followingCount: 0,
    toggleFollow: vi.fn(),
    isToggling: false,
  }),
  useSeedFollowCache: () => vi.fn(),
}));

vi.mock("@/hooks/useProfilePosts", () => ({
  useProfilePosts: () => ({ posts: [], isLoading: false, isError: false }),
}));

vi.mock("@/hooks/useProfileAlbums", () => ({
  useProfileAlbums: () => ({ albums: [], isLoading: false }),
}));

vi.mock("@/hooks/useProfileFeaturedPhotos", () => ({
  useProfileFeaturedPhotos: () => ({
    featuredAlbums: [],
    isLoading: false,
    hasAlbums: false,
  }),
}));

vi.mock("@/hooks/useFriends", () => ({
  useFriends: () => ({ friends: [], isLoading: false }),
}));

vi.mock("@/hooks/useBatchPostInteractions", () => ({
  useBatchPostInteractions: () => ({ data: null }),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock("@/utils/avatar", () => ({
  getAvatarByUserId: (id: number) => `https://avatar.test/${id}.png`,
}));

vi.mock("@/utils/image", () => ({
  getPhotoUrl: (id: number) => `https://photo.test/${id}.jpg`,
}));

const mockProfile = {
  id: 2,
  name: "Jane Doe",
  username: "janedoe",
  email: "jane@test.com",
  phone: "555-1234",
  website: "jane.com",
  address: { street: "Main St", suite: "B2", city: "Bandung", zipcode: "40100" },
  company: { name: "Jane Co", catchPhrase: "Innovate", bs: "tech" },
};

const renderProfilePage = (userId = "2") => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/users/${userId}`]}>
        <Routes>
          <Route path="/users/:userId" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show error message when profile not found", () => {
    mockUseProfile.mockReturnValue({
      profile: null,
      isLoading: false,
      isError: true,
    });

    renderProfilePage();

    expect(
      screen.getByText("User tidak ditemukan."),
    ).toBeInTheDocument();
  });

  it("should render profile name when loaded", () => {
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      isError: false,
    });

    renderProfilePage();

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("@janedoe")).toBeInTheDocument();
  });

  it("should show profile info sections", () => {
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      isError: false,
    });

    renderProfilePage();

    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Jane Co")).toBeInTheDocument();
    expect(screen.getByText("Bandung")).toBeInTheDocument();
  });

  it("should render own profile with edit buttons", () => {
    mockUseProfile.mockReturnValue({
      profile: { ...mockProfile, id: 1 },
      isLoading: false,
      isError: false,
    });

    renderProfilePage("1");

    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    expect(screen.getByText("Edit details")).toBeInTheDocument();
  });

  it("should show Follow button on other user profiles", () => {
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      isError: false,
    });

    renderProfilePage("2");

    expect(screen.getByText("Follow")).toBeInTheDocument();
  });
});
