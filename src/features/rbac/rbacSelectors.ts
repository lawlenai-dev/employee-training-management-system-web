import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/rootReducer";
import type { AuthUser } from "../auth/auth.types";
import { effectivePermissions } from "./rbacModel";
import { permissionKeys } from "./rbac.types";
import type { Permission } from "./rbac.types";

export const selectRbac = (state: RootState) => state.rbac;
export const selectCurrentUser = createSelector(
  [selectRbac, (state: RootState) => state.auth.accountId],
  (rbac, accountId): AuthUser | null => {
    const account = rbac.users.find(
      (user) => user.accountId === accountId && user.status === "active",
    );
    if (!account) return null;
    const roles = rbac.roles.filter(
      (role) => role.status === "active" && account.roleIds.includes(role.id),
    );
    return {
      id: account.accountId,
      username: account.username,
      name: account.name,
      role: roles[0]?.id ?? "",
      roleName: roles.map((role) => role.name).join(", ") || "ยังไม่มีบทบาท",
      roleIds: roles.map((role) => role.id),
      supplierId: account.supplierId,
      permissions: effectivePermissions(rbac, account.username).filter(
        (key): key is Permission => permissionKeys.includes(key),
      ),
    };
  },
);
export function requirePermission(state: RootState, permission: Permission) {
  if (!selectCurrentUser(state)?.permissions.includes(permission))
    throw new Error("คุณไม่มีสิทธิ์ดำเนินการนี้");
}
