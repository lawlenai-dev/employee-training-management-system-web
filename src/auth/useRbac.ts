// Compatibility hook for components written before the Redux migration.
import { useAppSelector } from "../app/hooks";
import { selectRbac } from "../features/rbac/rbacSelectors";
import { effectivePermissions } from "../features/rbac/rbacModel";
export function useRbac() {
  return useAppSelector(selectRbac);
}
export function useRbacAccess(username?: string | null) {
  const state = useRbac();
  const permissions = effectivePermissions(state, username);
  return {
    permissions,
    hasPermission: (key: string) => permissions.includes(key),
    hasAnyPermission: (keys: readonly string[]) =>
      keys.some((key) => permissions.includes(key)),
  };
}
