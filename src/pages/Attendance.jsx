import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Keyboard,
  MapPin,
  RefreshCw,
  UserCheck,
  X,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { checkIn, getAttendance, getCourse } from "../api";
import { Button, Card, Empty, Loading } from "../components/Ui";

function extractCredential(text) {
  const value = text.trim();
  try {
    const parsed = JSON.parse(value);
    return parsed.qr_token || parsed.employee_code || value;
  } catch {
    /* not JSON */
  }
  try {
    const url = new URL(value);
    return (
      url.searchParams.get("token") ||
      url.searchParams.get("employee_code") ||
      value
    );
  } catch {
    return value;
  }
}

export default function Attendance() {
  const { id } = useParams(),
    [course, setCourse] = useState(null),
    [rows, setRows] = useState(null),
    [code, setCode] = useState(""),
    [mode, setMode] = useState("manual"),
    [scannerOpen, setScannerOpen] = useState(false),
    [message, setMessage] = useState(null),
    [busy, setBusy] = useState(false);
  const scannerRef = useRef(null),
    lockedRef = useRef(false);
  const load = useCallback(
    () =>
      Promise.all([getCourse(id), getAttendance(id)]).then(([c, a]) => {
        setCourse(c.data);
        setRows(a.data);
      }),
    [id],
  );
  useEffect(() => {
    load();
  }, [load]);
  const submitCredential = useCallback(
    async (credential, checkinMode) => {
      if (!credential || lockedRef.current) return;
      lockedRef.current = true;
      setBusy(true);
      setMessage(null);
      try {
        const r = await checkIn(id, {
          credential: extractCredential(credential),
          checkin_method: checkinMode,
        });
        setMessage({
          ok: true,
          text: `เช็กชื่อสำเร็จ: ${r.data.employee.full_name}`,
        });
        setCode("");
        await load();
      } catch (e) {
        setMessage({ ok: false, text: e.message });
      } finally {
        setBusy(false);
        window.setTimeout(() => {
          lockedRef.current = false;
        }, 1200);
      }
    },
    [id, load],
  );
  useEffect(() => {
    if (!scannerOpen) return;
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;
    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decoded) => submitCredential(decoded, "qr"),
      )
      .catch(() =>
        setMessage({
          ok: false,
          text: "เปิดกล้องไม่ได้ กรุณาอนุญาตใช้กล้องหรือใช้การพิมพ์รหัส",
        }),
      );
    return () => {
      scanner
        .stop()
        .catch(() => {})
        .finally(() => scanner.clear().catch(() => {}));
      scannerRef.current = null;
    };
  }, [scannerOpen, submitCredential]);
  if (!course || !rows) return <Loading />;
  const submit = (e) => {
    e.preventDefault();
    submitCredential(code, "manual");
  };
  return (
    <>
      <Link
        to="/courses"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={17} />
        กลับหน้าหลักสูตร
      </Link>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            หน้าเช็กชื่อเข้าอบรม
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            {course.title}
          </h1>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
            <span>
              {course.course_date} • {course.start_time?.slice(0, 5)}–
              {course.end_time?.slice(0, 5)}
            </span>
            <span className="flex gap-1">
              <MapPin size={16} />
              {course.location || "ไม่ระบุสถานที่"}
            </span>
          </p>
        </div>
        <div className="rounded-2xl bg-blue-600 px-5 py-3 text-white">
          <p className="text-xs text-blue-100">เช็กชื่อแล้ว</p>
          <p className="text-2xl font-bold">{rows.length} คน</p>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => {
                  setMode("manual");
                  setScannerOpen(false);
                }}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${mode === "manual" ? "bg-white shadow-sm" : "text-slate-500"}`}
              >
                <Keyboard size={17} />
                พิมพ์รหัส
              </button>
              <button
                onClick={() => {
                  setMode("qr");
                  setScannerOpen(true);
                }}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${mode === "qr" ? "bg-white shadow-sm" : "text-slate-500"}`}
              >
                <Camera size={17} />
                สแกน QR
              </button>
            </div>
            {mode === "manual" ? (
              <form onSubmit={submit}>
                <label className="mb-1.5 block text-sm font-medium">
                  รหัสพนักงาน
                </label>
                <input
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="เช่น EMP001"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-xl font-bold uppercase tracking-wider outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <Button disabled={busy || !code.trim()} className="mt-3 w-full">
                  <UserCheck size={18} />
                  {busy ? "กำลังตรวจสอบ..." : "ยืนยันเช็กชื่อ"}
                </Button>
              </form>
            ) : (
              <div>
                {scannerOpen ? (
                  <>
                    <div
                      id="qr-reader"
                      className="overflow-hidden rounded-xl"
                    />
                    <Button
                      variant="secondary"
                      className="mt-3 w-full"
                      onClick={() => setScannerOpen(false)}
                    >
                      <X size={18} />
                      ปิดกล้อง
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => setScannerOpen(true)}
                  >
                    <Camera size={18} />
                    เปิดกล้องสแกน
                  </Button>
                )}
              </div>
            )}
          </Card>
          {message && (
            <div
              className={`flex items-start gap-3 rounded-2xl border p-4 ${message.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}
            >
              {message.ok ? <CheckCircle2 /> : <X />}
              <p className="font-medium">{message.text}</p>
            </div>
          )}
        </div>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold">รายชื่อผู้เข้าอบรม</h2>
            <button
              onClick={load}
              className="text-slate-500 hover:text-blue-600"
              aria-label="รีเฟรช"
            >
              <RefreshCw size={18} />
            </button>
          </div>
          {rows.length === 0 ? (
            <Empty>ยังไม่มีผู้เช็กชื่อ</Empty>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">พนักงาน</th>
                    <th className="px-5 py-3">แผนก</th>
                    <th className="px-5 py-3">เวลา</th>
                    <th className="px-5 py-3">วิธี</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t border-slate-100">
                      <td className="px-5 py-3">
                        <p className="font-semibold">{r.full_name}</p>
                        <p className="text-xs text-slate-500">
                          {r.employee_code}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {r.department || "-"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {new Date(r.checked_in_at).toLocaleTimeString("th-TH", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">
                          {r.checkin_method === "qr" ? "QR" : "พิมพ์รหัส"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
