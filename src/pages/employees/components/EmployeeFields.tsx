import { useId, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { Award, BriefcaseBusiness, Building2, CalendarDays, FileText, HeartPulse, IdCard, IvBag, ShieldCheck, UserRound, VenusAndMars } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EmployeePhotoInput } from "../../../components/EmployeePhotoInput";
import { calculateAge, canEdit, employmentFields, fieldLabels, getEmployeeFullName, healthFields, localToday, multiline, personalFields, resolvedRule, selectOptions } from "./employeeModel";
import type { EmployeeField, EmployeeForm, EmployeeModalMode, EmployeeModalProps, EmployeeStatus, LookupOption } from "./employeeModel";

type Props = {
  mode: EmployeeModalMode;
  values: EmployeeForm;
  fieldRules?: EmployeeModalProps["fieldRules"];
  departments?: LookupOption[]; positions?: LookupOption[];
  nationalities?: LookupOption[]; companies?: LookupOption[];
  onChange?: <K extends keyof EmployeeForm>(field: K, value: EmployeeForm[K]) => void;
  previewUrl?: string;
  onCapture?: (file: File) => void;
  onPhotoChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto?: () => void;
};
const control = "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-body outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-100";
const icons: Partial<Record<EmployeeField, LucideIcon>> = {
  employee_code: IdCard, prefix: UserRound, first_name: UserRound, last_name: UserRound,
  gender: VenusAndMars, birth_date: CalendarDays, nationality: UserRound,
  department: Building2, position: Award, company: Building2, status: ShieldCheck,
  blood_group: IvBag, chronic_disease: HeartPulse, drug_allergy: HeartPulse,
  food_allergy: HeartPulse, work_restrictions: ShieldCheck, health_note: FileText, note: FileText,
};
export default function EmployeeFields({ mode, values, fieldRules, departments = [], positions = [], nationalities = [], companies = [], onChange, previewUrl, onCapture, onPhotoChange, onRemovePhoto }: Props) {
  const groupId = useId();
  const visible = (field: EmployeeField) => resolvedRule(field, fieldRules).visible.includes(mode);
  const editable = (field: EmployeeField) => canEdit(field, mode, fieldRules);
  const required = (field: EmployeeField) => editable(field) && resolvedRule(field, fieldRules).required.includes(mode);
  const lookups: Partial<Record<EmployeeField, LookupOption[]>> = { department: departments, position: positions, nationality: nationalities, company: companies };
  const age = calculateAge(values.birth_date);
  const labelValue = (field: EmployeeField) => {
    const value = values[field];
    if (typeof value !== "string" || !value) return field === "employee_code" ? "ยังไม่มีรหัสพนักงาน" : "ไม่ระบุ";
    if (field === "birth_date") {
      const date = new Date(`${value}T00:00:00`);
      return Number.isNaN(date.getTime()) ? "ไม่ระบุ" : `${date.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}${age === "" ? "" : ` (${age} ปี)`}`;
    }
    return selectOptions[field]?.find((item) => item.value === value)?.label
      ?? lookups[field]?.find((item) => item.code === value)?.name
      ?? (field === "nationality" ? ({ TH: "ไทย", LA: "ลาว" } as Record<string, string>)[value] : undefined) ?? value;
  };
  const viewItem = (field: EmployeeField) => visible(field) ? <EmployeeInfoItem key={field} label={fieldLabels[field]} value={labelValue(field)} icon={icons[field]} /> : null;
  const field = (name: EmployeeField) => {
    if (!visible(name)) return null;
    if (name === "photo") return <FormRow key={name} label="รูปพนักงาน" required={required(name)}>{(id) => <div id={id}>
      {editable(name) && onCapture && onPhotoChange && onRemovePhoto ? <EmployeePhotoInput previewUrl={previewUrl ?? values.photo_url} onCapture={onCapture} onPhotoChange={onPhotoChange} onRemove={onRemovePhoto} /> : <EmployeePhoto url={values.photo_url} />}
    </div>}</FormRow>;
    return <FormRow key={name} label={fieldLabels[name]} required={required(name)}>{(id) => {
      if (!editable(name)) return <p id={id} className="py-2.5 text-sm text-heading">{mode === "create" && name === "employee_code" ? "ระบบจะกำหนดรหัสหลังอนุมัติ" : labelValue(name)}</p>;
      const options = selectOptions[name];
      if (lookups[name]) return <LookupControl id={id} label={fieldLabels[name]} required={required(name)} options={lookups[name] ?? []} value={values[name] as string} onChange={(value) => { onChange?.(name, value); if (name === "department" && editable("position")) onChange?.("position", ""); }} />;
      if (name === "gender") return <div id={id} role="radiogroup" aria-label="เพศ" className="flex min-h-11 flex-wrap items-center gap-2">{options?.map((option) => <label key={option.value} className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${values.gender === option.value ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-body"}`}><input type="radio" name={`${groupId}-gender`} required={required(name)} checked={values.gender === option.value} value={option.value} onChange={(event) => onChange?.("gender", event.target.value)} className="accent-[#003274]" />{option.label}</label>)}</div>;
      if (options) return <select id={id} required={required(name)} value={values[name] as string} onChange={(event) => name === "status" ? onChange?.("status", event.target.value as EmployeeStatus) : onChange?.(name, event.target.value)} className={control}><option value="">กรุณาเลือก</option>{values[name] && !options.some((item) => item.value === values[name]) && <option value={values[name] as string}>{values[name] as string}</option>}{options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>;
      if (multiline.has(name)) return <textarea id={id} rows={3} required={required(name)} value={values[name] as string} onChange={(event) => onChange?.(name, event.target.value)} className={`${control} h-auto resize-y py-3`} />;
      return <input id={id} type={name === "birth_date" ? "date" : "text"} max={name === "birth_date" ? localToday() : undefined} required={required(name)} value={values[name] as string} onChange={(event) => onChange?.(name, name === "employee_code" ? event.target.value.toUpperCase() : event.target.value)} className={control} />;
    }}</FormRow>;
  };
  if (mode === "view") {
    const nameData = { prefix: visible("prefix") ? values.prefix : "", first_name: visible("first_name") ? values.first_name : "", last_name: visible("last_name") ? values.last_name : "" };
    const additionalHealth = healthFields.filter((key) => key !== "blood_group" && visible(key));
    return <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-3"><h3 className="font-bold text-heading">ข้อมูลพนักงาน</h3>{visible("status") && <span className={`rounded-full px-3 py-1 text-xs font-semibold ${values.status === "active" ? "bg-success-50 text-success-600" : "bg-slate-100 text-slate-500"}`}>{labelValue("status")}</span>}</div>
        {visible("photo") && values.photo_url && <div className="mb-6 max-w-48"><EmployeePhoto url={values.photo_url} /></div>}
        <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {viewItem("employee_code")}
          {(visible("first_name") || visible("last_name")) && <EmployeeInfoItem label="ชื่อ–นามสกุล" value={getEmployeeFullName(nameData)} icon={UserRound} />}
          {viewItem("department")}{viewItem("gender")}{viewItem("position")}{viewItem("blood_group")}{viewItem("company")}{viewItem("birth_date")}{viewItem("nationality")}
        </dl>
      </section>
      {additionalHealth.length > 0 && <FormSection title="ข้อมูลสุขภาพ" icon={<HeartPulse size={18} />}><dl className="grid gap-6 sm:grid-cols-2">{additionalHealth.map(viewItem)}</dl></FormSection>}
      {visible("note") && <FormSection title="หมายเหตุเพิ่มเติม" icon={<FileText size={18} />}><dl>{viewItem("note")}</dl></FormSection>}
    </div>;
  }
  return <div className="space-y-5">
    {personalFields.some(visible) && <FormSection title="ข้อมูลส่วนบุคคล" icon={<UserRound size={18} />} description="ข้อมูลประจำตัวของพนักงาน">{personalFields.filter(visible).map((key) => <div key={key}>{field(key)}{key === "birth_date" && <div className="mt-4"><FormRow label="อายุ">{(id) => <p id={id} className="py-2.5 text-sm">{age === "" ? "ไม่ระบุ" : `${age} ปี`}</p>}</FormRow></div>}</div>)}</FormSection>}
    {employmentFields.some(visible) && <FormSection title="ข้อมูลการทำงาน" icon={<BriefcaseBusiness size={18} />}>{employmentFields.map(field)}</FormSection>}
    {healthFields.some(visible) && <FormSection title="ข้อมูลสุขภาพ" icon={<HeartPulse size={18} />}>{healthFields.map(field)}</FormSection>}
    {visible("note") && <FormSection title="หมายเหตุเพิ่มเติม" icon={<FileText size={18} />}>{field("note")}</FormSection>}
  </div>;
}
export function EmployeeInfoItem({ label, value, icon: Icon = UserRound }: { label: string; value?: string; icon?: LucideIcon }) {
  return <div className="flex min-w-0 gap-3"><span className="mt-0.5 shrink-0 text-brand-600"><Icon size={20} /></span><div className="min-w-0"><dt className="text-xs text-muted">{label}</dt><dd className="mt-1.5 whitespace-pre-wrap break-words font-semibold text-heading">{value || "ไม่ระบุ"}</dd></div></div>;
}
function EmployeePhoto({ url }: { url: string }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  if (!url || failedUrl === url) return <div className="rounded-xl bg-slate-50 p-5 text-center text-sm text-muted"><UserRound className="mx-auto mb-2" size={32} />ไม่มีรูปพนักงาน</div>;
  return <img src={url} onError={() => setFailedUrl(url)} alt="รูปพนักงาน" className="max-h-64 w-full rounded-xl border border-border bg-slate-50 object-contain" />;
}
export function FormSection({ title, description, icon, children }: { title: string; description?: string; icon: ReactNode; children: ReactNode }) {
  const id = useId();
  return <section aria-labelledby={id} className="rounded-xl border border-slate-200 bg-white shadow-sm"><header className="flex items-center gap-3 rounded-t-xl border-b border-slate-200 bg-slate-50 px-5 py-4"><span className="text-brand-600">{icon}</span><div><h3 id={id} className="font-semibold text-heading">{title}</h3>{description && <p className="mt-0.5 text-xs text-muted">{description}</p>}</div></header><div className="space-y-4 px-4 py-5 sm:px-7">{children}</div></section>;
}
export function FormRow({ label, required, children }: { label: string; required?: boolean; children: (id: string) => ReactNode }) {
  const id = useId();
  return <div className="grid gap-2 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6"><label htmlFor={id} className="text-sm font-medium text-slate-600 sm:pt-2.5 sm:text-right">{label}{required && <span className="ml-1 text-red-500">*</span>}</label><div className="min-w-0 sm:max-w-md">{children(id)}</div></div>;
}
function LookupControl({ id, label, value, options, required, onChange }: { id: string; label: string; value: string; options: LookupOption[]; required: boolean; onChange: (value: string) => void }) {
  const listId = useId();
  const selected = options.find((item) => item.code === value);
  return <><input id={id} list={listId} required={required} autoComplete="off" value={value} onChange={(event) => onChange(event.target.value)} placeholder={`พิมพ์หรือเลือกรหัส${label}`} className={control} /><datalist id={listId}>{options.map((item) => <option key={item.code} value={item.code}>{item.code} - {item.name}</option>)}</datalist>{selected && <p className="mt-1 text-xs text-muted">{selected.name}</p>}</>;
}
