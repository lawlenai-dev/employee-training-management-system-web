import {
  BookOpenCheck,
  ChevronDown,
  FileText,
  LogOut,
  Menu,
  PanelLeft,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type {
  NavigationGroup,
  NavigationItem,
  NavigationLink,
} from "./navigation";
import { isNavigationActive } from "./navigation";

type Props = {
  items: NavigationItem[];
  pendingCount: number;
  user: { name: string; roleName: string } | null;
  onLogout: () => void;
  onShowSidebar: () => void;
  onOpenMenu: () => void;
  menuOpen: boolean;
  menuId: string;
};
const navClass = (active: boolean, hero: boolean) =>
  `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${active ? (hero ? "bg-white/15 text-white" : "bg-brand-50 text-brand-700") : hero ? "text-white/75 hover:bg-white/10 hover:text-white" : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"}`;

function Dropdown({ group, hero }: { group: NavigationGroup; hero: boolean }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const controlsId = useId();
  const location = useLocation();
  const Icon = group.icon ?? FileText;
  const active = group.children.some((link) =>
    isNavigationActive(location.pathname, link.to, location.search),
  );
  useEffect(() => setOpen(false), [location.key]);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      )
        setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);
  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={controlsId}
        onClick={() => setOpen((value) => !value)}
        className={navClass(active || open, hero)}
      >
        <Icon size={17} className="shrink-0" aria-hidden="true" />
        {group.label}
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id={controlsId}
        hidden={!open}
        className="absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw_-_2rem)] rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-xl"
      >
        {group.children.map((link) => {
          const ItemIcon = link.icon;
          const selected = isNavigationActive(
            location.pathname,
            link.to,
            location.search,
          );
          return (
            <Link
              key={link.to}
              to={link.to}
              aria-current={selected ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${selected ? "bg-brand-50 text-brand-700" : "hover:bg-slate-100 hover:text-brand-700"}`}
            >
              <ItemIcon size={18} className="shrink-0" aria-hidden="true" />
              <span className="leading-6">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function NavbarLink({
  link,
  hero,
  pendingCount,
}: {
  link: NavigationLink;
  hero: boolean;
  pendingCount: number;
}) {
  const { pathname, search } = useLocation();
  const active = isNavigationActive(pathname, link.to, search);
  const Icon = link.icon;
  return (
    <Link
      to={link.to}
      aria-current={active ? "page" : undefined}
      className={navClass(active, hero)}
    >
      <Icon size={17} className="shrink-0" aria-hidden="true" />
      <span className="whitespace-nowrap">{link.label}</span>
      {link.to === "/pre-registrations" && pendingCount > 0 && (
        <span
          aria-label={`รอตรวจสอบ ${pendingCount} รายการ`}
          className="rounded-full bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold text-white"
        >
          {pendingCount > 99 ? "99+" : pendingCount}
        </span>
      )}
    </Link>
  );
}

export default function Navbar({
  items,
  pendingCount,
  user,
  onLogout,
  onShowSidebar,
  onOpenMenu,
  menuOpen,
  menuId,
}: Props) {
  const { pathname } = useLocation();
  const hero = pathname === "/dashboard" || pathname === "/courses";
  const buttonClass = `rounded-xl p-2.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${hero ? "text-white/75 hover:bg-white/10 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-brand-700"}`;
  return (
    <header
      className={`inset-x-0 top-0 z-40 border-b ${hero ? "absolute border-white/10 bg-[#001a3d]/45 text-white backdrop-blur-md" : "sticky border-border bg-surface/95 text-heading shadow-sm backdrop-blur-md"}`}
    >
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-2 px-4 sm:px-6 lg:px-5 xl:px-8">
        <Link
          to="/"
          aria-label="Employee Training System หน้าหลัก"
          className="flex shrink-0 items-center gap-2 rounded-lg"
        >
          <BookOpenCheck size={24} aria-hidden="true" />
          <span className="text-xs font-semibold lg:hidden xl:inline">
            Employee Training System
          </span>
        </Link>
        <nav
          aria-label="เมนูหลักบน Navbar"
          className="hidden min-w-0 items-center gap-1 lg:flex"
        >
          {items.map((item) =>
            "children" in item ? (
              <Dropdown key={item.label} group={item} hero={hero} />
            ) : (
              <NavbarLink
                key={item.to}
                link={item}
                hero={hero}
                pendingCount={pendingCount}
              />
            ),
          )}
        </nav>
        <div className="flex shrink-0 items-center gap-1">
          <div
            className={`mr-1 hidden max-w-36 rounded-xl px-3 py-2 text-right 2xl:block ${hero ? "bg-white/10" : "bg-slate-100"}`}
          >
            <p className="truncate text-xs font-bold" title={user?.name}>
              {user?.name}
            </p>
            <p
              className={`truncate text-[11px] ${hero ? "text-white/60" : "text-muted"}`}
              title={user?.roleName}
            >
              {user?.roleName}
            </p>
          </div>
          <button
            type="button"
            onClick={onShowSidebar}
            aria-label="แสดง Sidebar"
            title="เปลี่ยนเป็น Sidebar"
            className={`hidden lg:inline-flex ${buttonClass}`}
          >
            <PanelLeft size={21} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onLogout}
            aria-label="ออกจากระบบ"
            title="ออกจากระบบ"
            className={`hidden lg:inline-flex ${buttonClass}`}
          >
            <LogOut size={19} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="เปิดเมนู"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            className={`lg:hidden ${buttonClass}`}
          >
            <Menu size={25} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
