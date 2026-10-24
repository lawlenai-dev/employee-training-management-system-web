import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  login as loginAction,
  logout as logoutAction,
} from "../features/auth/authThunks";
import { selectCurrentUser } from "../features/rbac/rbacSelectors";
import type { AuthUser, LoginResult } from "../features/auth/auth.types";
import type { Permission } from "../features/rbac/rbac.types";
export type { AuthUser } from "../features/auth/auth.types";
export type { Permission } from "../features/rbac/rbac.types";
export { demoAccounts } from "../features/rbac/rbacSeed";
export type Role = string;
type AuthContextValue = {
  user: AuthUser | null;
  login: (username: string, password: string) => LoginResult;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
};
const AuthContext = createContext<AuthContextValue | null>(null);
export function getHomePath(user: AuthUser): string {
  if (user.permissions.includes("dashboard.view")) return "/dashboard";
  if (user.permissions.includes("courses.view")) return "/courses";
  if (
    user.permissions.includes("employees.view_all") ||
    user.permissions.includes("employees.view_company")
  )
    return "/employees";
  if (
    user.permissions.includes("preregistration.view_own") ||
    user.permissions.includes("preregistration.review")
  )
    return "/pre-registrations";
  if (user.permissions.includes("settings.view")) return "/settings";
  return "/";
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (username, password) => dispatch(loginAction(username, password)),
      logout: () => {
        dispatch(logoutAction());
      },
      hasPermission: (permission) =>
        Boolean(user?.permissions.includes(permission)),
      hasAnyPermission: (permissions) =>
        permissions.some((permission) =>
          user?.permissions.includes(permission),
        ),
    }),
    [dispatch, user],
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
  if (permissions?.length && !hasAnyPermission(permissions))
    return <AccessDenied />;
  return children;
}
export function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const path = getHomePath(user);
  return path === "/" ? <AccessDenied /> : <Navigate to={path} replace />;
}
function AccessDenied() {
  const { user, logout } = useAuth();
  return (
    <div
      role="alert"
      className="mx-auto my-16 max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center"
    >
      <h1 className="text-xl font-bold text-slate-800">
        คุณยังไม่มีสิทธิ์เข้าถึงหน้านี้
      </h1>
      <p className="mt-3 text-sm text-slate-500">
        กรุณาติดต่อผู้ดูแลระบบเพื่อกำหนดบทบาทและสิทธิ์การใช้งาน
      </p>
      <div className="mt-6 flex justify-center gap-4">
        {user && getHomePath(user) !== "/" && (
          <a
            href={getHomePath(user)}
            className="text-sm font-semibold text-blue-700"
          >
            กลับหน้าหลัก
          </a>
        )}
        <button
          type="button"
          onClick={logout}
          className="text-sm font-semibold text-slate-600"
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}
