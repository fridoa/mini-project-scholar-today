import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import LoginPage from "@/pages/auth/LoginPage";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockLogin = vi.fn();
vi.mock("@/stores/useAuthStore", () => ({
  default: () => ({
    login: mockLogin,
  }),
}));

const renderLoginPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/auth/login"]}>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("LoginPage", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("Render", () => {
    it("should render email and password fields", () => {
      renderLoginPage();

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it("should render submit button with 'Sign In' text", () => {
      renderLoginPage();

      expect(
        screen.getByRole("button", { name: /sign in/i }),
      ).toBeInTheDocument();
    });

    it("should render link to register page", () => {
      renderLoginPage();

      const registerLink = screen.getByRole("link", {
        name: /create an account/i,
      });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute("href", "/auth/register");
    });

    it("should show 'Sign In' title for first-time users", () => {
      renderLoginPage();

      expect(
        screen.getByRole("heading", { name: /sign in/i }),
      ).toBeInTheDocument();
    });

    it("should show 'Welcome Back' title for returning users", () => {
      localStorage.setItem("hasLoggedIn", "true");
      renderLoginPage();

      expect(
        screen.getByRole("heading", { name: /welcome back/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("should show error messages when submitting empty form", async () => {
      renderLoginPage();

      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/email wajib diisi/i)).toBeInTheDocument();
        expect(screen.getByText(/password wajib diisi/i)).toBeInTheDocument();
      });
    });

    it("should NOT call login API when form is invalid", async () => {
      renderLoginPage();

      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/email wajib diisi/i)).toBeInTheDocument();
      });

      expect(mockLogin).not.toHaveBeenCalled();
    });

    it("should show error when email format is invalid", async () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, "invalid-email");
      await user.type(passwordInput, "password123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      expect(
        await screen.findByText(/format email tidak valid/i),
      ).toBeInTheDocument();

      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  describe("Password Visibility", () => {
    it("should toggle password visibility when clicking eye icon", async () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute("type", "password");

      const toggleButtons = screen.getAllByRole("button");
      const eyeButton = toggleButtons.find(
        (btn) => btn !== screen.getByRole("button", { name: /sign in/i }),
      )!;

      await user.click(eyeButton);
      expect(passwordInput).toHaveAttribute("type", "text");

      await user.click(eyeButton);
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  describe("Login Success", () => {
    it("should redirect to home after successful login", async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      renderLoginPage();

      await user.type(
        screen.getByLabelText(/email address/i),
        "user@example.com",
      );
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith("user@example.com", "password123");
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    it("should not display any error message after successful login", async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      renderLoginPage();

      await user.type(
        screen.getByLabelText(/email address/i),
        "user@example.com",
      );
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });

      expect(
        screen.queryByText(/login gagal/i),
      ).not.toBeInTheDocument();
    });
  });

  describe("Login Failure", () => {
    it("should display error message when login fails", async () => {
      mockLogin.mockRejectedValueOnce({
        response: { data: { message: "Email atau password salah" } },
      });
      renderLoginPage();

      await user.type(
        screen.getByLabelText(/email address/i),
        "user@example.com",
      );
      await user.type(screen.getByLabelText(/password/i), "wrongpassword");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/email atau password salah/i),
        ).toBeInTheDocument();
      });
    });

    it("should re-enable submit button after login failure", async () => {
      mockLogin.mockRejectedValueOnce({
        response: { data: { message: "Login gagal" } },
      });
      renderLoginPage();

      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(
        screen.getByLabelText(/email address/i),
        "user@example.com",
      );
      await user.type(screen.getByLabelText(/password/i), "wrongpassword");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/login gagal/i)).toBeInTheDocument();
      });

      expect(submitButton).not.toBeDisabled();
    });

    it("should not redirect when login fails", async () => {
      mockLogin.mockRejectedValueOnce({
        response: { data: { message: "Login gagal" } },
      });
      renderLoginPage();

      await user.type(
        screen.getByLabelText(/email address/i),
        "user@example.com",
      );
      await user.type(screen.getByLabelText(/password/i), "wrongpassword");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/login gagal/i)).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("should disable submit button while login is in progress", async () => {
      mockLogin.mockImplementation(
        () => new Promise(() => {}),
      );
      renderLoginPage();

      await user.type(
        screen.getByLabelText(/email address/i),
        "user@example.com",
      );
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /sign in/i }),
        ).toBeDisabled();
      });
    });
  });
});
