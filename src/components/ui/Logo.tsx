import logo from "@/assets/images/logo.png";
import { cn } from "@/utils/cn";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo = ({ size = "md", className }: LogoProps) => {
  const sizes = {
    sm: { img: "h-8 w-8", text: "text-lg" },
    md: { img: "h-10 w-10", text: "text-xl" },
    lg: { img: "h-12 w-12", text: "text-2xl" },
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src={logo}
        alt="Scholar Today Logo"
        className={cn("rounded-xl object-contain", sizes[size].img)}
      />
      <span
        className={cn(
          "font-bold tracking-tight text-gray-900",
          sizes[size].text
        )}
      >
        Scholar Today
      </span>
    </div>
  );
};

export default Logo;
