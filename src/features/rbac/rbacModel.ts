import { nanoid } from "@reduxjs/toolkit";
import { userPermissionMockup } from "../../data";
import { demoAccounts, initialRoleTemplates } from "./rbacSeed";
import type { AccessState, AccessRole, AccessUser } from "./rbac.types";
const normalize = (value: string) => value.trim().toLowerCase();
const id = () => nanoid();
export function createInitialRbacState(): AccessState {
  const roles: AccessRole[] = initialRoleTemplates.map((role) => ({
    ...role,
    permissions: [...role.permissions],
    description: "บทบาทเริ่มต้น — สามารถแก้ไขสิทธิ์ได้",
    status: "active",
  }));
  const users: AccessUser[] = demoAccounts.map((account) => ({
    id: `account-${account.id}`,
    accountId: account.id,
    password: account.password,
    supplierId: account.supplierId,
    name: account.name,
    username: account.username,
    department: "ระบบ",
    supplierTier: "",
    status: "active",
    roleIds: [account.role],
  }));
  for (const row of userPermissionMockup as unknown as Record<
    string,
    unknown
  >[]) {
    if (typeof row.username !== "string" || !row.username.trim()) continue;
    if (
      users.some(
        (user) => normalize(user.username) === normalize(String(row.username)),
      )
    )
      continue;
    const name = String(row.role ?? "").trim();
    let role = roles.find(
      (item) =>
        normalize(item.name) === normalize(name) ||
        normalize(item.id) === normalize(name),
    );
    if (name && !role) {
      role = {
        id: `legacy-role-${roles.length}`,
        name,
        description: "นำเข้าจากข้อมูลเดิม — กรุณากำหนดสิทธิ์",
        status: "active",
        permissions: [],
      };
      roles.push(role);
    }
    users.push({
      id: `legacy-user-${users.length}`,
      accountId: Math.max(0, ...users.map((user) => user.accountId)) + 1,
      password: "",
      supplierId:
        typeof row.supplierId === "number" ? row.supplierId : undefined,
      name: String(row.name ?? row.username),
      username: row.username.trim(),
      department: String(row.department ?? ""),
      supplierTier: String(row.supplierTier ?? ""),
      status: row.status === "inactive" ? "inactive" : "active",
      roleIds: role ? [role.id] : [],
    });
  }
  return {
    version: 1,
    nextAccountId: Math.max(0, ...users.map((user) => user.accountId)) + 1,
    roles,
    users,
  };
}
export function isRbacState(value: unknown): value is AccessState {
  if (!value || typeof value !== "object") return false;
  const state = value as AccessState;
  if (
    state.version !== 1 ||
    !Number.isInteger(state.nextAccountId) ||
    state.nextAccountId < 1 ||
    !Array.isArray(state.roles) ||
    !Array.isArray(state.users)
  )
    return false;
  const strings = (v: unknown): v is string[] =>
    Array.isArray(v) && v.every((x) => typeof x === "string");
  return (
    state.roles.every(
      (role) =>
        role &&
        typeof role.id === "string" &&
        typeof role.name === "string" &&
        typeof role.description === "string" &&
        ["active", "inactive"].includes(role.status) &&
        strings(role.permissions),
    ) &&
    state.users.every(
      (user) =>
        user &&
        Number.isInteger(user.accountId) &&
        user.accountId > 0 &&
        user.accountId < state.nextAccountId &&
        typeof user.password === "string" &&
        (user.supplierId === undefined ||
          (Number.isInteger(user.supplierId) && user.supplierId > 0)) &&
        [
          user.id,
          user.name,
          user.username,
          user.department,
          user.supplierTier,
        ].every((v) => typeof v === "string") &&
        ["active", "inactive"].includes(user.status) &&
        strings(user.roleIds),
    ) &&
    new Set(state.roles.map((role) => role.id)).size === state.roles.length &&
    new Set(state.roles.map((role) => normalize(role.name))).size ===
      state.roles.length &&
    new Set(state.users.map((user) => user.id)).size === state.users.length &&
    new Set(state.users.map((user) => user.accountId)).size ===
      state.users.length &&
    new Set(state.users.map((user) => normalize(user.username))).size ===
      state.users.length
  );
}
export function effectivePermissions(
  state: AccessState,
  username?: string | null,
): string[] {
  const user = state.users.find(
    (item) => normalize(item.username) === normalize(username ?? ""),
  );
  if (!user || user.status !== "active") return [];
  return [
    ...new Set(
      state.roles
        .filter(
          (role) => role.status === "active" && user.roleIds.includes(role.id),
        )
        .flatMap((role) => role.permissions),
    ),
  ];
}
export function saveRoleState(
  state: AccessState,
  input: Omit<AccessRole, "id"> & {
    id?: string;
  },
) {
  const name = input.name.trim();
  if (!name || name.length > 100)
    throw new Error("กรุณากรอกชื่อบทบาทไม่เกิน 100 ตัวอักษร");
  if (
    state.roles.some(
      (role) =>
        role.id !== input.id && normalize(role.name) === normalize(name),
    )
  )
    throw new Error("ชื่อบทบาทนี้มีอยู่แล้ว");
  if (input.id && !state.roles.some((role) => role.id === input.id))
    throw new Error("ไม่พบบทบาทนี้แล้ว กรุณาเปิดรายการใหม่");
  if (!["active", "inactive"].includes(input.status))
    throw new Error("สถานะไม่ถูกต้อง");
  const role: AccessRole = {
    ...input,
    name,
    id: input.id ?? id(),
    permissions: [...new Set(input.permissions)],
  };
  return {
    ...state,
    roles: input.id
      ? state.roles.map((item) => (item.id === input.id ? role : item))
      : [...state.roles, role],
  };
}
export function saveUserState(
  state: AccessState,
  input: Omit<AccessUser, "id" | "accountId" | "password"> & {
    id?: string;
    password?: string;
  },
) {
  const username = input.username.trim();
  if (!/^[A-Za-z0-9._-]{4,30}$/.test(username))
    throw new Error(
      "Username ต้องมี 4–30 ตัวอักษร ใช้ภาษาอังกฤษ ตัวเลข จุด _ หรือ -",
    );
  if (!input.name.trim() || input.name.trim().length > 100)
    throw new Error("กรุณากรอกชื่อผู้ใช้ไม่เกิน 100 ตัวอักษร");
  if (!input.department.trim()) throw new Error("กรุณากรอกแผนก");
  if (!["active", "inactive"].includes(input.status))
    throw new Error("สถานะไม่ถูกต้อง");
  if (input.id && !state.users.some((user) => user.id === input.id))
    throw new Error("ไม่พบผู้ใช้นี้แล้ว กรุณาเปิดรายการใหม่");
  if (
    state.users.some(
      (user) =>
        user.id !== input.id &&
        normalize(user.username) === normalize(username),
    )
  )
    throw new Error("Username นี้มีอยู่แล้ว");
  if (
    input.roleIds.some(
      (roleId) => !state.roles.some((role) => role.id === roleId),
    )
  )
    throw new Error("มีบทบาทที่ถูกลบแล้ว กรุณาเลือกใหม่");
  const previous = state.users.find((user) => user.id === input.id);
  const password = input.password || previous?.password || "";
  if (!password || password.length < 4)
    throw new Error("กรุณากำหนดรหัสผ่านอย่างน้อย 4 ตัวอักษร");
  if (
    input.supplierId !== undefined &&
    (!Number.isInteger(input.supplierId) || input.supplierId <= 0)
  )
    throw new Error("รหัสบริษัทต้องเป็นจำนวนเต็มบวก");
  const user: AccessUser = {
    ...input,
    password,
    accountId: previous?.accountId ?? state.nextAccountId,
    id: input.id ?? id(),
    name: input.name.trim(),
    username,
    department: input.department.trim(),
    roleIds: [...new Set(input.roleIds)],
  };
  return {
    ...state,
    nextAccountId: input.id ? state.nextAccountId : state.nextAccountId + 1,
    users: input.id
      ? state.users.map((item) => (item.id === input.id ? user : item))
      : [...state.users, user],
  };
}
export function deleteItemState(
  state: AccessState,
  kind: "roles" | "users",
  itemId: string,
) {
  if (
    kind === "roles" &&
    state.users.some((user) => user.roleIds.includes(itemId))
  )
    throw new Error("บทบาทนี้ยังมีผู้ใช้งาน กรุณานำบทบาทออกจากผู้ใช้ก่อนลบ");
  return kind === "roles"
    ? {
        ...state,
        roles: state.roles.filter((role) => role.id !== itemId),
      }
    : {
        ...state,
        users: state.users.filter((user) => user.id !== itemId),
      };
}

export function assertManagerRemains(previous: AccessState, next: AccessState) {
  const hasManager = (state: AccessState) =>
    state.users.some(
      (user) =>
        user.status === "active" &&
        Boolean(user.password) &&
        effectivePermissions(state, user.username).includes("settings.view"),
    );
  if (hasManager(previous) && !hasManager(next))
    throw new Error("ต้องเหลือผู้ใช้ที่เข้าตั้งค่าได้อย่างน้อย 1 คน");
}
