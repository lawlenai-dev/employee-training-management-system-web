import type { MouseEvent, ReactNode } from "react";

type UserPermissionModalProps = {
  open?: boolean;
  onClose?: () => void;
  children?: ReactNode;
};

export default function UserPermissionModal({
  open = true,
  onClose,
  children,
}: UserPermissionModalProps) {
  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  if (!open) return null;

  return (
    <div
      role="presentation"
      onMouseDown={handleBackdropClick}
      className="
        fixed inset-0 z-[100]
        flex items-end justify-center
        bg-slate-950/60 backdrop-blur-sm
        sm:items-center sm:p-6
      "
    >
      {children}
    </div>
  );
}
