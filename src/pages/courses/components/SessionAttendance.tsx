import { ArrowLeft, Check, Clock3, History, LogIn, LogOut, Search, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { employeesMockup } from "../../data";
import { useAuth } from "../../auth/AuthContext";
import { usePreRegistrations } from "../../auth/PreRegistrationContext";
import { Button, Card } from "../../components/Ui";
import { closeTrainingSession, getSessionRecord, getTrainingSession, saveSessionRecord } from "./components/trainingSessions";
import type { SessionEmployee, SessionRecord, TrainingSession } from "./components/trainingSessions";

const isActive = (value: unknown) => [true, 1, "1", "true", "active"].includes(value as string | number | boolean);
const employeeName = (employee: SessionEmployee) => employee.full_name || [employee.first_name, employee.last_name].filter(Boolean).join(" ") || employee.employee_code;
const formatDate = (value?: string) => {
  if (!value) return "—";
  const parsed = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(parsed.getTime()) ? "—" : parsed.toLocaleString("th-TH", value.length === 10 ? { dateStyle: "medium" } : { dateStyle: "medium", timeStyle: "short" });
};
const empty: SessionRecord = { attendees: [], logs: [] };
const resultLabels = { pending: "รอผล", passed: "ผ่าน", failed: "ไม่ผ่าน" };
export default function SessionAttendance() {
  const { courseId, sessionId } = useParams<{ courseId: string; sessionId: string }>();
  const { user } = useAuth();
  const { requests } = usePreRegistrations();
  const [session, setSession] = useState<TrainingSession | null>(null);
  const [record, setRecord] = useState<SessionRecord>(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<"attendance" | "results" | "info" | "history">("attendance");
  const [query, setQuery] = useState("");
  const [tableSearch, setTableSearch] = useState("");
  const [scanMode, setScanMode] = useState<"in" | "out">("in");
  const [filter, setFilter] = useState("all");
  const [confirmClose, setConfirmClose] = useState(false);
  const scanRef = useRef<HTMLInputElement>(null);
  const recordRef = useRef(record);
  useEffect(() => {
    setLoading(true); setError(""); setNotice(""); setConfirmClose(false); setTab("attendance"); setQuery(""); setTableSearch("");
    try {
      const found = sessionId ? getTrainingSession(sessionId) : undefined;
      if (!found || found.course_id !== courseId) throw new Error("ไม่พบรอบอบรมของหลักสูตรนี้");
      const saved = getSessionRecord(found.id);
      setSession(found); setRecord(saved); recordRef.current = saved;
    } catch (error) { setSession(null); setError(error instanceof Error ? error.message : "ไม่สามารถโหลดข้อมูลได้"); }
    finally { setLoading(false); }
  }, [courseId, sessionId]);
  const employees = useMemo(() => {
    const map = new Map<string, SessionEmployee>();
    (employeesMockup as SessionEmployee[]).forEach((employee) => map.set(employee.employee_code, employee));
    requests.filter((request) => request.requestStatus === "approved" && request.employee_code?.trim())
      .sort((a, b) => (a.reviewedAt ?? a.submittedAt).localeCompare(b.reviewedAt ?? b.submittedAt))
      .forEach((request) => {
        const code = request.employee_code!.trim();
        const previous = map.get(code);
        map.set(code, { ...previous, id: previous?.id ?? request.id, employee_code: code,
          first_name: request.first_name, last_name: request.last_name,
          full_name: [request.prefix, request.first_name, request.last_name].filter(Boolean).join(" "),
          department: request.department, position: request.position, supplier_name: request.supplierName,
          is_active: request.status === "active" && isActive(request.active), qr_token: previous?.qr_token });
      });
    return [...map.values()].filter((employee) => isActive(employee.is_active));
  }, [requests]);
  const matches = query.trim() ? employees.filter((employee) => `${employee.employee_code} ${employeeName(employee)} ${employee.supplier_name ?? ""}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 8) : [];
  const open = session?.status === "OPEN";
  const present = record.attendees.filter((item) => item.checked_in_at).length;
  const departed = record.attendees.filter((item) => item.checked_out_at).length;
  const rows = record.attendees.filter((item) => {
    const text = `${item.employee.employee_code} ${employeeName(item.employee)} ${item.employee.supplier_name ?? ""}`.toLowerCase();
    return text.includes(tableSearch.toLowerCase()) && (filter === "all" || (filter === "waiting" ? !item.checked_in_at : filter === "in" ? Boolean(item.checked_in_at && !item.checked_out_at) : Boolean(item.checked_out_at)));
  });
  const persist = (next: SessionRecord, message: string) => {
    if (!session || !open) { setError("รอบอบรมนี้ปิดแล้ว"); return false; }
    try {
      // Read before every mutation so rapid scans use the latest saved record.
      next = { ...next, logs: [...next.logs, { id: `${Date.now()}-${Math.random()}`, at: new Date().toISOString(), by: user?.name ?? "ไม่ระบุผู้ดำเนินการ", message }] };
      saveSessionRecord(session.id, next);
      recordRef.current = next; setRecord(next); setError(""); setNotice(`บันทึกแล้ว · ${message}`); return true;
    } catch (error) { setError(error instanceof Error ? error.message : "บันทึกไม่สำเร็จ"); return false; }
  };
  const latest = () => {
    if (!session) return recordRef.current;
    try { return getSessionRecord(session.id); } catch { return recordRef.current; }
  };
  const act = (employee: SessionEmployee, action: "enroll" | "in" | "out") => {
    const current = latest();
    const existing = current.attendees.find((item) => item.employee.employee_code === employee.employee_code);
    if (action === "enroll" && existing) { setNotice("พนักงานอยู่ในรายชื่อรอบนี้แล้ว"); return; }
    if (action === "in" && existing?.checked_in_at) { setNotice(`${employeeName(employee)} เช็คชื่อแล้ว ${formatDate(existing.checked_in_at)}`); return; }
    if (action === "out" && !existing?.checked_in_at) { setError("ต้องเช็คชื่อเข้าก่อนเช็คชื่อออก"); return; }
    if (action === "out" && existing?.checked_out_at) { setNotice("พนักงานเช็คชื่อออกแล้ว"); return; }
    const updated = { ...(existing ?? { employee, session_id: session!.id, result: "pending" as const }),
      ...(action === "in" ? { checked_in_at: new Date().toISOString() } : action === "out" ? { checked_out_at: new Date().toISOString() } : {}) };
    const attendees = existing ? current.attendees.map((item) => item.employee.employee_code === employee.employee_code ? updated : item) : [...current.attendees, updated];
    if (persist({ ...current, attendees }, `${action === "enroll" ? "เพิ่มรายชื่อ" : action === "in" ? "เช็คชื่อเข้า" : "เช็คชื่อออก"} ${employeeName(employee)}`)) { setQuery(""); scanRef.current?.focus(); }
  };
  if (loading) return <p className="p-8">กำลังโหลดรอบอบรม...</p>;
  if (!session) return <div className="p-8"><p role="alert" className="mb-4 text-danger-600">{error}</p><Link to="/courses" className="text-brand-600">กลับหน้าหลักสูตร</Link></div>;
  return <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl space-y-5">
      <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-muted"><ArrowLeft size={16} />กลับหน้าหลักสูตร</Link>
      <Card className="p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-brand-600">Training Session · รอบที่ {session.session_no}</p><h1 className="mt-2 text-2xl font-bold text-heading">{session.course_title}</h1><p className="mt-2 text-sm text-muted">{formatDate(session.course_date)} · {session.start_time}–{session.end_time} · {session.location}</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${open ? "bg-success-50 text-success-600" : "bg-slate-100 text-muted"}`}>{open ? "เปิดเช็คชื่อ" : session.status === "CLOSED" ? "ปิดรอบแล้ว" : "ยกเลิก"}</span></div></Card>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[["รายชื่อในรอบ", record.attendees.length], ["มาแล้ว", present], ["ยังไม่มา", record.attendees.length - present], ["เช็คชื่อออกแล้ว", departed]].map(([label, count]) => <Card key={label} className="p-4"><p className="text-xs text-muted">{label}</p><p className="mt-2 text-2xl font-bold text-brand-600">{count}</p></Card>)}</div>
      {error && <p role="alert" className="rounded-xl bg-danger-50 p-4 text-sm text-danger-600">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-success-50 p-4 text-sm text-success-600">{notice}</p>}
      <div role="tablist" aria-label="จัดการรอบอบรม" className="flex flex-wrap gap-2">{([ ["attendance", "เช็คชื่อ"], ["results", "ผลการอบรม"], ["info", "ข้อมูลรอบ"], ["history", "ประวัติ"] ] as const).map(([value, label]) => <button key={value} id={`tab-${value}`} type="button" role="tab" aria-selected={tab === value} aria-controls={`panel-${value}`} onClick={() => setTab(value)} className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${tab === value ? "bg-brand-600 text-white" : "bg-white text-muted"}`}>{label}</button>)}</div>
      <section role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="space-y-5">
        {tab === "attendance" && <>
          {open && <Card className="p-5"><h2 className="flex items-center gap-2 font-bold text-heading"><Search size={18} />สแกน QR / ค้นหาพนักงาน</h2><p className="mt-1 text-xs text-muted">ใช้เครื่องสแกน QR ที่ส่งข้อความเข้าช่องนี้แล้วกด Enter หรือค้นหาด้วยชื่อและรหัส</p>
            <form className="mt-4 flex flex-wrap gap-3" onSubmit={(event) => { event.preventDefault(); const employee = employees.find((item) => item.employee_code.toLowerCase() === query.trim().toLowerCase() || item.qr_token === query.trim()); if (employee) act(employee, scanMode); else setError("ไม่พบรหัสหรือ QR ของพนักงานที่ใช้งานอยู่ กรุณาเลือกจากผลค้นหา"); }}>
              <input ref={scanRef} autoFocus aria-label="รหัส QR หรือชื่อพนักงาน" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 rounded-control border border-border px-4 py-3" placeholder="สแกน QR / รหัส / ชื่อพนักงาน" />
              <select aria-label="เช็คชื่อเข้าหรือออก" value={scanMode} onChange={(event) => setScanMode(event.target.value as "in" | "out")} className="rounded-control border border-border px-3"><option value="in">เช็คชื่อเข้า</option><option value="out">เช็คชื่อออก</option></select><Button type="submit"><Check size={16} />บันทึก</Button>
            </form>
            {matches.length > 0 && <div className="mt-3 divide-y divide-border rounded-xl border border-border">{matches.map((employee) => <div key={employee.employee_code} className="flex flex-wrap items-center justify-between gap-3 p-3"><div><p className="font-semibold text-heading">{employeeName(employee)}</p><p className="text-xs text-muted">{employee.employee_code} · {employee.supplier_name || "ไม่ระบุบริษัท"}</p></div><div className="flex gap-2"><button type="button" onClick={() => act(employee, "enroll")} className="rounded-lg bg-slate-100 px-3 py-2 text-xs">เพิ่มรายชื่อ</button><Button type="button" onClick={() => act(employee, scanMode)}>{scanMode === "in" ? "เช็คชื่อเข้า" : "เช็คชื่อออก"}</Button></div></div>)}</div>}
          </Card>}
          <Card className="overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5"><h2 className="flex items-center gap-2 font-bold"><Users size={18} />รายชื่อผู้เข้าอบรม</h2><div className="flex gap-2"><input aria-label="ค้นหาในรายชื่อ" placeholder="ค้นหารายชื่อ" value={tableSearch} onChange={(event) => setTableSearch(event.target.value)} className="min-w-0 rounded-control border border-border px-3 py-2 text-sm" /><select aria-label="กรองสถานะ" value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-control border border-border px-2 text-sm"><option value="all">ทั้งหมด</option><option value="waiting">ยังไม่มา</option><option value="in">อยู่ในการอบรม</option><option value="out">ออกแล้ว</option></select></div></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-slate-50 text-muted"><tr>{["พนักงาน", "บริษัท", "เวลาเข้า", "เวลาออก", "สถานะ", "ดำเนินการ"].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}</tr></thead><tbody className="divide-y divide-border">{rows.map((item) => <tr key={item.employee.employee_code}><td className="px-4 py-4"><p className="font-semibold">{employeeName(item.employee)}</p><p className="text-xs text-brand-600">{item.employee.employee_code}</p></td><td className="px-4 py-4">{item.employee.supplier_name || "—"}</td><td className="px-4 py-4">{formatDate(item.checked_in_at)}</td><td className="px-4 py-4">{formatDate(item.checked_out_at)}</td><td className="px-4 py-4">{item.checked_out_at ? "ออกแล้ว" : item.checked_in_at ? "เข้าแล้ว" : "ยังไม่มา"}</td><td className="px-4 py-4">{open && (!item.checked_in_at ? <button type="button" onClick={() => act(item.employee, "in")} className="inline-flex items-center gap-1 text-brand-600"><LogIn size={16} />เข้า</button> : !item.checked_out_at ? <button type="button" onClick={() => act(item.employee, "out")} className="inline-flex items-center gap-1 text-brand-600"><LogOut size={16} />ออก</button> : "—")}</td></tr>)}{!rows.length && <tr><td colSpan={6} className="p-10 text-center text-muted">ยังไม่มีรายชื่อที่ตรงกับการค้นหา · เพิ่มรายชื่อหรือเช็คชื่อเพื่อเริ่มต้น</td></tr>}</tbody></table></div>
          </Card>
        </>}
        {tab === "results" && <Card className="overflow-hidden"><h2 className="border-b border-border p-5 font-bold">ผลการอบรม</h2><div className="divide-y divide-border">{record.attendees.filter((item) => item.checked_in_at).map((item) => <div key={item.employee.employee_code} className="flex items-center justify-between gap-4 p-5"><div><p className="font-semibold">{employeeName(item.employee)}</p><p className="text-xs text-muted">{item.employee.employee_code}</p></div><select aria-label={`ผลการอบรม ${employeeName(item.employee)}`} disabled={!open} value={item.result} onChange={(event) => { const value = event.target.value as "pending" | "passed" | "failed"; const current = latest(); persist({ ...current, attendees: current.attendees.map((row) => row.employee.employee_code === item.employee.employee_code ? { ...row, result: value } : row) }, `บันทึกผล ${employeeName(item.employee)}: ${resultLabels[value]}`); }} className="rounded-control border border-border px-3 py-2"><option value="pending">รอผล</option><option value="passed">ผ่าน</option><option value="failed">ไม่ผ่าน</option></select></div>)}{!present && <p className="p-10 text-center text-muted">ยังไม่มีผู้เช็คชื่อเข้าอบรม</p>}</div></Card>}
        {tab === "info" && <Card className="p-5"><h2 className="font-bold">ข้อมูลรอบอบรม</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2">{[["เลขรอบ", String(session.session_no)], ["วันที่อบรม", formatDate(session.course_date)], ["เวลา", `${session.start_time}–${session.end_time}`], ["สถานที่", session.location], ["วิทยากร", session.instructors.join(", ")], ["สร้างเมื่อ", formatDate(session.created_at)], ["หมายเหตุ", session.note || "—"]].map(([label, value]) => <div key={label}><dt className="text-xs text-muted">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words font-semibold">{value}</dd></div>)}</dl></Card>}
        {tab === "history" && <Card className="p-5"><h2 className="flex items-center gap-2 font-bold"><History size={18} />ประวัติการดำเนินการ</h2><ol className="mt-4 divide-y divide-border">{[...record.logs, ...(session.closed_at ? [{ id: `${session.id}-closed`, at: session.closed_at, by: session.closed_by ?? "ไม่ระบุผู้ดำเนินการ", message: "ปิดรอบอบรม" }] : [])].reverse().map((log) => <li key={log.id} className="py-4"><p className="font-medium">{log.message}</p><p className="mt-1 text-xs text-muted">{formatDate(log.at)} · {log.by}</p></li>)}{!record.logs.length && !session.closed_at && <li className="py-8 text-center text-muted">ยังไม่มีการดำเนินการเช็คชื่อ</li>}</ol></Card>}
      </section>
      {open && <Card className="p-5"><div className="flex flex-wrap items-center justify-between gap-3"><p className="flex items-center gap-2 text-sm text-muted"><Clock3 size={16} />บันทึกทันทีหลังดำเนินการสำเร็จ</p><Button type="button" variant="danger" onClick={() => setConfirmClose(true)}>ปิดรอบอบรม</Button></div>{confirmClose && <div className="mt-4 rounded-xl bg-amber-50 p-4"><p className="text-sm text-amber-800">ยืนยันปิดรอบ? ต้องเช็คชื่อออกและลงผลของผู้มาอบรมให้ครบ หลังปิดจะดูข้อมูลได้อย่างเดียว</p><div className="mt-3 flex gap-3"><Button type="button" variant="danger" onClick={() => { try { closeTrainingSession(session.id, user?.name); const found = getTrainingSession(session.id)!; setSession(found); setConfirmClose(false); setError(""); setNotice("ปิดรอบอบรมแล้ว"); } catch (error) { setError(error instanceof Error ? error.message : "ปิดรอบไม่สำเร็จ"); } }}>ยืนยันปิดรอบ</Button><button type="button" onClick={() => setConfirmClose(false)} className="px-3 text-sm">ยกเลิก</button></div></div>}</Card>}
    </div>
  </main>;
}
