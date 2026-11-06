import { useMemo } from "react";
import { useAuth } from "@/contexts/auth_context";

export function usePermissions() {
  const { user, status, restoreSession } = useAuth();

  const granted = useMemo(() => new Set(user?.permissions ?? []), [user]);

  return {
    ready: status === "authenticated",
    can: (permission: string) => granted.has(permission),
    refresh: restoreSession,
  };
}
