import { Controller } from "react-hook-form";
import { Link } from "react-router";
import { MdEmail, MdLock } from "react-icons/md";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useRegister } from "@/hooks/useRegister";
import { usePasswordVisible } from "@/hooks/usePasswordVisible";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";

const RegisterPage = () => {
  useDocumentTitle("Register");
  const { control, handleSubmit, handleRegister, errors, isPendingRegister } =
    useRegister();
  const { visiblePassword, handleVisiblePassword } = usePasswordVisible();

  return (
    <AuthLayout>
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="text-center text-sm text-gray-500">
          Enter your details to get started
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="mt-6 flex flex-col gap-5"
      >
        {errors.root && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-500">
            {errors.root.message}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="email"
                type="email"
                placeholder="name@company.com"
                icon={<MdEmail size={18} />}
                error={errors.email?.message}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="password"
                type={visiblePassword.password ? "text" : "password"}
                placeholder="••••••••"
                icon={<MdLock size={18} />}
                rightIcon={
                  visiblePassword.password ? (
                    <IoEyeOff size={18} />
                  ) : (
                    <IoEye size={18} />
                  )
                }
                onRightIconClick={() => handleVisiblePassword("password")}
                error={errors.password?.message}
              />
            )}
          />
        </div>

        <Button type="submit" size="lg" isLoading={isPendingRegister} className="w-full">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/auth/login" className="font-semibold text-[#ec5b13] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
