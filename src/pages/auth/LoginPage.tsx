import { Controller } from "react-hook-form";
import { Link } from "react-router";
import { MdEmail, MdLock } from "react-icons/md";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useLogin } from "@/hooks/useLogin";
import { usePasswordVisible } from "@/hooks/usePasswordVisible";
import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";

const LoginPage = () => {
  const { control, handleSubmit, handleLogin, errors, isPendingLogin } =
    useLogin();
  const { visiblePassword, handleVisiblePassword } = usePasswordVisible();

  const hasLoggedInBefore = localStorage.getItem("hasLoggedIn") === "true";

  return (
    <AuthLayout>
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-2xl font-bold text-gray-900">
          {hasLoggedInBefore ? "Welcome Back" : "Sign In"}
        </h1>
        <p className="text-center text-sm text-gray-500">
          Please enter your details to sign in
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleLogin)}
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

        <Button type="submit" size="lg" isLoading={isPendingLogin} className="w-full">
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link to="/auth/register" className="font-semibold text-[#ec5b13] hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
