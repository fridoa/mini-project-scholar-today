import { Navigate } from "react-router";
import useAuthStore from "@/stores/useAuthStore";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
