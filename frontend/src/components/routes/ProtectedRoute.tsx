import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/contexts/auth_context";
import PageLoading from "../PageLoading";

export default function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") return <PageLoading />;

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
