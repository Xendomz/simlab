import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { userRole } from "@/domain/User/UserRole";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: userRole[];
};

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/404" />;

  return <>{children}</>;
};
