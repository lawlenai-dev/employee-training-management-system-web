import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  BookOpenCheck,
  CalendarDays,
  Clock3,
  Eye,
  FileText,
  MapPin,
  Plus,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Button, Input } from "./Ui";

const statusConfig = {
  OPEN: {
    label: "เปิดใช้งาน",
    className: "bg-success-50 text-success-600",
  },
  DRAFT: {
    label: "ฉบับร่าง",
    className: "bg-accent-50 text-accent-700",
  },
  CLOSED: {
    label: "ปิดหลักสูตร",
    className: "bg-slate-100 text-slate-600",
  },
  CANCELLED: {
    label: "ยกเลิก",
    className: "bg-danger-50 text-danger-700",
  },
};

function formatThaiDate(date) {
  if (!date) return "ไม่ระบุวันที่";

  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatTime(time) {
  if (!time) return "--:--";
  return time.slice(0, 5);
}

export default function CourseModal({
  open,
  mode = "create",
  course = null,
  form,
  setForm,
  onSubmit,
  onClose,
  onOpenAttendance,
  saving = false,
  error = "",
}) {
  const isCreate = mode === "create";
  const isView = mode === "view";

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose, saving]);

  if (!open) return null;

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !saving) {
      onClose();
    }
  };

  const courseStatus =
    statusConfig[course?.status] ?? statusConfig.CLOSED;

  return createPortal(
    <div
      role="presentation"
      onMouseDown={handleBackdropClick}
      className="
        fixed inset-0 z-[100]
        flex items-end justify-center
        bg-slate-950/60 backdrop-blur-sm
        sm:items-center sm:p-6
      "
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-modal-title"
        className="
          flex max-h-[95dvh] w-full flex-col
          overflow-hidden rounded-t-[28px] bg-white
          shadow-2xl shadow-black/25

          sm:max-h-[90dvh] sm:max-w-3xl
          sm:rounded-[28px]
        "
      >
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border bg-gradient-to-r from-brand-50 to-white px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-900/15">
              {isCreate ? (
                <Plus size={20} />
              ) : (
                <Eye size={20} />
              )}
            </span>

            <div>
              <h2
                id="course-modal-title"
                className="text-lg font-bold text-heading sm:text-xl"
              >
                {isCreate
                  ? "สร้างหลักสูตรใหม่"
                  : "รายละเอียดหลักสูตร"}
              </h2>

              <p className="mt-1 text-sm text-muted">
                {isCreate
                  ? "กรอกข้อมูลพื้นฐานของหลักสูตรให้ครบถ้วน"
                  : "ตรวจสอบข้อมูลและสถานะของหลักสูตรอบรม"}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="ปิดหน้าต่าง"
            disabled={saving}
            onClick={onClose}
            className="
              rounded-xl p-2 text-slate-400 transition
              hover:bg-white hover:text-slate-700
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            <X size={22} />
          </button>
        </header>

        {/* Content */}
        <div className="overflow-y-auto">
          {isCreate && (
            <CreateCourseForm
              form={form}
              updateForm={updateForm}
              onSubmit={onSubmit}
              error={error}
            />
          )}

          {isView && (
            <CourseDetail
              course={course}
              courseStatus={courseStatus}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-border bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          {isCreate ? (
            <>
              <Button
                type="button"
                variant="secondary"
                disabled={saving}
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                ยกเลิก
              </Button>

              <Button
                type="submit"
                form="course-form"
                disabled={saving}
                className="w-full sm:w-auto"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <BookOpenCheck size={18} />
                    บันทึกหลักสูตร
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                ปิด
              </Button>

              {onOpenAttendance && (
                <Button
                  type="button"
                  onClick={() => onOpenAttendance(course)}
                  className="w-full sm:w-auto"
                >
                  <Users size={18} />
                  เปิดหน้าเช็กชื่อ
                </Button>
              )}
            </>
          )}
        </footer>
      </div>
    </div>,
    document.body,
  );
}

function CreateCourseForm({
  form,
  updateForm,
  onSubmit,
  error,
}) {
  return (
    <form
      id="course-form"
      onSubmit={onSubmit}
      className="grid gap-5 p-5 sm:p-6 md:grid-cols-2"
    >
      <div className="md:col-span-2">
        <Input
          label="ชื่อหลักสูตร *"
          required
          autoFocus
          placeholder="เช่น การปฐมนิเทศความปลอดภัย"
          value={form.title}
          onChange={(event) =>
            updateForm("title", event.target.value)
          }
        />
      </div>

      <Input
        label="วันที่อบรม *"
        type="date"
        required
        value={form.course_date}
        onChange={(event) =>
          updateForm("course_date", event.target.value)
        }
      />

      <Input
        label="สถานที่"
        placeholder="เช่น ห้องประชุมชั้น 2"
        value={form.location}
        onChange={(event) =>
          updateForm("location", event.target.value)
        }
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="เวลาเริ่ม"
          type="time"
          value={form.start_time}
          onChange={(event) =>
            updateForm("start_time", event.target.value)
          }
        />

        <Input
          label="เวลาสิ้นสุด"
          type="time"
          value={form.end_time}
          onChange={(event) =>
            updateForm("end_time", event.target.value)
          }
        />
      </div>

      <Input
        label="วิทยากร"
        placeholder="ชื่อวิทยากรหรือหน่วยงาน"
        value={form.instructor}
        onChange={(event) =>
          updateForm("instructor", event.target.value)
        }
      />

      <label className="block md:col-span-2">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          รายละเอียดหลักสูตร
        </span>

        <textarea
          rows={4}
          placeholder="ระบุหัวข้อ วัตถุประสงค์ หรือรายละเอียดเพิ่มเติม..."
          value={form.description}
          onChange={(event) =>
            updateForm("description", event.target.value)
          }
          className="
            w-full resize-none rounded-control
            border border-slate-300 bg-white
            px-3.5 py-3 text-sm text-slate-900
            outline-none transition
            placeholder:text-placeholder
            focus:border-brand-500
            focus:ring-4 focus:ring-brand-100
          "
        />
      </label>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger-600/20 bg-danger-50 px-4 py-3 text-sm text-danger-700 md:col-span-2"
        >
          {error}
        </div>
      )}
    </form>
  );
}

/* -------------------------------------------------- */
/* View mode                                          */
/* -------------------------------------------------- */

function CourseDetail({ course, courseStatus }) {
  if (!course) {
    return (
      <div className="p-10 text-center text-sm text-muted">
        ไม่พบข้อมูลหลักสูตร
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6">
      {/* ชื่อและสถานะ */}
      <div className="rounded-2xl bg-brand-50 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              Training course
            </p>

            <h3 className="mt-2 text-xl font-bold text-heading sm:text-2xl">
              {course.title}
            </h3>
          </div>

          <span
            className={`
              inline-flex self-start rounded-full px-3 py-1.5
              text-xs font-semibold
              ${courseStatus.className}
            `}
          >
            {courseStatus.label}
          </span>
        </div>
      </div>

      {/* รายละเอียดหลัก */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <DetailItem
          icon={CalendarDays}
          label="วันที่อบรม"
          value={formatThaiDate(course.course_date)}
        />

        <DetailItem
          icon={Clock3}
          label="เวลาอบรม"
          value={`${formatTime(course.start_time)} – ${formatTime(
            course.end_time,
          )} น.`}
        />

        <DetailItem
          icon={MapPin}
          label="สถานที่"
          value={course.location || "ไม่ระบุสถานที่"}
        />

        <DetailItem
          icon={UserRound}
          label="วิทยากร"
          value={course.instructor || "ไม่ระบุวิทยากร"}
        />

        <DetailItem
          icon={Users}
          label="ผู้เช็กชื่อแล้ว"
          value={`${course.attendance_count ?? 0} คน`}
        />

        <DetailItem
          icon={BookOpenCheck}
          label="สถานะหลักสูตร"
          value={courseStatus.label}
        />
      </div>

      {/* รายละเอียด */}
      <div className="mt-5 rounded-2xl border border-border p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-heading">
          <FileText size={18} className="text-brand-600" />
          รายละเอียดหลักสูตร
        </div>

        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-body">
          {course.description || "ไม่มีรายละเอียดหลักสูตร"}
        </p>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-white p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon size={19} />
      </span>

      <div className="min-w-0">
        <p className="text-xs text-muted">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-heading">
          {value}
        </p>
      </div>
    </div>
  );
}