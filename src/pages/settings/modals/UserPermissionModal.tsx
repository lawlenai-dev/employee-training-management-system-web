import { useEffect, useId, useRef, useState } from "react";
import { KeyRound, X } from "lucide-react";
import { Button } from "../../../components/Ui";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectRbac } from "../../../features/rbac/rbacSelectors";
import { effectivePermissions } from "../../../features/rbac/rbacModel";
import { assignUserRoles } from "../../../features/rbac/rbacSlice";

export default function UserPermissionModal({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const state = useAppSelector(selectRbac);
  const dispatch = useAppDispatch();
  const user = state.users.find((item) => item.id === userId);
  const [roleIds, setRoleIds] = useState(user?.roleIds ?? []);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const preview = user
    ? effectivePermissions(
        { ...state, users: [{ ...user, roleIds }] },
        user.username,
      )
    : [];
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);
  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      aria-labelledby={titleId}
      className="m-auto w-[calc(100%_-_2rem)] max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-slate-800 shadow-2xl backdrop:bg-slate-950/50"
    >
      <form
        className="flex max-h-[90dvh] flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          try {
            dispatch(assignUserRoles(userId, roleIds));
            onClose();
          } catch (cause) {
            setError(
              cause instanceof Error ? cause.message : "บันทึกไม่สำเร็จ",
            );
          }
        }}
      >
        <header className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
          <span className="rounded-xl bg-blue-50 p-3 text-blue-700">
            <KeyRound size={22} />
          </span>
          <div className="flex-1">
            <h2 id={titleId} className="text-lg font-bold">
              กำหนดบทบาทและสิทธิ์
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {user?.name ?? "ไม่พบผู้ใช้"}
            </p>
          </div>
          <button
            type="button"
            aria-label="ปิด"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </header>
        <div className="space-y-4 overflow-y-auto p-6">
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold">
              เลือกบทบาทได้มากกว่าหนึ่งบทบาท
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {state.roles.map((role) => (
                <label
                  key={role.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${roleIds.includes(role.id) ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}
                >
                  <input
                    type="checkbox"
                    checked={roleIds.includes(role.id)}
                    onChange={() =>
                      setRoleIds((current) =>
                        current.includes(role.id)
                          ? current.filter((id) => id !== role.id)
                          : [...current, role.id],
                      )
                    }
                    className="mt-1 h-4 w-4 accent-blue-700"
                  />
                  <span className="text-sm font-semibold">
                    {role.name}
                    <span className="mt-1 block text-xs font-normal text-slate-500">
                      {role.status === "active"
                        ? `${role.permissions.length} สิทธิ์`
                        : "ปิดใช้งาน — ไม่ให้สิทธิ์"}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold">
              สิทธิ์ที่ได้รับ: {preview.length} สิทธิ์
            </p>
            <p className="mt-2 break-words text-xs leading-6 text-slate-500">
              {preview.join(", ") || "ยังไม่มีสิทธิ์การเข้าถึง"}
            </p>
          </div>
        </div>
        <footer className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button type="submit" disabled={!user}>
            บันทึกสิทธิ์
          </Button>
        </footer>
      </form>
    </dialog>
  );
}
