import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

export type Role = "admin" | "viewer" | "supplier" | "trainer";

export type Permission =
  | "dashboard.view"
  | "courses.view"
  | "attendance.view"
  | "employees.view_all"
  | "employees.view_company"
  | "employees.create"
  | "employees.qr"
  | "preregistration.create"
  | "preregistration.view_own"
  | "preregistration.review"
  | "settings.view";

export type AuthUser = {
  id: number;
  username: string;
  name: string;
  role: Role;
  roleName: string;
  supplierId?: number;
  permissions: Permission[];
};

type DemoAccount = Omit<AuthUser, "roleName" | "permissions"> & {
  password: string;
};

type LoginResult =
  | { ok: true; user: AuthUser }
  | { ok: false; message: string };

type AuthContextValue = {
  user: AuthUser | null;
  login: (username: string, password: string) => LoginResult;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
};

const STORAGE_KEY = "demo_auth_user";

const ROLE_NAMES: Record<Role, string> = {
  admin: "ผู้ดูแลระบบ",
  viewer: "ผู้ดูข้อมูล",
  supplier: "บริษัทผู้รับเหมา",
  trainer: "วิทยากร",
};

const ALL_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "courses.view",
  "attendance.view",
  "employees.view_all",
  "employees.view_company",
  "employees.create",
  "employees.qr",
  "preregistration.create",
  "preregistration.view_own",
  "preregistration.review",
  "settings.view",
];

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ALL_PERMISSIONS,
  viewer: [
    "dashboard.view",
    "courses.view",
    "employees.view_all",
    "employees.qr",
  ],
  supplier: [
    "employees.view_company",
    "employees.qr",
    "preregistration.create",
    "preregistration.view_own",
    "courses.view",
  ],
  trainer: ["dashboard.view", "courses.view", "attendance.view"],
};

export const demoAccounts: DemoAccount[] = [
  {
    id: 1,
    username: "admin",
    password: "1234",
    name: "System Admin",
    role: "admin",
  },
  {
    id: 2,
    username: "viewer",
    password: "1234",
    name: "Demo Viewer",
    role: "viewer",
  },
  {
    id: 3,
    username: "supplier",
    password: "1234",
    name: "Supplier A",
    role: "supplier",
    supplierId: 101,
  },
  {
    id: 4,
    username: "trainer",
    password: "1234",
    name: "Demo Trainer",
    role: "trainer",
  },
];

const AuthContext = createContext<AuthContextValue | null>(null);

const createAuthUser = (account: DemoAccount): AuthUser => ({
  id: account.id,
  username: account.username,
  name: account.name,
  role: account.role,
  roleName: ROLE_NAMES[account.role],
  supplierId: account.supplierId,
  permissions: ROLE_PERMISSIONS[account.role],
});

const loadStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) return null;

    const parsedUser = JSON.parse(storedValue) as Partial<AuthUser>;
    const account = demoAccounts.find(
      (item) =>
        item.id === parsedUser.id &&
        item.username === parsedUser.username &&
        item.role === parsedUser.role,
    );

    return account ? createAuthUser(account) : null;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export function getHomePath(user: AuthUser): string {
  if (user.permissions.includes("dashboard.view")) return "/dashboard";
  if (user.permissions.includes("courses.view")) return "/courses";
  if (
    user.permissions.includes("employees.view_all") ||
    user.permissions.includes("employees.view_company")
  ) {
    return "/employees";
  }
  if (user.permissions.includes("settings.view")) return "/settings";
  return "/login";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadStoredUser);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (username, password) => {
        const normalizedUsername = username.trim().toLowerCase();
        const account = demoAccounts.find(
          (item) =>
            item.username.toLowerCase() === normalizedUsername &&
            item.password === password,
        );

        if (!account) {
          return {
            ok: false,
            message: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง",
          };
        }

        const authenticatedUser = createAuthUser(account);
        setUser(authenticatedUser);
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(authenticatedUser),
        );

        return { ok: true, user: authenticatedUser };
      },
      logout: () => {
        setUser(null);
        window.localStorage.removeItem(STORAGE_KEY);
      },
      hasPermission: (permission) =>
        Boolean(user?.permissions.includes(permission)),
      hasAnyPermission: (permissions) =>
        permissions.some((permission) =>
          user?.permissions.includes(permission),
        ),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth ต้องใช้งานภายใน AuthProvider");
  }

  return context;
}

export function Can({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { hasPermission } = useAuth();
  return hasPermission(permission) ? children : fallback;
}

export function ProtectedRoute({
  children,
  permissions,
}: {
  children: ReactNode;
  permissions?: Permission[];
}) {
  const { user, hasAnyPermission } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (permissions?.length && !hasAnyPermission(permissions)) {
    return <Navigate to={getHomePath(user)} replace />;
  }

  return children;
}

export function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? getHomePath(user) : "/login"} replace />;
}
