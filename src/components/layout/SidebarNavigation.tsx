import { ChevronDown, FileText } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type {
  NavigationItem,
  NavigationGroup,
  NavigationLink,
} from "./navigation";
import { isNavigationActive } from "./navigation";

type Props = {
  items: NavigationItem[];
  pendingCount: number;
  onNavigate?: () => void;
};
const linkClass = (active: boolean) =>
  `flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${active ? "bg-white text-brand-700 shadow-sm lg:bg-brand-50 lg:shadow-none" : "text-white/75 hover:bg-white/10 hover:text-white lg:text-slate-600 lg:hover:bg-slate-100 lg:hover:text-brand-700"}`;

function NavigationEntry({
  link,
  pendingCount,
  onNavigate,
}: {
  link: NavigationLink;
  pendingCount: number;
  onNavigate?: () => void;
}) {
  const Icon = link.icon;
  const { pathname, search } = useLocation();
  const active = isNavigationActive(pathname, link.to, search);
  return (
    <Link
      to={link.to}
      onClick={onNavigate}
      className={linkClass(active)}
      aria-current={active ? "page" : undefined}
    >
      <Icon size={19} className="shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1 leading-6">{link.label}</span>
      {link.to === "/pre-registrations" && pendingCount > 0 && (
        <span
          aria-label={`รอตรวจสอบ ${pendingCount} รายการ`}
          className="flex min-w-6 shrink-0 items-center justify-center rounded-full bg-accent-500 px-1.5 py-0.5 text-[11px] font-bold text-white"
        >
          {pendingCount > 99 ? "99+" : pendingCount}
        </span>
      )}
    </Link>
  );
}

function NavigationGroupItem({
  group,
  pendingCount,
  onNavigate,
}: {
  group: NavigationGroup;
  pendingCount: number;
  onNavigate?: () => void;
}) {
  const { pathname, search } = useLocation();
  const Icon = group.icon ?? FileText;
  const active = group.children.some((link) =>
    isNavigationActive(pathname, link.to, search),
  );
  const [open, setOpen] = useState(active);
  const controlsId = useId();
  useEffect(() => {
    if (active) setOpen(true);
  }, [active, pathname, search]);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={controlsId}
        onClick={() => setOpen((value) => !value)}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${active ? "bg-white/10 text-white lg:bg-brand-50 lg:text-brand-700" : "text-white/75 hover:bg-white/10 hover:text-white lg:text-slate-600 lg:hover:bg-slate-100 lg:hover:text-brand-700"}`}
      >
        <Icon size={19} className="shrink-0" aria-hidden="true" />
        <span className="flex-1">{group.label}</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id={controlsId}
        hidden={!open}
        className="ml-5 mt-2 space-y-1 border-l border-white/15 pl-3 lg:border-slate-200"
      >
        {group.children.map((link) => (
          <NavigationEntry
            key={link.to}
            link={link}
            pendingCount={pendingCount}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}

export default function SidebarNavigation({
  items,
  pendingCount,
  onNavigate,
}: Props) {
  return (
    <nav
      aria-label="เมนูหลัก"
      className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4"
    >
      <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 lg:text-slate-400">
        เมนูการใช้งาน
      </p>
      {items.map((item) =>
        "children" in item ? (
          <NavigationGroupItem
            key={item.label}
            group={item}
            pendingCount={pendingCount}
            onNavigate={onNavigate}
          />
        ) : (
          <NavigationEntry
            key={item.to}
            link={item}
            pendingCount={pendingCount}
            onNavigate={onNavigate}
          />
        ),
      )}
    </nav>
  );
}
