import { CalendarDays, Plus, Users, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button, Input } from "../../../components/Ui";
import type { Course } from "./CourseModal";
import type { TrainingSessionInput } from "./trainingSessions";

type Props = {
  course: Course;
  sessionNo: number;
  onClose: () => void;
  onCreate: (input: TrainingSessionInput) => Promise<void> | void;
};
const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
export default function SessionModal({
  course,
  sessionNo,
  onClose,
  onCreate,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const busy = useRef(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [instructor, setInstructor] = useState("");
  const [form, setForm] = useState<TrainingSessionInput>({
    course_date: today(),
    start_time: course.start_time?.slice(0, 5) || "09:00",
    end_time: course.end_time?.slice(0, 5) || "16:00",
    location: course.location || "",
    instructors: course.instructor ? [course.instructor] : [],
    note: "",
  });
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
  const change = <K extends keyof TrainingSessionInput>(
    key: K,
    value: TrainingSessionInput[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };
  const addInstructor = () => {
    const name = instructor.trim();
    if (name) change("instructors", [...new Set([...form.instructors, name])]);
    setInstructor("");
  };
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy.current) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-3xl border-0 bg-white p-0 text-body shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm"
    >
      <header className="flex items-start justify-between gap-4 border-b border-border bg-gradient-to-r from-brand-50 to-white p-5 sm:p-6">
        <div className="flex gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
            <CalendarDays size={22} />
          </span>
          <div>
            <h2 id={titleId} className="text-xl font-bold text-heading">
              สร้างรอบเทรนนิ่ง
            </h2>
            <p className="mt-1 text-sm text-muted">
              {course.title} · รอบที่ {sessionNo}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          aria-label="ปิดหน้าต่าง"
          className="rounded-xl p-2 text-muted"
        >
          <X size={22} />
        </button>
      </header>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (busy.current) return;
          const names = [
            ...new Set(
              [...form.instructors, instructor.trim()].filter(Boolean),
            ),
          ];
          if (form.end_time <= form.start_time) {
            setError("เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม ภายในวันเดียวกัน");
            return;
          }
          if (!names.length) {
            setError("กรุณาเพิ่มวิทยากรอย่างน้อย 1 คน");
            return;
          }
          busy.current = true;
          setSaving(true);
          setError("");
          try {
            await onCreate({ ...form, instructors: names });
          } catch (error) {
            setError(
              error instanceof Error
                ? error.message
                : "ไม่สามารถสร้างรอบอบรมได้",
            );
          } finally {
            busy.current = false;
            setSaving(false);
          }
        }}
      >
        <fieldset
          disabled={saving}
          className="grid gap-5 p-5 sm:p-6 md:grid-cols-2"
        >
          <Input
            label="วันที่อบรม"
            required
            autoFocus
            type="date"
            value={form.course_date}
            onChange={(event) => change("course_date", event.target.value)}
          />
          <Input
            label="สถานที่"
            required
            value={form.location}
            onChange={(event) => change("location", event.target.value)}
          />
          <Input
            label="เวลาเริ่ม"
            required
            type="time"
            value={form.start_time}
            onChange={(event) => change("start_time", event.target.value)}
          />
          <Input
            label="เวลาสิ้นสุด"
            required
            type="time"
            value={form.end_time}
            onChange={(event) => change("end_time", event.target.value)}
          />
          <div className="md:col-span-2">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label="วิทยากร (เพิ่มได้หลายคน)"
                  value={instructor}
                  placeholder=""
                  onChange={(event) => setInstructor(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addInstructor();
                    }
                  }}
                />
              </div>
              <Button type="button" onClick={addInstructor}>
                <Plus size={16} />
                เพิ่ม
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {form.instructors.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-sm text-brand-600"
                >
                  {name}
                  <button
                    type="button"
                    aria-label={`นำ ${name} ออก`}
                    onClick={() =>
                      change(
                        "instructors",
                        form.instructors.filter((value) => value !== name),
                      )
                    }
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <label className="text-sm font-medium text-heading md:col-span-2">
            หมายเหตุ
            <textarea
              rows={3}
              value={form.note}
              onChange={(event) => change("note", event.target.value)}
              className="mt-2 block w-full rounded-control border border-border p-3"
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-danger-600 md:col-span-2">
              {error}
            </p>
          )}
        </fieldset>
        <footer className="flex flex-wrap justify-end gap-3 border-t border-border bg-slate-50 p-5">
          <Button
            type="button"
            variant="secondary"
            disabled={saving}
            onClick={onClose}
          >
            ยกเลิก
          </Button>
          <Button type="submit" disabled={saving}>
            <Users size={18} />
            {saving ? "กำลังสร้าง..." : "สร้างรอบและเปิดหน้าเช็กชื่อ"}
          </Button>
        </footer>
      </form>
    </dialog>
  );
}
