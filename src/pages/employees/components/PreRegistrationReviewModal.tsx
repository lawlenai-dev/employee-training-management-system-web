import { Check, ClipboardCheck, History, UserRound, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "../../../components/Ui";
import { getRequestHistory } from "../../../auth/PreRegistrationContext";
import type { PreRegistration, PreRegistrationLog, PreRegistrationInput } from "../../../auth/PreRegistrationContext";
import EmployeeModal from "./EmployeeModal";
import { getEmployeeFullName, toEmployeeForm } from "./employeeModel";
type Props = { request: PreRegistration; histories?: PreRegistrationLog[]; canReview?: boolean; onClose: () => void; onApprove: (id: string) => unknown; onReject: (id: string, reason: string) => unknown };
const statuses = {
  pending: { label: "รอตรวจสอบ", style: "bg-amber-50 text-amber-700" },
  approved: { label: "อนุมัติแล้ว", style: "bg-success-50 text-success-600" },
  rejected: { label: "ไม่อนุมัติ", style: "bg-danger-50 text-danger-600" },
};
const actions = {
  register: "ส่งคำขอลงทะเบียนพนักงานใหม่",
  update: "ส่งคำขอ / แก้ไขข้อมูลพนักงาน",
  approved: "อนุมัติคำขอ",
  rejected: "ไม่อนุมัติคำขอ",
};
const fields: Partial<Record<keyof PreRegistrationInput, string>> = {
  employee_code: "รหัสพนักงาน",
  prefix: "คำนำหน้า",
  first_name: "ชื่อ",
  last_name: "นามสกุล",
  department: "แผนก",
  position: "ตำแหน่ง",
  birth_date: "วันเกิด",
  nationality: "สัญชาติ",
  company: "บริษัท",
  gender: "เพศ",
  note: "หมายเหตุ",
  photo_url: "รูปพนักงาน",
  status: "สถานะพนักงาน",
  blood_group: "กรุ๊ปเลือด",
  active: "การใช้งาน",
  requestType: "ประเภทคำขอ",
};
function date(value?: string, time = true) {
  if (!value) return "ไม่ระบุ";
  const parsed = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(parsed.getTime())) return "ไม่ระบุ";
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(time ? ({ hour: "2-digit", minute: "2-digit" } as const) : {}),
  }).format(parsed);
}
const display = (value: unknown) =>
  value === undefined || value === null || value === ""
    ? "ไม่ระบุ"
    : String(value);

export default function PreRegistrationReviewModal({
  request,
  histories,
  canReview = false,
  onClose,
  onApprove,
  onReject,
}: Props) {
  const titleId = useId();
  const reasonId = useId();
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false);
  const type =
    request.requestType ??
    (request.employee_code?.trim() ? "update" : "register");
  const employeeValues = toEmployeeForm(request);
  if (type === "register") employeeValues.employee_code = "";
  const fullName = getEmployeeFullName(employeeValues);
  const status = statuses[request.requestStatus];
  const logs = Array.from(
    new Map(
      (histories ?? getRequestHistory(request)).map((log) => [log.id, log]),
    ).values(),
  ).sort((a, b) => a.at.localeCompare(b.at));
  const mayReview = canReview && request.requestStatus === "pending";
  const submit = async () => {
    if (busy.current || !mayReview || !decision) return;
    if (decision === "reject" && !reason.trim()) {
      setError("กรุณาระบุเหตุผลที่ไม่อนุมัติ");
      return;
    }
    busy.current = true;
    setSubmitting(true);
    setError("");
    try {
      if (decision === "reject") await onReject(request.id, reason.trim());
      else await onApprove(request.id);
      setDecision(null);
      setReason("");
    } catch {
      setError("บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง");
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  };
  return <EmployeeModal open mode="view" initialData={employeeValues} recordKey={request.id}
    title={fullName} description={`${request.id} · ${type === "register" ? "ลงทะเบียนพนักงานใหม่" : "คำขอแก้ไขข้อมูลพนักงาน"}`}
    saving={submitting} onClose={onClose}
    footer={<>
        <button
          type="button"
          disabled={submitting}
          onClick={onClose}
          className="rounded-control border border-border px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          ปิด
        </button>
        {mayReview &&
          (decision ? (
            <>
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  setDecision(null);
                  setError("");
                }}
                className="px-4 py-2 text-sm"
              >
                ยกเลิก
              </button>
              <Button
                type="submit"
                form={`${titleId}-decision`}
                disabled={submitting}
                {...(decision === "reject"
                  ? { variant: "danger" as const }
                  : {})}
              >
                {submitting
                  ? "กำลังบันทึก..."
                  : decision === "reject"
                    ? "ยืนยันไม่อนุมัติ"
                    : "ยืนยันอนุมัติ"}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="danger"
                onClick={() => setDecision("reject")}
              >
                <X size={16} />
                ไม่อนุมัติ
              </Button>
              <Button type="button" onClick={() => setDecision("approve")}>
                <Check size={16} />
                อนุมัติ
              </Button>
            </>
          ))}
    </>}>
    <div className="mt-5 space-y-5">
      <p className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${status.style}`}>{status.label}</p>
        <section className="rounded-2xl border border-border bg-white p-5">
          <h3 className="flex items-center gap-2 font-bold text-heading">
            <ClipboardCheck size={20} className="text-brand-600" />
            ข้อมูลคำขอ
          </h3>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <Info label="วันที่ส่งคำขอ" value={date(request.submittedAt)} />
            <Info label="ผู้ส่งคำขอ" value={request.submittedBy} />
            <Info
              label="วันที่ตรวจสอบ"
              value={
                request.reviewedAt ? date(request.reviewedAt) : "ยังไม่ตรวจสอบ"
              }
            />
            <Info label="ผู้ตรวจสอบ" value={request.reviewedBy} />
          </dl>
          {request.rejectionReason && (
            <p className="mt-4 whitespace-pre-wrap rounded-xl bg-danger-50 p-4 text-sm text-danger-600">
              เหตุผลที่ไม่อนุมัติ: {request.rejectionReason}
            </p>
          )}
        </section>
        <section className="overflow-hidden rounded-2xl border border-border bg-white">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <History size={20} />
            </div>
            <div>
              <h3 className="font-bold text-heading">ประวัติการดำเนินการ</h3>
              <p className="mt-0.5 text-xs text-muted">
                ประวัติคำขอที่บันทึกไว้ในระบบ
              </p>
            </div>
          </div>
          <ol className="divide-y divide-border px-5">
            {logs.map((log) => (
              <li key={log.id} className="py-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-semibold text-heading">
                    {actions[log.action]}
                  </p>
                  <time dateTime={log.at} className="text-xs text-muted">
                    {date(log.at)}
                  </time>
                </div>
                <p className="mt-1 text-xs text-muted">
                  ผู้ดำเนินการ: {log.by || "ไม่ได้บันทึก"}
                </p>
                {log.note && (
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm">
                    {log.note}
                  </p>
                )}
                {Boolean(log.changes?.length) && (
                  <div className="mt-3 overflow-x-auto rounded-xl border border-border">
                    <table className="w-full min-w-[420px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs text-muted">
                        <tr>
                          <th className="px-3 py-2">ข้อมูล</th>
                          <th className="px-3 py-2">ค่าเดิม</th>
                          <th className="px-3 py-2">ค่าใหม่</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {log.changes?.map((change) => (
                          <tr key={change.field}>
                            <td className="px-3 py-2">
                              {fields[change.field] ?? change.field}
                            </td>
                            <td className="max-w-64 whitespace-pre-wrap break-words px-3 py-2 text-muted">
                              {change.field === "photo_url"
                                ? change.before
                                  ? "มีรูปพนักงาน"
                                  : "ไม่มีรูป"
                                : display(change.before)}
                            </td>
                            <td className="max-w-64 whitespace-pre-wrap break-words px-3 py-2 font-medium text-heading">
                              {change.field === "photo_url"
                                ? change.after
                                  ? "มีรูปพนักงาน"
                                  : "ไม่มีรูป"
                                : display(change.after)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>
        {mayReview && decision && (
          <form
            id={`${titleId}-decision`}
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
            className="rounded-2xl border border-border bg-white p-5"
          >
            <h3 className="font-bold text-heading">
              {decision === "approve"
                ? "ยืนยันอนุมัติคำขอนี้?"
                : "ระบุเหตุผลที่ไม่อนุมัติ"}
            </h3>
            {decision === "reject" && (
              <>
                <label htmlFor={reasonId} className="mt-3 block text-sm">
                  เหตุผล <span className="text-danger-600">*</span>
                </label>
                <textarea
                  id={reasonId}
                  required
                  autoFocus
                  value={reason}
                  disabled={submitting}
                  onChange={(event) => {
                    setReason(event.target.value);
                    setError("");
                  }}
                  rows={3}
                  className="mt-2 w-full rounded-control border border-border p-3"
                />
              </>
            )}
            {error && (
              <p role="alert" className="mt-3 text-sm text-danger-600">
                {error}
              </p>
            )}
          </form>
        )}    </div>
  </EmployeeModal>;
}

function Info({
  icon = <UserRound size={18} />,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 shrink-0 text-brand-500">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="mt-1 break-words font-semibold text-heading">
          {value || "ไม่ระบุ"}
        </dd>
      </div>
    </div>
  );
}
