import { BookOpenCheck, LayoutDashboard, Menu, Users, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation, Outlet } from "react-router-dom";
import Logo from "../assets/logo.png";

const links = [
  {
    to: "/dashboard",
    label: "ภาพรวม",
    icon: LayoutDashboard,
  },
  {
    to: "/courses",
    label: "หลักสูตร",
    icon: BookOpenCheck,
  },
  {
    to: "/employees",
    label: "ข้อมูลพนักงาน",
    icon: Users,
  },
  {
    to: "/settings",
    label: "ตั้งค่า",
    icon: Users,
  },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/dashboard";

  return (
    <div className="min-h-screen bg-app font-sans text-body">
      {/* Navbar */}
      <header
        className={`
          inset-x-0 top-0 z-40 border-b transition
          ${
            isHome
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
                className={`text-xs ${isHome ? "text-white/65" : "text-muted"}`}
              >
                Employee Training System
              </p>
            </div>
          </NavLink>

          {/* Desktop Navbar */}
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) => `
                  relative rounded-lg px-4 py-2.5
                  text-sm font-medium transition
                  ${
                    isActive
                      ? isHome
                        ? "bg-white/15 text-white"
                        : "bg-brand-50 text-brand-600"
                      : isHome
                        ? "text-white/75 hover:bg-white/10 hover:text-white"
                        : "text-body hover:bg-brand-50 hover:text-brand-600"
                  }
                `}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ปุ่มเมนูมือถือ */}
          <button
            type="button"
            aria-label="เปิดเมนู"
            className={`
              rounded-control p-2.5 transition lg:hidden
              ${
                isHome
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

      {/* Overlay มือถือ */}
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
            <div className="h-12 w-12 overflow-hidden rounded-full bg-white p-1">
              <img
                src={Logo}
                alt="CHK Logo"
                className="h-full w-full rounded-full object-contain"
              />
            </div>

            <div>
              <p className="text-xl font-bold">CHK</p>
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
          {links.map(({ to, label, icon: Icon }) => (
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
            </NavLink>
          ))}
        </nav>
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
