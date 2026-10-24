import { useEffect, useId, useRef } from "react";
import Sidebar from "./Sidebar";
import type { SidebarProps } from "./Sidebar";

type Props = SidebarProps & { open: boolean; onClose: () => void; id: string };
export default function MobileSidebar({ open, onClose, id, ...props }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => {
      if (desktop.matches) onClose();
    };
    desktop.addEventListener("change", onResize);
    onResize();
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", onResize);
      if (dialog.open) dialog.close();
    };
  }, [open, onClose]);
  return (
    <dialog
      id={id}
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-y-0 left-0 right-auto m-0 h-dvh max-h-none w-72 max-w-[calc(100vw_-_2rem)] overflow-hidden border-0 bg-sidebar p-0 text-white shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-[2px]"
    >
      <h2 id={titleId} className="sr-only">
        เมนูหลักบนมือถือ
      </h2>
      <Sidebar {...props} onClose={onClose} onNavigate={onClose} />
    </dialog>
  );
}
