import { Navigate } from "react-router";
import useAuthStore from "@/stores/useAuthStore";

interface Props {
  children: React.ReactNode;
}

const GuestRoute = ({ children }: Props) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
