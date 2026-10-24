import { useEffect, useId, useRef, useState } from "react";
import { ShieldCheck, UserRound, X } from "lucide-react";
import { Button } from "../../../components/Ui";
import { effectivePermissions } from "../../../features/rbac/rbacModel";
import { permissionGroups } from "../../../features/rbac/rbac.types";
import {
  saveAccessRole,
  saveAccessUser,
} from "../../../features/rbac/rbacSlice";
import { useAppDispatch } from "../../../app/hooks";
import type {
  AccessRole,
  AccessState,
  AccessUser,
} from "../../../features/rbac/rbac.types";
type Props = {
  kind: "roles" | "users";
  role?: AccessRole;
  user?: AccessUser;
  state: AccessState;
  onClose: () => void;
};
const fieldClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
export default function AccessFormModal({
  kind,
  role,
  user,
  state,
  onClose,
}: Props) {
  const dispatch = useAppDispatch();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [name, setName] = useState(role?.name ?? user?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [password, setPassword] = useState("");
  const [supplierId, setSupplierId] = useState(
    user?.supplierId === undefined ? "" : String(user.supplierId),
  );
  const [department, setDepartment] = useState(user?.department ?? "");
  const [supplierTier, setSupplierTier] = useState(user?.supplierTier ?? "");
  const [status, setStatus] = useState<"active" | "inactive">(
    role?.status ?? user?.status ?? "active",
  );
  const [permissions, setPermissions] = useState<string[]>(
    role?.permissions ?? [],
  );
  const [roleIds, setRoleIds] = useState<string[]>(user?.roleIds ?? []);
  const [error, setError] = useState("");
  const isRole = kind === "roles";
  const Icon = isRole ? ShieldCheck : UserRound;
  const unknownPermissions = permissions.filter(
    (key) =>
      !permissionGroups.some((group) =>
        group.items.some((item) => item.key === key),
      ),
  );
  const previewUser: AccessUser = {
    id: user?.id ?? "preview",
    accountId: user?.accountId ?? -1,
    password: "",
    name,
    username,
    department,
    supplierTier,
    status,
    roleIds,
  };
  const preview = effectivePermissions(
    {
      ...state,
      users: [previewUser],
    },
    username,
  );
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);
  const toggle = (list: string[], key: string) =>
    list.includes(key) ? list.filter((value) => value !== key) : [...list, key];
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={onClose}
      className="m-auto w-[calc(100%_-_2rem)] max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-slate-800 shadow-2xl backdrop:bg-slate-950/50"
    >
      <form
        className="flex max-h-[90dvh] flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          try {
            if (isRole)
              dispatch(
                saveAccessRole({
                  id: role?.id,
                  name,
                  description,
                  status,
                  permissions,
                }),
              );
            else
              dispatch(
                saveAccessUser({
                  id: user?.id,
                  name,
                  username,
                  password,
                  supplierId: supplierId ? Number(supplierId) : undefined,
                  department,
                  supplierTier,
                  status,
                  roleIds,
                }),
              );
            onClose();
          } catch (cause) {
            setError(
              cause instanceof Error
                ? cause.message
                : "บันทึกไม่สำเร็จ กรุณาลองใหม่",
            );
          }
        }}
      >
        <header className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
          <span className="rounded-xl bg-blue-50 p-3 text-blue-700">
            <Icon size={22} />
          </span>
          <div className="flex-1">
            <h2 id={titleId} className="text-lg font-bold">
              {role || user ? "แก้ไข" : "เพิ่ม"}
              {isRole ? "บทบาท" : "ผู้ใช้งาน"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {isRole
                ? "เลือกสิทธิ์ที่สมาชิกบทบาทนี้สามารถใช้งานได้"
                : "กำหนดบทบาทได้มากกว่าหนึ่งบทบาท"}
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
        <div className="space-y-5 overflow-y-auto px-6 py-5">
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              <span>{isRole ? "ชื่อบทบาท" : "ชื่อผู้ใช้งาน"} *</span>
              <input
                autoFocus
                required
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={fieldClass}
                placeholder={
                  isRole ? "เช่น เจ้าหน้าที่ฝึกอบรม" : "ชื่อ-นามสกุล"
                }
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>สถานะ</span>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "active" | "inactive")
                }
                className={fieldClass}
              >
                <option value="active">ใช้งาน</option>
                <option value="inactive">ปิดใช้งาน</option>
              </select>
            </label>
            {isRole ? (
              <label className="space-y-2 text-sm font-medium sm:col-span-2">
                <span>รายละเอียด</span>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className={fieldClass}
                />
              </label>
            ) : (
              <>
                <label className="space-y-2 text-sm font-medium">
                  <span>Username *</span>
                  <input
                    required
                    minLength={4}
                    maxLength={30}
                    pattern="[A-Za-z0-9._-]+"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>
                    {user?.password
                      ? "รหัสผ่านใหม่ (เว้นว่างเพื่อใช้รหัสเดิม)"
                      : "รหัสผ่าน *"}
                  </span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    required={!user || !user.password}
                    minLength={4}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>รหัสบริษัทผู้รับเหมา (ถ้ามี)</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={supplierId}
                    onChange={(event) => setSupplierId(event.target.value)}
                    className={fieldClass}
                  />
                  <span className="block text-xs font-normal text-slate-500">
                    ใช้ supplierId เดียวกับข้อมูลพนักงาน
                  </span>
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>แผนก *</span>
                  <input
                    required
                    maxLength={100}
                    value={department}
                    onChange={(event) => setDepartment(event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>Supplier Tier (ถ้ามี)</span>
                  <select
                    value={supplierTier}
                    onChange={(event) => setSupplierTier(event.target.value)}
                    className={fieldClass}
                  >
                    <option value="">ไม่ระบุ</option>
                    <option value="tier1">Tier 1</option>
                    <option value="tier2">Tier 2</option>
                    <option value="tier3">Tier 3</option>
                    {supplierTier &&
                      !["tier1", "tier2", "tier3"].includes(supplierTier) && (
                        <option value={supplierTier}>{supplierTier}</option>
                      )}
                  </select>
                </label>
              </>
            )}
          </div>
          {isRole ? (
            <fieldset className="space-y-3">
              <legend className="mb-3 text-sm font-bold">
                สิทธิ์การเข้าถึง{" "}
                <span className="font-normal text-slate-500">
                  ({permissions.length} สิทธิ์)
                </span>
              </legend>
              {permissionGroups.map((group) => {
                const keys: string[] = group.items.map((item) => item.key);
                const allSelected = keys.every((key) =>
                  permissions.includes(key),
                );
                return (
                  <div
                    key={group.label}
                    className="overflow-hidden rounded-xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
                      <h3 className="text-sm font-semibold">{group.label}</h3>
                      <button
                        type="button"
                        className="text-xs font-semibold text-blue-700 hover:underline"
                        onClick={() =>
                          setPermissions((current) =>
                            allSelected
                              ? current.filter((key) => !keys.includes(key))
                              : [...new Set([...current, ...keys])],
                          )
                        }
                      >
                        {allSelected ? "ยกเลิกทั้งกลุ่ม" : "เลือกทั้งกลุ่ม"}
                      </button>
                    </div>
                    <div className="grid gap-2 p-3 sm:grid-cols-2">
                      {group.items.map((item) => (
                        <label
                          key={item.key}
                          className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-blue-50"
                        >
                          <input
                            type="checkbox"
                            checked={permissions.includes(item.key)}
                            onChange={() =>
                              setPermissions((current) =>
                                toggle(current, item.key),
                              )
                            }
                            className="mt-1 h-4 w-4 accent-blue-700"
                          />
                          <span className="text-sm">
                            {item.label}
                            <span className="mt-1 block break-all text-xs text-slate-400">
                              {item.key}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
              {unknownPermissions.length > 0 && (
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="mb-2 text-sm font-semibold">
                    สิทธิ์เพิ่มเติมจากข้อมูลเดิม
                  </p>
                  {unknownPermissions.map((key) => (
                    <label key={key} className="flex gap-2 py-2 text-sm">
                      <input
                        type="checkbox"
                        checked
                        onChange={() =>
                          setPermissions((current) => toggle(current, key))
                        }
                      />
                      {key}
                    </label>
                  ))}
                </div>
              )}
            </fieldset>
          ) : (
            <fieldset>
              <legend className="mb-3 text-sm font-bold">
                บทบาทของผู้ใช้งาน
              </legend>
              {state.roles.length === 0 && (
                <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                  ยังไม่มีบทบาท กรุณาสร้างในเมนู Role & Permission
                </p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                {state.roles.map((item) => (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${roleIds.includes(item.id) ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}
                  >
                    <input
                      type="checkbox"
                      checked={roleIds.includes(item.id)}
                      onChange={() =>
                        setRoleIds((current) => toggle(current, item.id))
                      }
                      className="mt-1 h-4 w-4 accent-blue-700"
                    />
                    <span className="min-w-0 text-sm font-semibold">
                      {item.name}
                      <span className="mt-1 block text-xs font-normal text-slate-500">
                        {item.status === "inactive"
                          ? "ปิดใช้งาน — ไม่ได้รับสิทธิ์จากบทบาทนี้"
                          : `${item.permissions.length} สิทธิ์`}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold">
                  สิทธิ์ที่ผู้ใช้จะได้รับ: {preview.length} สิทธิ์
                </p>
                <p className="mt-2 break-words text-xs leading-6 text-slate-500">
                  {preview.join(", ") || "ยังไม่มีสิทธิ์การเข้าถึง"}
                </p>
              </div>
            </fieldset>
          )}
        </div>
        <footer className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button type="submit">บันทึก{isRole ? "บทบาท" : "ผู้ใช้งาน"}</Button>
        </footer>
      </form>
    </dialog>
  );
}
