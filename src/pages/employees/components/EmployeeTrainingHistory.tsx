import { BookOpenCheck, CalendarDays, CheckCircle2, Clock3, MapPin } from "lucide-react";
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

const formatDate = (value: string) => {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "ไม่ระบุ" : date.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
};

export default function EmployeeTrainingHistoryPanel({ histories }: { histories: EmployeeTrainingHistory[] }) {
  return (
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
  );
}
