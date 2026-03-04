import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email wajib diisi")
    .email("Format email tidak valid"),
  password: yup.string().required("Password wajib diisi"),
});

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email wajib diisi")
    .email("Format email tidak valid"),
  password: yup
    .string()
    .required("Password wajib diisi")
    .min(6, "Password minimal 6 karakter")
    .max(20, "Password maksimal 20 karakter"),
});
