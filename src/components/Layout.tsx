import {
  BookOpenCheck,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import type { Permission } from "../auth/AuthContext";
import { useAuth } from "../auth/AuthContext";
import { preRegistrationRequests } from "../data";
import { usePreRegistrations } from "../auth/PreRegistrationContext";

type NavigationLink = {
  to: string;
  label: string;
  icon: LucideIcon;
  permissions: Permission[];
};

const links: NavigationLink[] = [
  {
    to: "/dashboard",
    label: "ภาพรวม",
    icon: LayoutDashboard,
    permissions: ["dashboard.view"],
  },
  {
    to: "/courses",
    label: "หลักสูตร",
    icon: BookOpenCheck,
    permissions: ["courses.view"],
  },
  {
    to: "/employees",
    label: "ข้อมูลพนักงาน",
    icon: Users,
    permissions: ["employees.view_all", "employees.view_company"],
  },
  {
    to: "/pre-registrations",
    label: "Pre-register",
    icon: ClipboardCheck,
    permissions: ["preregistration.view_own", "preregistration.review"],
  },
  {
    to: "/settings",
    label: "ตั้งค่า",
    icon: Settings,
    permissions: ["settings.view"],
  },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasAnyPermission } = useAuth();
  const { requests } = usePreRegistrations();

  const isHome = location.pathname === "/dashboard";
  const isDashboard = location.pathname === "/courses";
  const visibleLinks = links.filter((link) =>
    hasAnyPermission(link.permissions),
  );

  const pendingPreRegistrationCount = hasAnyPermission([
    "preregistration.review",
  ])
    ? requests.filter(
        (request) => request.requestStatus === "pending",
      ).length
    : 0;
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-app font-sans text-body">
      {/* Navbar */}
      <header
        className={`
          inset-x-0 top-0 z-40 border-b transition
          ${
            isHome || isDashboard
              ? "absolute border-white/10 bg-[#001a3d]/45 text-white backdrop-blur-md"
              : "sticky border-border bg-surface/95 text-heading shadow-sm backdrop-blur-md"
          }
        `}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3">
            {/* <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-md">
              <img
                src={Logo}
                alt="CHK Logo"
                className="h-full w-full rounded-full object-contain"
              />
            </div> */}

            <div>
              {/* <p
                className={`text-xl font-bold ${
                  isHome ? "text-white" : "text-heading"
                }`}
              >
                CHK
              </p> */}

              <p
                className={`text-xs ${isHome || isDashboard ? "text-white/65" : "text-muted"}`}
              >
                Employee Training System
              </p>
            </div>
          </NavLink>

          {/* Desktop Navbar */}
          <nav className="hidden items-center gap-1 lg:flex">
            {visibleLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) => `
      relative flex items-center gap-2 rounded-lg px-4 py-2.5
      text-sm font-medium transition
      ${
        isActive
          ? isHome || isDashboard
            ? "bg-white/15 text-white"
            : "bg-brand-50 text-brand-600"
          : isHome || isDashboard
            ? "text-white/75 hover:bg-white/10 hover:text-white"
            : "text-body hover:bg-brand-50 hover:text-brand-600"
      }
    `}
              >
                {label}

                {to === "/pre-registrations" &&
                  pendingPreRegistrationCount > 0 && (
                    <span
                      className="flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-1.5 text-[10px] 
                    font-bold leading-none text-white"
                    >
                      {pendingPreRegistrationCount > 99
                        ? "99+"
                        : pendingPreRegistrationCount}
                    </span>
                  )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <div
              className={`rounded-xl px-3 py-2 text-right ${
                isHome || isDashboard ? "bg-white/10" : "bg-slate-100"
              }`}
            >
              <p className="text-xs font-bold">{user?.name}</p>
              <p
                className={`text-[11px] ${
                  isHome || isDashboard ? "text-white/65" : "text-muted"
                }`}
              >
                {user?.roleName}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="ออกจากระบบ"
              className={`rounded-xl p-2.5 transition ${
                isHome || isDashboard
                  ? "text-white/75 hover:bg-white/10 hover:text-white"
                  : "text-slate-500 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <LogOut size={19} />
            </button>
          </div>

          {/* ปุ่มเมนูมือถือ */}
          <button
            type="button"
            aria-label="เปิดเมนู"
            className={`
              rounded-control p-2.5 transition lg:hidden
              ${
                isHome || isDashboard
                  ? "text-white hover:bg-white/10"
                  : "text-heading hover:bg-brand-50"
              }
            `}
            onClick={() => setOpen(true)}
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      {open && (
        <button
          type="button"
          aria-label="ปิดเมนู"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72
          transform bg-sidebar text-white shadow-2xl
          transition-transform duration-300 lg:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            {/* <div className="h-12 w-12 overflow-hidden rounded-full bg-white p-1">
              <img
                src={Logo}
                // alt="CHK Logo"
                className="h-full w-full rounded-full object-contain"
              />
            </div> */}

            <div>
              <p className="text-xl font-bold"></p>
              <p className="text-xs text-white/60">Employee Training System</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="ปิดเมนู"
            className="rounded-control p-2 hover:bg-white/10"
            onClick={() => setOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="space-y-2 p-4">
          {visibleLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 rounded-control px-4 py-3
                text-sm font-semibold transition
                ${
                  isActive
                    ? "bg-white text-brand-600"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <Icon size={19} />
              {label}
              {to === "/pre-registrations" &&
                pendingPreRegistrationCount > 0 && (
                  <span className="flex min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 py-1 text-xs font-bold leading-none text-white">
                    {pendingPreRegistrationCount > 99
                      ? "99+"
                      : pendingPreRegistrationCount}
                  </span>
                )}
            </NavLink>
          ))}
        </nav>

        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/10 p-3">
            <ShieldCheck size={20} className="text-amber-300" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-white/60">{user?.roleName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-brand-700"
          >
            <LogOut size={18} />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
