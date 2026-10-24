import { BookOpenCheck, LogOut, ShieldCheck, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import SidebarNavigation from "./SidebarNavigation";
import type { NavigationItem } from "./navigation";

export type SidebarProps = {
  items: NavigationItem[];
  pendingCount: number;
  user: { name: string; roleName: string } | null;
  onLogout: () => void;
  onNavigate?: () => void;
  onClose?: () => void;
};

// Shared content for the desktop sidebar and the mobile drawer.
export default function Sidebar({
  items,
  pendingCount,
  user,
  onLogout,
  onNavigate,
  onClose,
}: SidebarProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-sidebar text-white lg:bg-white lg:text-brand-700">
      <div className="flex h-20 shrink-0 items-center gap-3 border-b border-white/10 px-5 lg:border-slate-200">
        <NavLink
          to="/"
          onClick={onNavigate}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-300 lg:bg-brand-50 lg:text-brand-600">
            <BookOpenCheck size={22} aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold tracking-wide">
              Employee Training
            </span>
            <span className="mt-0.5 block text-[11px] text-white/50 lg:text-slate-500">
              ระบบจัดการฝึกอบรมพนักงาน
            </span>
          </span>
        </NavLink>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดเมนู"
            className="shrink-0 rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:text-slate-500 lg:hover:bg-slate-100 lg:hover:text-brand-700"
          >
            <X size={20} />
          </button>
        )}
      </div>
      <SidebarNavigation
        items={items}
        pendingCount={pendingCount}
        onNavigate={onNavigate}
      />
      <div className="shrink-0 border-t border-white/10 p-4 lg:border-slate-200">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3 lg:bg-slate-50">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-amber-300 lg:bg-brand-50 lg:text-brand-600">
            <ShieldCheck size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold" title={user?.name}>
              {user?.name || "ผู้ใช้งาน"}
            </p>
            <p
              className="mt-1 line-clamp-2 break-words text-xs leading-5 text-white/50 lg:text-slate-500"
              title={user?.roleName}
            >
              {user?.roleName}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white/75 transition hover:border-red-300/30 hover:bg-red-400/10 hover:text-red-200 lg:border-red-100 lg:text-red-600 lg:hover:bg-red-50 lg:hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <LogOut size={17} aria-hidden="true" />
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}
