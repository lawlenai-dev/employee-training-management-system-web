export type TrainingSessionInput = {
  course_date: string;
  start_time: string;
  end_time: string;
  location: string;
  instructors: string[];
  note: string;
};
export type TrainingSession = TrainingSessionInput & {
  id: string;
  course_id: string;
  session_no: number;
  course_title: string;
  status: "OPEN" | "CLOSED" | "CANCELLED";
  created_at: string;
  closed_at?: string;
  closed_by?: string;
};
const KEY = "demo_training_sessions";
export function getTrainingSessions(): TrainingSession[] {
  const stored = localStorage.getItem(KEY);
  if (!stored) return [];
  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed)) throw new Error("ข้อมูลรอบอบรมไม่ถูกต้อง");
  return parsed as TrainingSession[];
}
export function getTrainingSession(id: string) {
  return getTrainingSessions().find((session) => session.id === id);
}
export function createTrainingSession(course: { id: string | number; title: string }, input: TrainingSessionInput): TrainingSession {
  if (!input.course_date || !input.start_time || !input.end_time || input.end_time <= input.start_time)
    throw new Error("กรุณากำหนดวันที่ และเวลาสิ้นสุดให้มากกว่าเวลาเริ่ม (ภายในวันเดียวกัน)");
  if (!input.location.trim() || !input.instructors.length) throw new Error("กรุณาระบุสถานที่และวิทยากร");
  const sessions = getTrainingSessions();
  const courseId = String(course.id);
  const next = Math.max(0, ...sessions.filter((item) => item.course_id === courseId).map((item) => item.session_no)) + 1;
  const session: TrainingSession = {
    ...input, location: input.location.trim(), instructors: [...new Set(input.instructors.map((name) => name.trim()).filter(Boolean))],
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    course_id: courseId, course_title: course.title, session_no: next, status: "OPEN", created_at: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify([...sessions, session]));
  return session;
}

export type SessionEmployee = {
  id: string | number;
  employee_code: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  department?: string;
  position?: string;
  supplier_name?: string;
  is_active: boolean | number | string;
  qr_token?: string;
};
export type SessionAttendance = {
  employee: SessionEmployee;
  session_id: string;
  checked_in_at?: string;
  checked_out_at?: string;
  result: "pending" | "passed" | "failed";
};
export type SessionLog = { id: string; at: string; by: string; message: string };
export type SessionRecord = { attendees: SessionAttendance[]; logs: SessionLog[] };
const attendanceKey = (sessionId: string) => `demo_attendance_${sessionId}`;
export function getSessionRecord(sessionId: string): SessionRecord {
  const raw = localStorage.getItem(attendanceKey(sessionId));
  if (!raw) return { attendees: [], logs: [] };
  const parsed = JSON.parse(raw) as SessionRecord;
  if (!Array.isArray(parsed.attendees) || !Array.isArray(parsed.logs)) throw new Error("ข้อมูลเช็คชื่อไม่ถูกต้อง");
  return parsed;
}
export function saveSessionRecord(sessionId: string, record: SessionRecord) {
  const session = getTrainingSession(sessionId);
  if (!session || session.status !== "OPEN") throw new Error("รอบอบรมนี้ปิดแล้ว ไม่สามารถบันทึกได้");
  localStorage.setItem(attendanceKey(sessionId), JSON.stringify(record));
}
export function closeTrainingSession(sessionId: string, by = "ไม่ระบุผู้ดำเนินการ") {
  const sessions = getTrainingSessions();
  const session = sessions.find((item) => item.id === sessionId);
  if (!session || session.status !== "OPEN") throw new Error("ไม่พบรอบอบรมที่เปิดอยู่");
  const record = getSessionRecord(sessionId);
  if (record.attendees.some((item) => item.checked_in_at && (!item.checked_out_at || item.result === "pending")))
    throw new Error("กรุณาเช็คชื่อออกและบันทึกผลของผู้เข้าอบรมให้ครบก่อนปิดรอบ");
  localStorage.setItem(KEY, JSON.stringify(sessions.map((item) => item.id === sessionId ? { ...item, status: "CLOSED", closed_at: new Date().toISOString(), closed_by: by } : item)));
}
