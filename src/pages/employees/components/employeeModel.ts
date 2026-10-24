import type { ReactNode } from "react";

export type EmployeeStatus = "active" | "resigned" | "canceled" | "inactive" | "blacklist";

export type EmployeeForm = {
  employee_code: string;
  prefix: string;
  first_name: string;
  last_name: string;
  department: string;
  position: string;
  birth_date: string;
  nationality: string;
  company: string;
  gender: string;
  note: string;
  photo: File | null;
  photo_url: string;
  status: EmployeeStatus;
  blood_group: string;
  chronic_disease: string;
  drug_allergy: string;
  food_allergy: string;
  work_restrictions: string;
  health_note: string;
};

export type EmployeeFormSubmission = EmployeeForm & {
  calculated_age: number | "";
};

export type LookupOption = {
  code: string;
  name: string;
};

export type SelectOption = {
  value: string;
  label: string;
};

export type EmployeeModalMode = "create" | "edit" | "view";
export type EmployeeField = Exclude<keyof EmployeeForm, "photo_url">;
export type EmployeeFieldRule = {
  visible: readonly EmployeeModalMode[];
  required: readonly EmployeeModalMode[];
  editable: readonly EmployeeModalMode[];
};
export type EmployeeUpdateSubmission = Partial<EmployeeForm>;

export type EmployeeModalProps = {
  open: boolean;
  mode?: EmployeeModalMode;
  title?: string;
  description?: string;
  submitLabel?: string;
  initialData?: Partial<EmployeeForm> | null;
  recordKey?: string | number;
  fieldRules?: Partial<Record<EmployeeField, Partial<EmployeeFieldRule>>>;
  departments?: LookupOption[];
  positions?: LookupOption[];
  nationalities?: LookupOption[];
  companies?: LookupOption[];
  saving?: boolean;
  error?: string;
  children?: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  /** Create: full form for compatibility with existing create handlers. */
  onSubmit?: (form: EmployeeFormSubmission) => void | Promise<void>;
  /** Edit: changed editable fields only. Parent supplies employee ID. */
  onUpdate?: (changes: EmployeeUpdateSubmission) => void | Promise<void>;
};

export const EMPTY_FORM: EmployeeForm = {
  employee_code: "",
  prefix: "",
  first_name: "",
  last_name: "",
  department: "",
  position: "",
  birth_date: "",
  nationality: "",
  company: "",
  gender: "",
  note: "",
  photo: null,
  photo_url: "",
  status: "active",
  blood_group: "",
  chronic_disease: "",
  drug_allergy: "",
  food_allergy: "",
  work_restrictions: "",
  health_note: "",
};

export const prefixOptions = [
  { value: "mr", label: "นาย" },
  { value: "mrs", label: "นาง" },
  { value: "miss", label: "นางสาว" },
];

export const statusOptions = [
  { value: "active", label: "ใช้งาน" },
  { value: "resigned", label: "ลาออก" },
  { value: "canceled", label: "ยกเลิก" },
  { value: "inactive", label: "ปิดใช้งาน" },
  { value: "blacklist", label: "บัญชีดำ" },
];

export const genderOptions = [
  { value: "male", label: "ชาย" },
  { value: "female", label: "หญิง" },
  { value: "other", label: "อื่น ๆ" },
];

export function calculateAge(birthDate: string): number | "" {
  if (!birthDate) {
    return "";
  }

  const birth = new Date(birthDate);
  const today = new Date();

  if (Number.isNaN(birth.getTime()) || birth > today) {
    return "";
  }

  let age = today.getFullYear() - birth.getFullYear();

  const hasNotHadBirthday =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() < birth.getDate());

  if (hasNotHadBirthday) {
    age -= 1;
  }

  return age;
}

// Change these defaults, or override an individual field through the fieldRules prop.
const ALL: readonly EmployeeModalMode[] = ["create", "edit", "view"];
const WRITE: readonly EmployeeModalMode[] = ["create", "edit"];
const optional: EmployeeFieldRule = {
  visible: ALL,
  required: [],
  editable: WRITE,
};
const mandatory: EmployeeFieldRule = {
  visible: ALL,
  required: WRITE,
  editable: WRITE,
};
const health: EmployeeFieldRule = {
  visible: ["edit", "view"],
  required: [],
  editable: ["edit"],
};
export const FIELD_RULES: Record<EmployeeField, EmployeeFieldRule> = {
  employee_code: { visible: ALL, required: [], editable: [] },
  prefix: mandatory,
  first_name: mandatory,
  last_name: mandatory,
  birth_date: optional,
  nationality: optional,
  gender: optional,
  photo: optional,
  company: optional,
  department: mandatory,
  position: mandatory,
  status: mandatory,
  blood_group: health,
  chronic_disease: health,
  drug_allergy: health,
  food_allergy: health,
  work_restrictions: health,
  health_note: health,
  note: optional,
};
export const fieldLabels: Record<EmployeeField, string> = {
  employee_code: "รหัสพนักงาน",
  prefix: "คำนำหน้าชื่อ",
  first_name: "ชื่อ",
  last_name: "นามสกุล",
  birth_date: "วันเกิด",
  nationality: "สัญชาติ",
  gender: "เพศ",
  photo: "รูปพนักงาน",
  company: "บริษัท",
  department: "แผนก",
  position: "ตำแหน่ง",
  status: "สถานะ",
  blood_group: "กรุ๊ปเลือด",
  chronic_disease: "โรคประจำตัว",
  drug_allergy: "ประวัติแพ้ยา",
  food_allergy: "ประวัติแพ้อาหาร",
  work_restrictions: "ข้อจำกัดในการทำงาน",
  health_note: "หมายเหตุสุขภาพ",
  note: "หมายเหตุ",
};
export const bloodOptions = ["A", "B", "AB", "O"].map((value) => ({
  value,
  label: value,
}));
export const selectOptions: Partial<Record<EmployeeField, SelectOption[]>> = {
  prefix: prefixOptions,
  status: statusOptions,
  gender: genderOptions,
  blood_group: bloodOptions,
};
export const personalFields: EmployeeField[] = [
  "prefix",
  "first_name",
  "last_name",
  "birth_date",
  "gender",
  "nationality",
  "photo",
];
export const employmentFields: EmployeeField[] = [
  "employee_code",
  "company",
  "department",
  "position",
  "status",
];
export const healthFields: EmployeeField[] = [
  "blood_group",
  "chronic_disease",
  "drug_allergy",
  "food_allergy",
  "work_restrictions",
  "health_note",
];
export const multiline = new Set<EmployeeField>([
  "chronic_disease",
  "drug_allergy",
  "food_allergy",
  "work_restrictions",
  "health_note",
  "note",
]);
export function normalizeEmployee(data?: Partial<EmployeeForm> | null): EmployeeForm {
  const result = { ...EMPTY_FORM };
  for (const key of Object.keys(EMPTY_FORM) as (keyof EmployeeForm)[]) {
    if (key === "photo") continue;
    const value = data?.[key];
    if (typeof value === "string") Object.assign(result, { [key]: value });
  }
  result.birth_date = result.birth_date.slice(0, 10);
  return result;
}
export function resolvedRule(
  field: EmployeeField,
  overrides?: EmployeeModalProps["fieldRules"],
): EmployeeFieldRule {
  return { ...FIELD_RULES[field], ...overrides?.[field] };
}
export function canEdit(
  field: EmployeeField,
  mode: EmployeeModalMode,
  overrides?: EmployeeModalProps["fieldRules"],
) {
  const rule = resolvedRule(field, overrides);
  return (
    mode !== "view" &&
    rule.visible.includes(mode) &&
    rule.editable.includes(mode)
  );
}
export function buildEmployeeChanges(
  form: EmployeeForm,
  original: EmployeeForm,
  overrides?: EmployeeModalProps["fieldRules"],
): EmployeeUpdateSubmission {
  const changes: EmployeeUpdateSubmission = {};
  for (const key of Object.keys(FIELD_RULES) as EmployeeField[]) {
    if (key === "photo" || !canEdit(key, "edit", overrides)) continue;
    if (form[key] !== original[key])
      Object.assign(changes, { [key]: form[key] });
  }
  if (canEdit("photo", "edit", overrides)) {
    if (form.photo !== original.photo) changes.photo = form.photo;
    if (form.photo_url !== original.photo_url)
      changes.photo_url = form.photo_url;
  }
  return changes;
}
export const localToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};


/** Map API/demo/request shapes to the shared form. No persistence is performed here. */
export function toEmployeeForm(source?: object | null): EmployeeForm {
  const record = (source ?? {}) as Record<string, unknown>;
  const values = normalizeEmployee(record as Partial<EmployeeForm>);
  const text = (key: string) => typeof record[key] === "string" ? record[key] as string : "";
  values.company = text("company") || text("supplier_name") || text("supplierName");
  const rawStatus = text("status");
  const aliases: Record<string, EmployeeStatus> = { resign: "resigned", cancel: "canceled" };
  if (rawStatus && statusOptions.some((item) => item.value === (aliases[rawStatus] ?? rawStatus))) {
    values.status = (aliases[rawStatus] ?? rawStatus) as EmployeeStatus;
  } else if (record.is_active !== undefined || record.active !== undefined) {
    values.status = [true, 1, "1", "true", "active"].includes((record.is_active ?? record.active) as string | number | boolean) ? "active" : "inactive";
  }
  return values;
}
export function getEmployeeFullName(data: Partial<EmployeeForm>): string {
  const prefix = prefixOptions.find((item) => item.value === data.prefix)?.label ?? data.prefix ?? "";
  return [prefix, data.first_name, data.last_name].filter(Boolean).join(" ").trim() || "ไม่ระบุชื่อ";
}
