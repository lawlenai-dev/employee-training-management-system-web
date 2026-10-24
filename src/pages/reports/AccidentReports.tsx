import { Eye, Pencil, Plus, Search, X, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../auth/AuthContext";

type ReportForm = {
  occurredAt: string;
  incidentType: string;
  employeeCode: string;
  employeeName: string;
  company: string;
  location: string;
  severity: string;
  injury: string;
  description: string;
  immediateAction: string;
  correctiveAction: string;
  responsiblePerson: string;
  dueDate: string;
  status: string;
};
type Report = ReportForm & {
  id: string;
  reportNo: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
};
type Field = {
  name: keyof ReportForm;
  label: string;
  type: "text" | "number" | "date" | "datetime-local" | "textarea" | "select";
  required?: boolean;
  options?: string[];
};
const fields: Field[] = [
  {
    name: "occurredAt",
    label: "วันและเวลาเกิดเหตุ",
    type: "datetime-local",
    required: true,
  },
  {
    name: "incidentType",
    label: "ประเภทเหตุการณ์",
    type: "select",
    required: true,
    options: ["อุบัติเหตุ", "เหตุการณ์ผิดปกติ", "เหตุการณ์เกือบเกิดอุบัติเหตุ"],
  },
  {
    name: "employeeCode",
    label: "รหัสพนักงาน",
    type: "text",
    required: false,
  },
  {
    name: "employeeName",
    label: "ชื่อผู้เกี่ยวข้อง",
    type: "text",
    required: true,
  },
  {
    name: "company",
    label: "บริษัท",
    type: "text",
    required: true,
  },
  {
    name: "location",
    label: "สถานที่เกิดเหตุ",
    type: "text",
    required: true,
  },
  {
    name: "severity",
    label: "ระดับความรุนแรง",
    type: "select",
    required: true,
    options: ["เล็กน้อย", "ปานกลาง", "รุนแรง"],
  },
  {
    name: "injury",
    label: "รายละเอียดการบาดเจ็บ / ความเสียหาย",
    type: "textarea",
    required: false,
  },
  {
    name: "description",
    label: "รายละเอียดเหตุการณ์",
    type: "textarea",
    required: true,
  },
  {
    name: "immediateAction",
    label: "การช่วยเหลือ / ดำเนินการเบื้องต้น",
    type: "textarea",
    required: true,
  },
  {
    name: "correctiveAction",
    label: "แนวทางป้องกันและแก้ไข",
    type: "textarea",
    required: false,
  },
  {
    name: "responsiblePerson",
    label: "ผู้รับผิดชอบติดตาม",
    type: "text",
    required: true,
  },
  {
    name: "dueDate",
    label: "กำหนดติดตาม",
    type: "date",
    required: false,
  },
  {
    name: "status",
    label: "สถานะ",
    type: "select",
    required: true,
    options: ["รับแจ้ง", "อยู่ระหว่างตรวจสอบ", "ปิดเรื่อง"],
  },
];
const columns: (keyof ReportForm)[] = [
  "occurredAt",
  "incidentType",
  "employeeName",
  "company",
  "location",
  "severity",
  "status",
];
const STORAGE_KEY = "chk_reports_AccidentReports";
const DATE_FIELD: keyof ReportForm = "occurredAt";
const CATEGORY_FIELD: keyof ReportForm = "incidentType";
const PAGE_SIZE = 10;
const control =
  "mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-700";
const localDate = () => {
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return {
    date,
    dateTime: `${date}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
  };
};
function initialForm(): ReportForm {
  const now = localDate();
  return {
    occurredAt: now.dateTime,
    incidentType: "",
    employeeCode: "",
    employeeName: "",
    company: "",
    location: "",
    severity: "",
    injury: "",
    description: "",
    immediateAction: "",
    correctiveAction: "",
    responsiblePerson: "",
    dueDate: "",
    status: "รับแจ้ง",
  };
}
function readReports(): Report[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const value: unknown = JSON.parse(raw);
  if (
    !Array.isArray(value) ||
    !value.every(
      (row) =>
        row &&
        typeof row === "object" &&
        typeof row.id === "string" &&
        typeof row.reportNo === "string" &&
        fields.every((field) => typeof row[field.name] === "string"),
    )
  ) {
    throw new Error(
      "ข้อมูลรายงานที่บันทึกไว้ไม่ถูกต้อง กรุณาตรวจสอบก่อนบันทึกใหม่",
    );
  }
  return value as Report[];
}
function display(field: keyof ReportForm, value: string) {
  if (!value) return "—";
  const config = fields.find((item) => item.name === field);
  if (config?.type === "date" || config?.type === "datetime-local") {
    const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString(
          "th-TH",
          config.type === "date"
            ? { dateStyle: "medium" }
            : { dateStyle: "medium", timeStyle: "short" },
        );
  }
  return value;
}
function validate(form: ReportForm): string {
  for (const field of fields) {
    if (field.required && !form[field.name].trim())
      return `กรุณาระบุ${field.label}`;
  }
  if (form.dueDate && form.dueDate < form.occurredAt.slice(0, 10))
    return "กำหนดติดตามต้องไม่ก่อนวันเกิดเหตุ";
  return "";
}
export default function AccidentReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{
    mode: "create" | "view" | "edit";
    report?: Report;
  } | null>(null);
  useEffect(() => {
    try {
      setReports(readReports());
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "อ่านข้อมูลไม่สำเร็จ",
      );
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    setPage(1);
  }, [search, startDate, endDate, company, category, status]);
  const companies = [
    ...new Set(reports.map((report) => report.company)),
  ].sort();
  const filtered = useMemo(
    () =>
      reports.filter((report) => {
        const reportDate = report[DATE_FIELD].slice(0, 10);
        return (
          Object.values(report)
            .join(" ")
            .toLowerCase()
            .includes(search.trim().toLowerCase()) &&
          (!startDate || reportDate >= startDate) &&
          (!endDate || reportDate <= endDate) &&
          (!company || report.company === company) &&
          (!category || report[CATEGORY_FIELD] === category) &&
          (!status || report.status === status)
        );
      }),
    [reports, search, startDate, endDate, company, category, status],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const save = (form: ReportForm) => {
    const invalid = validate(form);
    if (invalid) throw new Error(invalid);
    const latest = readReports();
    const now = new Date().toISOString();
    const clean = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    ) as ReportForm;
    let next: Report[];
    if (modal?.mode === "edit" && modal.report) {
      const original = latest.find((item) => item.id === modal.report!.id);
      if (!original) throw new Error("ไม่พบรายงานที่ต้องการแก้ไข");
      if (
        (original.updatedAt ?? original.createdAt) !==
        (modal.report.updatedAt ?? modal.report.createdAt)
      )
        throw new Error(
          "รายงานถูกแก้ไขจากหน้าต่างอื่นแล้ว กรุณาเปิดหน้าใหม่ก่อนแก้ไข",
        );
      const updated = {
        ...original,
        ...clean,
        updatedAt: now,
        updatedBy: user?.name ?? "ไม่ระบุ",
      };
      next = latest.map((item) => (item.id === original.id ? updated : item));
    } else {
      const id =
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const suffix = id.replace(/-/g, "").slice(-8).toUpperCase();
      const row: Report = {
        ...clean,
        id,
        reportNo: `INC-${localDate().date.replace(/-/g, "")}-${suffix}`,
        createdAt: now,
        createdBy: user?.name ?? "ไม่ระบุ",
      };
      next = [row, ...latest];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setReports(next);
    setModal(null);
    setNotice("บันทึกรายงานเรียบร้อยแล้ว");
  };
  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <TriangleAlert size={25} />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                รายการอุบัติเหตุ/เหตุการณ์ผิดปกติ
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                บันทึกเหตุการณ์ การช่วยเหลือเบื้องต้น และติดตามการแก้ไข
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={!loaded || Boolean(loadError)}
            onClick={() => {
              setNotice("");
              setModal({ mode: "create" });
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus size={18} />
            บันทึกรายงาน
          </button>
        </header>
        {loadError && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {loadError}
          </p>
        )}
        {notice && (
          <p
            role="status"
            className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            {notice}
          </p>
        )}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              ค้นหา
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-5 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="เลขรายงาน รหัส ชื่อพนักงาน หรือรายละเอียด"
                  className={`${control} pl-10`}
                />
              </div>
            </label>
            <label className="text-sm font-medium text-slate-700">
              ตั้งแต่วันที่
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => setStartDate(event.target.value)}
                className={control}
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              ถึงวันที่
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => setEndDate(event.target.value)}
                className={control}
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              บริษัท
              <select
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                className={control}
              >
                <option value="">ทั้งหมด</option>
                {companies.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              {fields.find((field) => field.name === CATEGORY_FIELD)?.label}
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={control}
              >
                <option value="">ทั้งหมด</option>
                {fields
                  .find((field) => field.name === CATEGORY_FIELD)
                  ?.options?.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              สถานะ
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className={control}
              >
                <option value="">ทั้งหมด</option>
                {fields
                  .find((field) => field.name === "status")
                  ?.options?.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStartDate("");
                setEndDate("");
                setCompany("");
                setCategory("");
                setStatus("");
              }}
              className="self-end rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              ล้างตัวกรอง
            </button>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900">รายการรายงาน</h2>
            <p className="text-sm text-slate-500">
              พบ {filtered.length} / {reports.length} รายการ
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-3">เลขรายงาน</th>
                  {columns.map((name) => (
                    <th key={name} className="px-4 py-3">
                      {fields.find((field) => field.name === name)?.label}
                    </th>
                  ))}
                  <th className="px-4 py-3">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-semibold text-blue-600">
                      {report.reportNo}
                    </td>
                    {columns.map((name) => (
                      <td key={name} className="px-4 py-4">
                        {name === "status" ? (
                          <span className="inline-flex whitespace-nowrap rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                            {report[name]}
                          </span>
                        ) : (
                          display(name, report[name])
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          aria-label={`ดู ${report.reportNo}`}
                          title="ดูรายละเอียด"
                          onClick={() => setModal({ mode: "view", report })}
                          className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          type="button"
                          aria-label={`แก้ไข ${report.reportNo}`}
                          title="แก้ไขรายงาน"
                          onClick={() => setModal({ mode: "edit", report })}
                          className="rounded-lg bg-amber-50 p-2 text-amber-700"
                        >
                          <Pencil size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td
                      colSpan={columns.length + 2}
                      className="p-12 text-center text-slate-500"
                    >
                      {!loaded
                        ? "กำลังโหลด..."
                        : reports.length
                          ? "ไม่พบข้อมูลตามตัวกรอง"
                          : "ยังไม่มีรายงาน กดบันทึกรายงานเพื่อเพิ่มรายการแรก"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <footer className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-sm">
            <p className="text-slate-500">
              หน้า {currentPage} / {pages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
                className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40"
              >
                ก่อนหน้า
              </button>
              <button
                type="button"
                disabled={currentPage >= pages}
                onClick={() => setPage(currentPage + 1)}
                className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40"
              >
                ถัดไป
              </button>
            </div>
          </footer>
        </div>
      </div>
      {modal && (
        <ReportModal
          key={modal.report?.id ?? "new"}
          mode={modal.mode}
          report={modal.report}
          actor={user?.name ?? ""}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </section>
  );
}
function ReportModal({
  mode,
  report,
  actor,
  onClose,
  onSave,
}: {
  mode: "create" | "view" | "edit";
  report?: Report;
  actor: string;
  onClose: () => void;
  onSave: (form: ReportForm) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState<ReportForm>(() => {
    const initial = report
      ? (Object.fromEntries(
          fields.map((field) => [field.name, report[field.name]]),
        ) as ReportForm)
      : initialForm();
    if (!report) initial.responsiblePerson = actor;
    return initial;
  });
  const [error, setError] = useState("");
  const busy = useRef(false);
  const view = mode === "view";
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previous;
    };
  }, []);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (view || busy.current) return;
    busy.current = true;
    setError("");
    try {
      onSave(form);
    } catch (error) {
      setError(error instanceof Error ? error.message : "บันทึกไม่สำเร็จ");
    } finally {
      busy.current = false;
    }
  };
  return (
    <dialog
      ref={ref}
      aria-labelledby="report-modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto rounded-3xl border-0 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm"
    >
      <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
        <div>
          <p className="text-xs font-semibold text-blue-600">
            {report?.reportNo ?? "รายงานใหม่"}
          </p>
          <h2 id="report-modal-title" className="mt-1 text-lg font-bold">
            {view ? "รายละเอียด" : mode === "edit" ? "แก้ไข" : "บันทึก"} ·
            รายการอุบัติเหตุ/เหตุการณ์ผิดปกติ
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="ปิดหน้าต่าง"
          className="rounded-full bg-slate-100 p-2"
        >
          <X size={20} />
        </button>
      </header>
      <form onSubmit={submit}>
        <fieldset
          disabled={view}
          className="grid gap-5 p-5 sm:p-6 md:grid-cols-2"
        >
          {fields.map((field, index) => (
            <label
              key={field.name}
              className={`text-sm font-medium text-slate-700 ${field.type === "textarea" ? "md:col-span-2" : ""}`}
            >
              {field.label}
              {field.required && <span className="ml-1 text-red-500">*</span>}
              {field.type === "textarea" ? (
                <textarea
                  rows={3}
                  required={field.required}
                  value={form[field.name]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                  className={`${control} resize-y`}
                />
              ) : field.type === "select" ? (
                <select
                  required={field.required}
                  value={form[field.name]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                  className={control}
                >
                  <option value="">เลือก{field.label}</option>
                  {field.options?.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  autoFocus={index === 0}
                  type={field.type}
                  required={field.required}
                  min={field.type === "number" ? 0 : undefined}
                  step={field.type === "number" ? "any" : undefined}
                  value={form[field.name]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                  className={control}
                />
              )}
            </label>
          ))}
        </fieldset>
        {report && (
          <div className="mx-5 mb-5 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
            <p>
              บันทึกโดย {report.createdBy} ·{" "}
              {new Date(report.createdAt).toLocaleString("th-TH")}
            </p>
            {report.updatedAt && (
              <p className="mt-1">
                แก้ไขล่าสุดโดย {report.updatedBy} ·{" "}
                {new Date(report.updatedAt).toLocaleString("th-TH")}
              </p>
            )}
          </div>
        )}
        {error && (
          <p
            role="alert"
            className="mx-5 mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        <footer className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          >
            {view ? "ปิด" : "ยกเลิก"}
          </button>
          {!view && (
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              บันทึกรายงาน
            </button>
          )}
        </footer>
      </form>
    </dialog>
  );
}
