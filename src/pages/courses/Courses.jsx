import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  Clock3,
  MapPin,
  Plus,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { createCourse, getCourses } from "../api";
import { employeesMockup, coursesMockup } from "../../data";
import {
  Button,
  Card,
  Empty,
  Input,
  Loading,
  PageTitle,
} from "../../components/Ui";
import HeroCover from "../../components/HeroCover";
import CourseModal from "../../components/CourseModal";

const statusStyles = {
  OPEN: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  DRAFT: "bg-amber-50 text-amber-700 ring-amber-600/20",
  CLOSED: "bg-slate-100 text-slate-600 ring-slate-500/20",
  CANCELLED: "bg-red-50 text-red-700 ring-red-600/20",
};

const statusLabels = {
  OPEN: "เปิดรับลงทะเบียน",
  DRAFT: "ฉบับร่าง",
  CLOSED: "ปิดหลักสูตร",
  CANCELLED: "ยกเลิก",
};

const initial = {
  title: "",
  description: "",
  course_date: "",
  start_time: "09:00",
  end_time: "16:00",
  location: "",
  instructor: "",
};

export default function Courses() {
  const [courses, setCourses] = useState(null),
    [show, setShow] = useState(false),
    [form, setForm] = useState(initial),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(false);
  const [courseModal, setCourseModal] = useState({
    open: false,
    mode: "create",
    course: null,
  });

  const openCreateModal = () => {
    setError("");

    setCourseModal({
      open: true,
      mode: "create",
      course: null,
    });
  };

  const openViewModal = (course) => {
    setCourseModal({
      open: true,
      mode: "view",
      course,
    });
  };

  const closeCourseModal = () => {
    if (saving) return;

    setCourseModal((current) => ({
      ...current,
      open: false,
    }));
  };

  // const load = () => getCourses().then((r) => setCourses(r.data));
  useEffect(() => {
    setCourses(coursesMockup);
    // load();
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createCourse(form);
      setForm(initial);
      setShow(false);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const formatThaiDate = (date) => {
    if (!date) return "ไม่ระบุวันที่";

    return new Intl.DateTimeFormat("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  };
  return (
    <>
      <HeroCover
        size="medium"
        image="/course-cover.jpg"
        imagePosition="center"
        eyebrow="Course Management"
        title="จัดการ"
        highlight="หลักสูตรอบรม"
        description="สร้างหลักสูตร กำหนดวัน เวลา สถานที่ และเปิดรับลงทะเบียนพนักงาน"
      />

      {/* เนื้อหาหลัก */}
      <section className="relative z-10 -mt-12 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* แถบหัวข้อ */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:flex sm:items-center sm:justify-between sm:p-6">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                TRAINING COURSES
              </div>

              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                หลักสูตรอบรม
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                สร้างหลักสูตรและเปิดหน้าเช็กชื่อผู้เข้าอบรม
              </p>
            </div>

            <Button
              className="mt-4 w-full sm:mt-0 sm:w-auto"
              // onClick={() => setShow(!show)}
              onClick={openCreateModal}
            >
              <Plus
                size={18}
                className={`transition-transform ${show ? "rotate-45" : ""}`}
              />

              {show ? "ปิดแบบฟอร์ม" : "สร้างหลักสูตร"}
            </Button>
          </div>

          {/* แบบฟอร์มสร้างหลักสูตร */}
          {show && (
            <Card className="mb-8 overflow-hidden border-0 shadow-lg shadow-slate-900/5">
              <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white px-5 py-4 sm:px-6">
                <h3 className="flex items-center gap-2 font-bold text-slate-900">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Plus size={18} />
                  </span>
                  สร้างหลักสูตรใหม่
                </h3>

                <p className="ml-11 mt-1 text-sm text-slate-500">
                  กรอกข้อมูลพื้นฐานของหลักสูตรให้ครบถ้วน
                </p>
              </div>

              <form
                onSubmit={submit}
                className="grid gap-5 p-5 sm:p-6 md:grid-cols-2"
              >
                <div className="md:col-span-2">
                  <Input
                    label="ชื่อหลักสูตร *"
                    required
                    placeholder="เช่น การปฐมนิเทศความปลอดภัย"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>

                <Input
                  label="วันที่อบรม *"
                  type="date"
                  required
                  value={form.course_date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      course_date: e.target.value,
                    })
                  }
                />

                <Input
                  label="สถานที่"
                  placeholder="เช่น ห้องประชุมชั้น 2"
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="เวลาเริ่ม"
                    type="time"
                    value={form.start_time}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        start_time: e.target.value,
                      })
                    }
                  />

                  <Input
                    label="เวลาสิ้นสุด"
                    type="time"
                    value={form.end_time}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        end_time: e.target.value,
                      })
                    }
                  />
                </div>

                <Input
                  label="วิทยากร"
                  placeholder="ชื่อวิทยากรหรือหน่วยงาน"
                  value={form.instructor}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      instructor: e.target.value,
                    })
                  }
                />

                <label className="block md:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    รายละเอียดหลักสูตร
                  </span>

                  <textarea
                    rows="4"
                    placeholder="ระบุหัวข้อ วัตถุประสงค์ หรือรายละเอียดเพิ่มเติม..."
                    className="
                  w-full resize-none rounded-xl border border-slate-300
                  bg-white px-3.5 py-3 text-sm text-slate-900
                  outline-none transition placeholder:text-slate-400
                  focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                "
                    value={form.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description: e.target.value,
                      })
                    }
                  />
                </label>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">
                    {error}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end md:col-span-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShow(false)}
                  >
                    ยกเลิก
                  </Button>

                  <Button disabled={saving}>
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
                </div>
              </form>
            </Card>
          )}

          {/* รายการหลักสูตร */}
          {courses === null ? (
            <Loading />
          ) : courses.length === 0 ? (
            <Card className="border-dashed border-slate-300">
              <Empty>
                <div className="mx-auto flex max-w-sm flex-col items-center py-4">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <BookOpenCheck size={30} />
                  </div>

                  <p className="font-semibold text-slate-800">
                    ยังไม่มีหลักสูตรอบรม
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    กด “สร้างหลักสูตร” เพื่อเพิ่มหลักสูตรแรก
                  </p>
                </div>
              </Empty>
            </Card>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    หลักสูตรทั้งหมด
                  </h3>

                  <p className="text-sm text-slate-500">
                    พบ {courses.length} หลักสูตร
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <article
                    key={course.id}
                    className="
        group relative flex min-h-full flex-col overflow-hidden
        rounded-[1.5rem] border border-border bg-surface
        shadow-card transition-all duration-300
        hover:-translate-y-1.5 hover:border-brand-200
        hover:shadow-2xl hover:shadow-brand-900/10
      "
                  >
                    {/* Header */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 px-5 pb-12 pt-5">
                      {/* วงกลมตกแต่ง */}
                      <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full border border-white/10 bg-white/5" />
                      <div className="pointer-events-none absolute right-10 top-14 h-16 w-16 rounded-full bg-amber-400/10 blur-xl" />

                      <div className="relative flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />

                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">
                              Training Course
                            </p>
                          </div>

                          <p className="mt-2 font-mono text-xs font-semibold text-white/50">
                            COURSE-{String(course.id).padStart(3, "0")}
                          </p>
                        </div>

                        <span
                          className={`
              inline-flex items-center gap-1.5 rounded-full
              bg-white/95 px-3 py-1.5 text-xs font-bold
              shadow-sm ring-1 ring-inset ring-white/50
              ${statusStyles[course.status] ?? statusStyles.CLOSED}
            `}
                        >
                          <span
                            className={`
                h-1.5 w-1.5 rounded-full
                ${
                  course.status === "OPEN"
                    ? "bg-success-600"
                    : course.status === "DRAFT"
                      ? "bg-warning-600"
                      : "bg-slate-400"
                }
              `}
                          />

                          {statusLabels[course.status] ?? course.status}
                        </span>
                      </div>
                    </div>

                    {/* Course icon */}
                    <div
                      className="
          absolute left-5 top-[88px] z-10
          flex h-14 w-14 items-center justify-center
          rounded-2xl border-4 border-white
          bg-brand-50 text-brand-600 shadow-lg
          transition-all duration-300
          group-hover:-rotate-3 group-hover:scale-105
          group-hover:bg-amber-400 group-hover:text-brand-900
        "
                    >
                      <BookOpenCheck size={25} />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col px-5 pb-5 pt-10">
                      <div>
                        <h2 className="line-clamp-2 text-xl font-bold leading-7 text-heading transition group-hover:text-brand-600">
                          {course.title}
                        </h2>

                        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-muted">
                          {course.description || "ไม่มีรายละเอียดหลักสูตร"}
                        </p>
                      </div>

                      {/* Course details */}
                      <div className="mt-5 grid gap-3">
                        {/* Date */}
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                            <CalendarDays size={17} />
                          </span>

                          <div className="min-w-0">
                            <p className="text-[11px] font-medium text-muted">
                              วันที่อบรม
                            </p>

                            <p className="truncate text-sm font-semibold text-heading">
                              {formatThaiDate(course.course_date)}
                            </p>
                          </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Clock3 size={17} />
                          </span>

                          <div className="min-w-0">
                            <p className="text-[11px] font-medium text-muted">
                              เวลาอบรม
                            </p>

                            <p className="truncate text-sm font-semibold text-heading">
                              {course.start_time?.slice(0, 5) || "--:--"}
                              {" – "}
                              {course.end_time?.slice(0, 5) || "--:--"} น.
                            </p>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                            <MapPin size={17} />
                          </span>

                          <div className="min-w-0">
                            <p className="text-[11px] font-medium text-muted">
                              สถานที่
                            </p>

                            <p className="truncate text-sm font-semibold text-heading">
                              {course.location || "ไม่ระบุสถานที่"}
                            </p>
                          </div>
                        </div>

                        {/* Instructor */}
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <UserRound size={17} />
                          </span>

                          <div className="min-w-0">
                            <p className="text-[11px] font-medium text-muted">
                              วิทยากร
                            </p>

                            <p className="truncate text-sm font-semibold text-heading">
                              {course.instructor || "ไม่ระบุวิทยากร"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom content */}
                      <div className="mt-auto pt-5">
                        {/* Attendance */}
                        <div
                          className="
              flex items-center justify-between rounded-2xl
              border border-brand-100 bg-gradient-to-r
              from-brand-50 to-white px-4 py-3
            "
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                              <Users size={19} />
                            </span>

                            <div>
                              <p className="text-xs text-muted">
                                ผู้เข้าร่วมอบรม
                              </p>

                              <p className="mt-0.5 text-sm font-semibold text-heading">
                                เช็กชื่อเรียบร้อยแล้ว
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-bold leading-none text-brand-700">
                              {course.attendance_count ?? 0}
                            </p>

                            <p className="mt-1 text-[11px] text-muted">คน</p>
                          </div>
                        </div>

                        {/* Action */}
                        <Link
                          // to={`/courses/${course.id}/attendance`}
                          className="
              mt-4 flex w-full items-center justify-between
              rounded-2xl bg-brand-600 px-4 py-3.5
              text-sm font-semibold text-white
              shadow-lg shadow-brand-900/10
              transition-all duration-300
              hover:bg-brand-700 hover:shadow-xl
              focus:outline-none focus:ring-4 focus:ring-brand-100
            "
                        >
                          <span className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                              <BookOpenCheck size={17} />
                            </span>
                            เปิดหน้าเช็กชื่อ 
                          </span>

                          <ArrowRight
                            size={18}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <CourseModal
        open={courseModal.open}
        mode={courseModal.mode}
        course={courseModal.course}
        onClose={closeCourseModal}
        form={form}
        setForm={setForm}
        onSubmit={submit}
        saving={saving}
        error={error}
        // onOpenAttendance={(selectedCourse) => {
        //   navigate(`/courses/${selectedCourse.id}/attendance`);
        // }}
      />
    </>
  );
}
