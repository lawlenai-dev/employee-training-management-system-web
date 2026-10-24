import { useEffect, useId, useRef, useState } from "react";
import { Building2, FolderTree, X } from "lucide-react";
import { Button } from "../../../components/Ui";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  sameId,
  sectionName,
  saveSectionSetting,
} from "../../../features/settings/sectionSettings";
import type { SectionForm } from "../../../features/settings/sectionSettings";
import type { SettingRow } from "../settings.types";

type Props = {
  kind: "sections" | "subsections";
  row?: SettingRow;
  parentId?: string | number;
  onClose: () => void;
};
const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export default function SectionSettingModal({
  kind,
  row,
  parentId,
  onClose,
}: Props) {
  const sections = useAppSelector(
    (state) => state.settings.rowsByMenu.sections,
  );
  const dispatch = useAppDispatch();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const isChild = kind === "subsections";
  const label = isChild ? "หน่วยงานย่อย" : "ส่วนงาน";
  const Icon = isChild ? FolderTree : Building2;
  const [form, setForm] = useState<SectionForm>(() => ({
    code: String(row?.code ?? ""),
    name: String(row?.name ?? ""),
    description: String(row?.description ?? ""),
    status: row?.status === "inactive" ? "inactive" : "active",
    sectionId:
      typeof row?.sectionId === "string" || typeof row?.sectionId === "number"
        ? row.sectionId
        : parentId,
  }));
  const [error, setError] = useState("");
  const existingParentId = row?.sectionId;
  const options = (sections ?? []).filter(
    (section) =>
      section.status === "active" || sameId(section.id, existingParentId),
  );
  const update = <K extends keyof SectionForm>(key: K, value: SectionForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      if (dialog?.open) dialog.close();
    };
  }, []);
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={onClose}
      className="m-auto w-[calc(100%_-_2rem)] max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-slate-800 shadow-2xl backdrop:bg-slate-950/50"
    >
      <form
        className="flex max-h-[90dvh] flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          try {
            dispatch(saveSectionSetting(kind, form, row?.id));
            onClose();
          } catch (cause) {
            setError(
              cause instanceof Error ? cause.message : "บันทึกไม่สำเร็จ",
            );
          }
        }}
      >
        <header className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
          <span className="rounded-xl bg-brand-50 p-3 text-brand-600">
            <Icon size={22} />
          </span>
          <div className="flex-1">
            <h2 id={titleId} className="text-lg font-bold">
              {row ? "แก้ไข" : "เพิ่ม"}
              {label}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {isChild
                ? "เลือกส่วนงานที่หน่วยงานย่อยนี้สังกัด"
                : "กำหนดส่วนงานหลักสำหรับจัดกลุ่มหน่วยงานย่อย"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </header>
        <div className="space-y-4 overflow-y-auto px-6 py-5">
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          {isChild && (
            <label className="block text-sm font-semibold">
              ส่วนงานที่สังกัด *
              <select
                autoFocus
                required
                value={
                  form.sectionId === undefined ? "" : String(form.sectionId)
                }
                onChange={(event) => {
                  const parent = (sections ?? []).find(
                    (section) => String(section.id) === event.target.value,
                  );
                  update("sectionId", parent?.id);
                }}
                className={inputClass}
              >
                <option value="">เลือกส่วนงาน</option>
                {options.map((section) => (
                  <option key={section.id} value={String(section.id)}>
                    {String(section.code ?? "")} — {sectionName(section)}
                    {section.status === "inactive" ? " (ปิดใช้งาน)" : ""}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="block text-sm font-semibold">
            รหัส{label} *
            <input
              autoFocus={!isChild}
              required
              minLength={2}
              maxLength={30}
              pattern="[A-Za-z0-9_-]+"
              value={form.code}
              onChange={(event) =>
                update("code", event.target.value.toUpperCase())
              }
              placeholder={isChild ? "เช่น SUB001" : "เช่น SEC001"}
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-semibold">
            ชื่อ{label} *
            <input
              required
              maxLength={100}
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-semibold">
            รายละเอียด
            <textarea
              rows={3}
              maxLength={500}
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-semibold">
            สถานะ
            <select
              value={form.status}
              onChange={(event) =>
                update("status", event.target.value as SectionForm["status"])
              }
              className={inputClass}
            >
              <option value="active">ใช้งาน</option>
              <option value="inactive">ปิดใช้งาน</option>
            </select>
          </label>
        </div>
        <footer className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button type="submit">บันทึก{label}</Button>
        </footer>
      </form>
    </dialog>
  );
}
