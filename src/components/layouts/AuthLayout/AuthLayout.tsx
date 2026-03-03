import Logo from "@/components/ui/Logo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-white via-white to-[#fdeee7]">
      <div className="absolute top-20 left-10 h-6 w-6 rotate-45 rounded-sm border-2 border-[#ec5b13]/20" />
      <div className="absolute right-16 bottom-32 h-8 w-8 rounded-full border-2 border-[#ec5b13]/15" />
      <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-[#fdeee7]/60 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-[#f8c9a8]/30 blur-3xl" />

      <div className="z-10 flex w-full max-w-md flex-col items-center gap-8 px-6 py-12">
        <Logo size="lg" />
        <div className="w-full rounded-2xl bg-white/80 p-8 shadow-sm backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
