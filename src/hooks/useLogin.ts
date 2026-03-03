import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ILogin } from "@/types/auth.type";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAuthStore from "@/stores/useAuthStore";
import { toast } from "react-toastify";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: yup.string().required("Password wajib diisi"),
});

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const { mutate: mutateLogin, isPending: isPendingLogin } = useMutation({
    mutationFn: (payload: ILogin) => login(payload.email, payload.password),
    onError(error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response: { data: { message: string } } };
        const message = err.response?.data?.message || "Login gagal, coba lagi";
        setError("root", {
          message,
        });
        toast.error(message);
      } else {
        toast.error("Terjadi kesalahan saat login.");
      }
    },
    onSuccess: () => {
      toast.success("Login berhasil!");
      reset();
      navigate("/");
    },
  });

  const handleLogin = (data: ILogin) => mutateLogin(data);

  return {
    control,
    handleSubmit,
    handleLogin,
    errors,
    isPendingLogin,
  };
};
