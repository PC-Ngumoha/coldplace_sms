import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { usePermissions } from "@/hooks/use_permissions";
import PageLoading from "./PageLoading";

export function Can({
  permission,
  fallback = null,
  children,
}: {
  permission: string;
  fallback: ReactNode | null;
  children: ReactNode;
}) {
  const { can } = usePermissions();

  return can(permission) ? children : fallback;
}

export function RequirePermission({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) {
  const { can, ready } = usePermissions();
  const location = useLocation();

  // Get previous location
  const from = (location.state as { from?: { pathname: string } } | null)?.from;

  if (!ready) return <PageLoading />;

  return can(permission) ? (
    children
  ) : (
    <Navigate to={from?.pathname ?? "/"} replace />
  );
}
