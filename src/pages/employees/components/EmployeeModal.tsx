import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Save, UserPlus, Eye, Pencil, X } from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "../../../components/Ui";
import { positionMockup } from "../../../data";
import EmployeeFields from "./EmployeeFields";
import { EMPTY_FORM, FIELD_RULES, fieldLabels, normalizeEmployee, resolvedRule, canEdit, buildEmployeeChanges, calculateAge } from "./employeeModel";
import type { EmployeeForm, EmployeeField, EmployeeModalProps, LookupOption } from "./employeeModel";
export * from "./employeeModel";

export default function EmployeeModal(props: EmployeeModalProps) {
  if (!props.open) return null;
  return (
    <EmployeeModalContent
      key={`${props.mode ?? "create"}:${props.recordKey ?? props.initialData?.employee_code ?? "new"}`}
      {...props}
    />
  );
}
function EmployeeModalContent({
  mode = "create",
  title,
  description,
  submitLabel,
  initialData = null,
  fieldRules,
  departments = [],
  positions = positionMockup as LookupOption[],
  nationalities = [],
  companies = [],
  saving = false,
  error = "",
  onClose,
  onSubmit,
  onUpdate,
  children,
  footer,
}: EmployeeModalProps) {
  // Snapshot taken when the modal opens; parent rerenders do not erase unsaved input.
  const [original] = useState(() => normalizeEmployee(initialData));
  const [form, setForm] = useState<EmployeeForm>(original);
  const [previewUrl, setPreviewUrl] = useState(original.photo_url);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");
  const [notice, setNotice] = useState("");
  const busyRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const view = mode === "view";
  const Container = view ? "div" : "form";
  const busy = saving || submitting;
  const data = view ? normalizeEmployee(initialData) : form;
  const lookups: Partial<Record<EmployeeField, LookupOption[]>> = {
    department: departments,
    position: positions,
    nationality: nationalities,
    company: companies,
  };
  const editable = (field: EmployeeField) => canEdit(field, mode, fieldRules);
  const required = (field: EmployeeField) =>
    editable(field) && resolvedRule(field, fieldRules).required.includes(mode);
  const close = () => {
    if (!busy && !busyRef.current) onClose();
  };
  useEffect(
    () => () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );
  useEffect(() => {
    const previous = document.body.style.overflow;
    const focus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      focus?.focus();
    };
  }, []);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy && !busyRef.current) onClose();
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [busy, onClose]);
  const updateField = <K extends keyof EmployeeForm>(
    field: K,
    value: EmployeeForm[K],
  ) => {
    const policyField = field === "photo_url" ? "photo" : field;
    if (!editable(policyField)) return;
    setForm((current) => ({ ...current, [field]: value }));
    setLocalError("");
    setNotice("");
  };
  const handleCapturedPhoto = (file: File) => {
    if (!editable("photo")) return;
    if (!file.type.startsWith("image/")) {
      setLocalError("กรุณาเลือกไฟล์รูปภาพ");
      return;
    }
    updateField("photo", file);
    setPreviewUrl(URL.createObjectURL(file));
  };
  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleCapturedPhoto(file);
  };
  const handleRemovePhoto = () => {
    if (!editable("photo")) return;
    setPreviewUrl("");
    setForm((current) => ({ ...current, photo: null, photo_url: "" }));
  };
  const handleSubmit = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    if (view || busy || busyRef.current) return;
    for (const key of Object.keys(FIELD_RULES) as EmployeeField[]) {
      if (!required(key)) continue;
      const value =
        key === "photo" ? form.photo || form.photo_url : form[key].trim();
      if (!value) {
        setLocalError(`กรุณาระบุ${fieldLabels[key]}`);
        return;
      }
    }
    if (
      editable("birth_date") &&
      form.birth_date &&
      calculateAge(form.birth_date) === ""
    ) {
      setLocalError("กรุณาระบุวันเกิดที่ถูกต้องและไม่เกินวันนี้");
      return;
    }
    for (const key of [
      "department",
      "position",
      "nationality",
      "company",
    ] as const) {
      if (!editable(key) || (mode === "edit" && form[key] === original[key]))
        continue;
      const options = lookups[key] ?? [];
      if (
        form[key] &&
        options.length &&
        !options.some((option) => option.code === form[key])
      ) {
        setLocalError(`กรุณาเลือก${fieldLabels[key]}จากรายการ`);
        return;
      }
    }
    if (mode === "create" && !onSubmit) {
      setLocalError("ยังไม่ได้เชื่อมฟังก์ชัน onSubmit สำหรับสร้างพนักงาน");
      return;
    }
    if (mode === "edit" && !onUpdate) {
      setLocalError("ยังไม่ได้เชื่อมฟังก์ชัน onUpdate สำหรับแก้ไขพนักงาน");
      return;
    }
    const changes = buildEmployeeChanges(form, original, fieldRules);
    if (mode === "edit" && !Object.keys(changes).length) {
      setNotice("ยังไม่มีข้อมูลที่เปลี่ยนแปลง");
      return;
    }
    busyRef.current = true;
    setSubmitting(true);
    setLocalError("");
    setNotice("");
    try {
      if (mode === "edit") await onUpdate!(changes);
      else {
        // Ignore initialData values for fields that are not editable during creation.
        const payload = { ...EMPTY_FORM };
        for (const key of Object.keys(FIELD_RULES) as EmployeeField[]) {
          if (editable(key)) Object.assign(payload, { [key]: form[key] });
        }
        if (editable("photo")) payload.photo_url = form.photo_url;
        await onSubmit!({
          ...payload,
          calculated_age: calculateAge(payload.birth_date),
        });
      }
      onClose();
    } catch (error) {
      setLocalError(
        error instanceof Error
          ? error.message
          : "บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง",
      );
    } finally {
      busyRef.current = false;
      setSubmitting(false);
    }
  };
  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const nodes = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), a[href]',
            ),
          ).filter((node) => node.getClientRects().length > 0);
          const first = nodes[0];
          const last = nodes[nodes.length - 1];
          if (!first) {
            event.preventDefault();
            return;
          }
          if (
            event.shiftKey &&
            (document.activeElement === first ||
              document.activeElement === event.currentTarget)
          ) {
            event.preventDefault();
            last.focus();
          } else if (
            !event.shiftKey &&
            (document.activeElement === last ||
              document.activeElement === event.currentTarget)
          ) {
            event.preventDefault();
            first.focus();
          }
        }}
        className="flex max-h-[100dvh] w-full max-w-4xl flex-col overflow-hidden bg-white shadow-2xl outline-none sm:max-h-[92dvh] sm:rounded-2xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border bg-white px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              {view ? (
                <Eye size={22} />
              ) : mode === "edit" ? (
                <Pencil size={22} />
              ) : (
                <UserPlus size={22} />
              )}
            </span>
            <div>
              <h2 id={titleId} className="text-lg font-bold text-heading">
                {title ??
                  (view
                    ? "ข้อมูลพนักงาน"
                    : mode === "edit"
                      ? "แก้ไขข้อมูลพนักงาน"
                      : "เพิ่มข้อมูลพนักงาน")}
              </h2>
              <p className="mt-1 text-xs text-muted">
                {description ??
                  (view
                    ? "รายละเอียดข้อมูลพนักงาน"
                    : "กรอกข้อมูลให้ครบถ้วน ช่องที่มีเครื่องหมาย * จำเป็นต้องระบุ")}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="ปิดหน้าต่าง"
            onClick={close}
            disabled={busy}
            className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </header>
        <Container onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto bg-slate-100/80 p-4 sm:p-6">
            {view ? <EmployeeFields mode={mode} values={data} fieldRules={fieldRules}
              departments={departments} positions={positions} nationalities={nationalities} companies={companies} /> : (
              <fieldset disabled={busy} className="min-w-0">
                <EmployeeFields mode={mode} values={form} fieldRules={fieldRules}
                  departments={departments} positions={positions} nationalities={nationalities} companies={companies}
                  onChange={updateField} previewUrl={previewUrl} onCapture={handleCapturedPhoto}
                  onPhotoChange={handlePhotoChange} onRemovePhoto={handleRemovePhoto} />
              </fieldset>
            )}
            {children}
            {(localError || error) && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {localError || error}
              </p>
            )}
            {notice && (
              <p
                role="status"
                className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-700"
              >
                {notice}
              </p>
            )}
          </div>
          <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-border bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            {footer ?? <>
            <Button
              type="button"
              variant="secondary"
              disabled={busy}
              onClick={close}
            >
              {view ? "ปิด" : "ยกเลิก"}
            </Button>
            {!view && (
              <Button
                type="submit"
                disabled={busy}
                className="!bg-accent-500 hover:!bg-accent-600"
              >
                <Save size={18} />
                {busy
                  ? "กำลังบันทึก..."
                  : (submitLabel ??
                    (mode === "edit" ? "บันทึกการแก้ไข" : "บันทึกพนักงาน"))}
              </Button>
            )}
            </>}
          </footer>
        </Container>
      </div>
    </div>,
    document.body,
  );
}
