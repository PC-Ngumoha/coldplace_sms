import { useAuth } from "@/contexts/auth_context";
import { Navigate, Outlet, useLocation } from "react-router";
import PageLoading from "../PageLoading";

export default function GuestRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") return <PageLoading />;

  if (status === "authenticated") {
    const from = (location.state as { from?: { pathname: string } } | null)
      ?.from;
    return <Navigate to={from?.pathname ?? "/"} replace />;
  }

  return <Outlet />;
}
