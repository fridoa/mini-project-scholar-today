import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/validations/auth.schema";
import type { IRegister } from "@/types/auth.type";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import authService from "@/services/auth.service";
import { toast } from "react-toastify";

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
