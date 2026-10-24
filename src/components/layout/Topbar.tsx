import { Menu, PanelTop, ShieldCheck } from "lucide-react";
type Props = {
  title: string;
  name?: string;
  menuOpen: boolean;
  menuId: string;
  onOpenMenu: () => void;
  onShowNavbar: () => void;
};
export default function Topbar({
  title,
  name,
  menuOpen,
  menuId,
  onOpenMenu,
  onShowNavbar,
}: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          aria-label="เปิดเมนู"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={onOpenMenu}
          className="rounded-xl p-2 text-heading transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 lg:hidden"
        >
          <Menu size={24} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-muted">Employee Training System</p>
          <p className="truncate text-base font-bold text-heading">{title}</p>
        </div>
        <button
          type="button"
          onClick={onShowNavbar}
          aria-label="แสดง Navbar"
          title="เปลี่ยนเป็น Navbar"
          className="hidden items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 lg:inline-flex"
        >
          <PanelTop size={18} aria-hidden="true" />
          Navbar
        </button>
        <div className="hidden min-w-0 items-center gap-2 text-muted sm:flex">
          <ShieldCheck
            size={17}
            className="shrink-0 text-brand-600"
            aria-hidden="true"
          />
          <span className="max-w-48 truncate text-sm">{name}</span>
        </div>
      </div>
    </header>
  );
}
