import React from "react";

export default function UserPermissionModal() {
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
    ></div>
  );
}
