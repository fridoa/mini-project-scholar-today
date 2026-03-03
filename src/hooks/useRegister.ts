import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IRegister } from "@/types/auth.type";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import authService from "@/services/auth.service";
import { toast } from "react-toastify";

const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: yup
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(20, "Password maksimal 20 karakter")
    .required("Password wajib diisi"),
});

export const useRegister = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const { mutate: mutateRegister, isPending: isPendingRegister } = useMutation({
    mutationFn: (payload: IRegister) => authService.register(payload),
    onError(error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response: { data: { message: string } } };
        const message =
          err.response?.data?.message || "Register gagal, coba lagi";
        setError("root", {
          message,
        });
        toast.error(message);
      } else {
        toast.error("Terjadi kesalahan, coba lagi nanti.");
      }
    },
    onSuccess: () => {
      toast.success("Register berhasil!");
      reset();
      navigate("/auth/login");
    },
  });

  const handleRegister = (data: IRegister) => mutateRegister(data);

  return {
    control,
    handleSubmit,
    handleRegister,
    errors,
    isPendingRegister,
  };
};
