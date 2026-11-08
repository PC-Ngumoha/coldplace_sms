import { type ReactNode } from "react";
import { Navigate } from "react-router";
import { usePermissions } from "@/hooks/use_permissions";
import PageLoading from "./PageLoading";

/**Component level role based access checks. */
export function Can({
  permission,
  fallback = null,
  children,
}: {
  permission: string;
  fallback?: ReactNode | null;
  children: ReactNode;
}) {
  const { can } = usePermissions();

  return can(permission) ? children : fallback;
}

/**Route Guard: Prevent unauthorized access of certain routes.
 */
export function RequirePermission({
  permission,
  children,
  fallbackPath,
}: {
  permission: string;
  children: ReactNode;
  fallbackPath?: string;
}) {
  const { can, ready } = usePermissions();

  if (!ready) return <PageLoading />;

  return can(permission) ? (
    children
  ) : (
    <Navigate to={fallbackPath ?? "/"} replace />
  );
}
