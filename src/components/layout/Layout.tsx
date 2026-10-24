import { useCallback, useEffect, useId, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { usePreRegistrations } from "../../auth/PreRegistrationContext";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Topbar from "./Topbar";
import Navbar from "./Navbar";
import { navigationConfig, isNavigationActive } from "./navigation";
import type { NavigationItem } from "./navigation";

export default function Layout() {
  const [mode, setMode] = useState<"navbar" | "sidebar">("navbar");
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMenu = useCallback(() => setMobileOpen(false), []);
  const menuId = useId();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasAnyPermission } = useAuth();
  const { requests } = usePreRegistrations();
  const items: NavigationItem[] = navigationConfig.flatMap<NavigationItem>(
    (item) => {
      if ("children" in item) {
        const children = item.children.filter((link) =>
          hasAnyPermission(link.permissions),
        );
        return children.length ? [{ ...item, children }] : [];
      }
      return hasAnyPermission(item.permissions) ? [item] : [];
    },
  );
  const allLinks = items.flatMap((item) =>
    "children" in item ? item.children : [item],
  );
  const currentLink = allLinks.find((link) =>
    isNavigationActive(location.pathname, link.to, location.search),
  );
  const pendingCount = hasAnyPermission(["preregistration.review"])
    ? requests.filter((request) => request.requestStatus === "pending").length
    : 0;
  useEffect(closeMenu, [location.key, closeMenu]);
  const handleLogout = () => {
    closeMenu();
    logout();
    navigate("/login", { replace: true });
  };
  const sidebarProps = { items, pendingCount, user, onLogout: handleLogout };

  return (
    <div className="relative min-h-screen bg-app font-sans text-body">
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[100] rounded-lg bg-white px-4 py-2 font-semibold text-brand-700 shadow-lg focus:not-sr-only"
      >
        ข้ามไปเนื้อหา
      </a>
      {mode === "sidebar" && (
        <aside
          aria-label="แถบเมนูด้านข้าง"
          className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 lg:block"
        >
          <Sidebar {...sidebarProps} />
        </aside>
      )}
      <MobileSidebar
        {...sidebarProps}
        id={menuId}
        open={mobileOpen}
        onClose={closeMenu}
      />
      <div className={`min-w-0 ${mode === "sidebar" ? "lg:pl-72" : ""}`}>
        {mode === "sidebar" ? (
          <Topbar
            title={currentLink?.label ?? "ระบบจัดการฝึกอบรมพนักงาน"}
            name={user?.name}
            menuOpen={mobileOpen}
            menuId={menuId}
            onOpenMenu={() => setMobileOpen(true)}
            onShowNavbar={() => {
              closeMenu();
              setMode("navbar");
            }}
          />
        ) : (
          <Navbar
            {...sidebarProps}
            menuId={menuId}
            menuOpen={mobileOpen}
            onOpenMenu={() => setMobileOpen(true)}
            onShowSidebar={() => {
              closeMenu();
              setMode("sidebar");
            }}
          />
        )}
        <main id="main-content" tabIndex={-1} className="min-w-0 outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
