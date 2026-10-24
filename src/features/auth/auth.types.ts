import type { Permission } from "../rbac/rbac.types";

export type AuthUser = {
  id: number;
  username: string;
  name: string;
  role: string;
  roleName: string;
  roleIds: string[];
  supplierId?: number;
  permissions: Permission[];
};
export type LoginResult =
  { ok: true; user: AuthUser } | { ok: false; message: string };
