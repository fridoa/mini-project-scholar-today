import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import RegisterPage from "@/pages/auth/RegisterPage";

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

const mockRegister = vi.fn();
vi.mock("@/services/auth.service", () => ({
  default: {
    register: (...args: unknown[]) => mockRegister(...args),
  },
}));

const renderRegisterPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/auth/register"]}>
        <RegisterPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("RegisterPage", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Render", () => {
    it("should render email and password fields", () => {
      renderRegisterPage();

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it("should render submit button with 'Create Account' text", () => {
      renderRegisterPage();

      expect(
        screen.getByRole("button", { name: /create account/i }),
      ).toBeInTheDocument();
    });

    it("should render link to login page", () => {
      renderRegisterPage();

      const loginLink = screen.getByRole("link", { name: /sign in/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute("href", "/auth/login");
    });

    it("should show 'Create Account' heading", () => {
      renderRegisterPage();

      expect(
        screen.getByRole("heading", { name: /create account/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("should show error messages when submitting empty form", async () => {
      renderRegisterPage();

      await user.click(
        screen.getByRole("button", { name: /create account/i }),
      );

      await waitFor(() => {
        expect(screen.getByText(/email wajib diisi/i)).toBeInTheDocument();
        expect(screen.getByText(/password wajib diisi/i)).toBeInTheDocument();
      });
    });

    it("should NOT call register API when form is invalid", async () => {
      renderRegisterPage();

      await user.click(
        screen.getByRole("button", { name: /create account/i }),
      );

      await waitFor(() => {
        expect(screen.getByText(/email wajib diisi/i)).toBeInTheDocument();
      });

      expect(mockRegister).not.toHaveBeenCalled();
    });

    it("should show error when email format is invalid", async () => {
      renderRegisterPage();

      await user.type(screen.getByLabelText(/email address/i), "invalid-email");
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(
        screen.getByRole("button", { name: /create account/i }),
      );

      expect(
        await screen.findByText(/format email tidak valid/i),
      ).toBeInTheDocument();

      expect(mockRegister).not.toHaveBeenCalled();
    });

    it("should show error when password is less than 6 characters", async () => {
      renderRegisterPage();

      await user.type(
        screen.getByLabelText(/email address/i),
        "user@example.com",
      );
      await user.type(screen.getByLabelText(/password/i), "12345");
      await user.click(
        screen.getByRole("button", { name: /create account/i }),
      );

      expect(
        await screen.findByText(/password minimal 6 karakter/i),
      ).toBeInTheDocument();

      expect(mockRegister).not.toHaveBeenCalled();
    });

    it("should show error when password exceeds 20 characters", async () => {
      renderRegisterPage();

      await user.type(
        screen.getByLabelText(/email address/i),
        "user@example.com",
      );
      await user.type(screen.getByLabelText(/password/i), "a".repeat(21));
      await user.click(
        screen.getByRole("button", { name: /create account/i }),
      );

      expect(
        await screen.findByText(/password maksimal 20 karakter/i),
      ).toBeInTheDocument();

      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  describe("Password Visibility", () => {
    it("should toggle password visibility when clicking eye icon", async () => {
      renderRegisterPage();

      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute("type", "password");

      const toggleButtons = screen.getAllByRole("button");
      const eyeButton = toggleButtons.find(
        (btn) =>
          btn !== screen.getByRole("button", { name: /create account/i }),
      )!;

      await user.click(eyeButton);
      expect(passwordInput).toHaveAttribute("type", "text");

      await user.click(eyeButton);
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  describe("Register Success", () => {
    it("should redirect to login page after successful register", async () => {
      mockRegister.mockResolvedValueOnce({ data: { message: "Success" } });
      renderRegisterPage();

      await user.type(
        screen.getByLabelText(/email address/i),
        "user@example.com",
      );
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(
        screen.getByRole("button", { name: /create account/i }),
      );

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          email: "user@example.com",
          password: "password123",
        });
        expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
      });
    });

    it("should not display any error after successful register", async () => {
      mockRegister.mockResolvedValueOnce({ data: { message: "Success" } });
      renderRegisterPage();

      await user.type(
        screen.getByLabelText(/email address/i),
        "user@example.com",
      );
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(
        screen.getByRole("button", { name: /create account/i }),
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
      });

      expect(screen.queryByText(/register gagal/i)).not.toBeInTheDocument();
    });
  });

  describe("Register Failure", () => {
    it("should display error message when register fails", async () => {
      mockRegister.mockRejectedValueOnce({
        response: { data: { message: "Email sudah terdaftar" } },
      });
      renderRegisterPage();

      await user.type(
        screen.getByLabelText(/email address/i),
        "user@example.com",
      );
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(
        screen.getByRole("button", { name: /create account/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText(/email sudah terdaftar/i),
        ).toBeInTheDocument();
      });
    });

    it("should re-enable submit button after register failure", async () => {
      mockRegister.mockRejectedValueOnce({
        response: { data: { message: "Register gagal" } },
      });
      renderRegisterPage();

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });

      await user.type(
        screen.getByLabelText(/email address/i),
        "user@example.com",
      );
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/register gagal/i)).toBeInTheDocument();
      });

      expect(submitButton).not.toBeDisabled();
    });

    it("should not redirect when register fails", async () => {
      mockRegister.mockRejectedValueOnce({
        response: { data: { message: "Register gagal" } },
      });
      renderRegisterPage();

      await user.type(
        screen.getByLabelText(/email address/i),
        "user@example.com",
      );
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(
        screen.getByRole("button", { name: /create account/i }),
      );

      await waitFor(() => {
        expect(screen.getByText(/register gagal/i)).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("should disable submit button while register is in progress", async () => {
      mockRegister.mockImplementation(() => new Promise(() => {}));
      renderRegisterPage();

      await user.type(
        screen.getByLabelText(/email address/i),
        "user@example.com",
      );
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(
        screen.getByRole("button", { name: /create account/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /create account/i }),
        ).toBeDisabled();
      });
    });
  });
});
