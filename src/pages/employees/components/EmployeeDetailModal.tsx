import {
  Award,
  VenusAndMars,
  BookOpenCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  IdCard,
  MapPin,
  UserRound,
  X,
  IvBag,
} from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { EmployeeDetail } from "../../../data";

export type TrainingResult = "passed" | "failed" | "pending";

export type EmployeeTrainingHistory = {
  id: string | number;
  employee_code: string;
  course_code: string;
  course_name: string;
  training_date: string;
  duration_hours: number;
  location: string;
  trainer: string;
  result: TrainingResult;
  certificate_no?: string;
};

type EmployeeDetailModalProps = {
  open: boolean;
  employee: EmployeeDetail ;
  histories: EmployeeTrainingHistory[];
  onClose: () => void;
};

const resultStyles: Record<
  TrainingResult,
  { label: string; className: string }
> = {
  passed: {
    label: "ผ่าน",
    className: "bg-success-50 text-success-600",
  },
  failed: {
    label: "ไม่ผ่าน",
    className: "bg-danger-50 text-danger-600",
  },
  pending: {
    label: "รอผล",
    className: "bg-amber-50 text-amber-700",
  },
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

export default function EmployeeDetailModal({
  open,
  employee,
  histories,
  onClose,
}: EmployeeDetailModalProps) {
  console.log("Employee:", employee);
  console.log("Birth date:", employee?.birth_date);
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  if (!open || !employee) return null;

  const fullName =
    ` ${employee.prefix ?? ""} ${employee.first_name ?? ""} ${employee.last_name ?? ""}`.trim() ||
    "ไม่ระบุชื่อ";

  const isActive = Number(employee.is_active) === 1;
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };
  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/65 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-detail-title"
        className="max-h-[94vh] w-full overflow-y-auto rounded-t-3xl bg-slate-50 shadow-2xl sm:max-w-5xl sm:rounded-3xl"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-white px-5 py-5 sm:px-7">
          <div className="flex min-w-0 items-center gap-4">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 sm:flex">
              <UserRound size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
                Employee Profile
              </p>
              <h2
                id="employee-detail-title"
                className="mt-1 truncate text-xl font-bold text-heading sm:text-2xl"
              >
                {fullName}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            className="shrink-0 rounded-full bg-slate-100 p-2.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
          >
            <X size={20} />
          </button>
        </header>

        <div className="space-y-6 p-5 sm:p-7">
          {/* <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]"> */}
          <div className="grid gap-4 lg:grid-cols-1">
            <div className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-heading">ข้อมูลพนักงาน</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isActive
                      ? "bg-success-50 text-success-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {isActive ? "ใช้งาน" : "ปิดใช้งาน"}
                </span>
              </div>

              <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                <InfoItem
                  icon={<IdCard size={18} />}
                  label="รหัสพนักงาน"
                  value={employee.employee_code}
                />
                <InfoItem
                  icon={<UserRound size={18} />}
                  label="ชื่อ–นามสกุล"
                  value={fullName}
                />
                <InfoItem
                  icon={<Building2 size={18} />}
                  label="แผนก"
                  value={employee.department || "ไม่ระบุ"}
                />
                <InfoItem
                  icon={<VenusAndMars size={18} />}
                  label="เพศ"
                  value={employee.gender || "ไม่ระบุ"}
                />
                <InfoItem
                  icon={<Award size={18} />}
                  label="ตำแหน่ง"
                  value={employee.position || "ไม่ระบุ"}
                />
                <InfoItem
                  icon={<IvBag size={18} />}
                  label="กรุ๊ปเลือด"
                  value={employee.blood_group || "ไม่ระบุ"}
                />
                {employee.supplier_name && (
                  <InfoItem
                    icon={<Building2 size={18} />}
                    label="บริษัท Supplier"
                    value={employee.supplier_name}
                  />
                )}
                <InfoItem
                  icon={<CalendarDays size={18} />}
                  label="วันเกิด"
                  value={
                    employee.birth_date
                      ? `${employee.birth_date} (${calculateAge(employee.birth_date)} ปี)`
                      : "ไม่ระบุ"
                  }
                />
              </dl>
            </div>

            {/* <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
              <SummaryCard
                label="หลักสูตรทั้งหมด"
                value={`${histories.length}`}
                suffix="หลักสูตร"
              />
              <SummaryCard
                label="ผ่านการอบรม"
                value={`${passedCount}`}
                suffix="หลักสูตร"
              />
              <SummaryCard
                label="ชั่วโมงอบรม"
                value={`${totalHours}`}
                suffix="ชั่วโมง"
              />
            </div> */}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-white">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <BookOpenCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-heading">
                  ประวัติ Course Training
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  รายการหลักสูตรที่พนักงานเคยเข้าร่วม
                </p>
              </div>
            </div>

            {histories.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <BookOpenCheck className="mx-auto text-slate-300" size={36} />
                <p className="mt-3 font-semibold text-heading">
                  ยังไม่มีประวัติการอบรม
                </p>
                <p className="mt-1 text-sm text-muted">
                  ประวัติจะปรากฏเมื่อพนักงานเข้าร่วมหลักสูตร
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase text-muted">
                    <tr>
                      <th className="px-5 py-3">หลักสูตร</th>
                      <th className="px-5 py-3">วันที่ / เวลา</th>
                      <th className="px-5 py-3">สถานที่ / วิทยากร</th>
                      <th className="px-5 py-3">ผลการอบรม</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {histories.map((history) => {
                      const result = resultStyles[history.result];

                      return (
                        <tr key={history.id} className="align-top">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-heading">
                              {history.course_name}
                            </p>
                            <p className="mt-1 font-mono text-xs text-brand-600">
                              {history.course_code}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-body">
                            <p className="flex items-center gap-2">
                              <CalendarDays
                                size={15}
                                className="text-slate-400"
                              />
                              {formatDate(history.training_date)}
                            </p>
                            <p className="mt-2 flex items-center gap-2 text-xs text-muted">
                              <Clock3 size={14} />
                              {history.duration_hours} ชั่วโมง
                            </p>
                          </td>
                          <td className="px-5 py-4 text-body">
                            <p className="flex items-center gap-2">
                              <MapPin size={15} className="text-slate-400" />
                              {history.location}
                            </p>
                            <p className="mt-2 text-xs text-muted">
                              วิทยากร: {history.trainer}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${result.className}`}
                            >
                              {history.result === "passed" && (
                                <CheckCircle2 size={14} />
                              )}
                              {result.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <footer className="sticky bottom-0 flex justify-end border-t border-border bg-white px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-control border border-border bg-white px-5 py-2.5 text-sm font-semibold text-body transition hover:bg-slate-50"
          >
            ปิด
          </button>
        </footer>
      </section>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-brand-500">{icon}</span>
      <div>
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="mt-1 font-semibold text-heading">{value}</dd>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 lg:flex lg:items-center lg:justify-between">
      <p className="text-xs text-muted sm:text-sm">{label}</p>
      <p className="mt-2 font-bold text-brand-600 lg:mt-0 lg:text-xl">
        {value} <span className="text-xs font-medium text-muted">{suffix}</span>
      </p>
    </div>
  );
}
