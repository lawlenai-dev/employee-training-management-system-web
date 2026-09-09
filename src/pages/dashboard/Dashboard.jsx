import {
  ArrowRight,
  BookOpenCheck,
  CalendarCheck,
  Check,
  Clock3,
  QrCode,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import HeroCover from "../../components/HeroCover";
import { courseTrainingData, recentTrainings } from "../../data";
import CourseTrainingPieChart from "./component/CourseTrainingPieChart";

const summaries = [
  {
    title: "หลักสูตรทั้งหมด",
    value: "12",
    description: "หลักสูตรในระบบ",
    icon: BookOpenCheck,
    link: "/courses",
  },
  {
    title: "พนักงานทั้งหมด",
    value: "245",
    description: "พนักงานที่ลงทะเบียน",
    icon: Users,
    link: "/employees",
  },
  {
    title: "เช็กชื่อวันนี้",
    value: "87",
    description: "รายการเข้าร่วมอบรม",
    icon: CalendarCheck,
    link: "/courses",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <>
      <HeroCover
        size="large"
        image="/training-cover.jpg"
        imagePosition="center"
        eyebrow=" Employee Training"
        eyebrowIcon={BookOpenCheck}
        title="ระบบบริหารจัดการ"
        highlight="การฝึกอบรมพนักงาน"
        description="
          จัดการหลักสูตร ลงทะเบียนพนักงาน
          และบันทึกการเข้าร่วมอบรม
          ด้วยรหัสพนักงานหรือ QR Code
        "
      >
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 rounded-control bg-white px-5 py-3 font-semibold text-brand-600 shadow-lg transition hover:bg-brand-50"
        >
          <BookOpenCheck size={19} />
          ดูหลักสูตร
        </Link>

        <Link
          to="/employees"
          className="inline-flex items-center gap-2 rounded-control border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
        >
          <QrCode size={19} />
          จัดการ QR
        </Link>
      </HeroCover>

      <section className="relative z-10 -mt-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {summaries.map(({ title, value, description, icon: Icon, link }) => (
            <Link
              key={title}
              to={link}
              className="
                  group rounded-card border border-border
                  bg-surface p-6 shadow-xl
                  transition duration-300
                  hover:-translate-y-1 hover:border-brand-200
                "
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted">{title}</p>

                  <p className="mt-2 text-3xl font-bold text-heading">
                    {value}
                  </p>

                  <p className="mt-1 text-sm text-muted">{description}</p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon size={23} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* เนื้อหาส่วนล่าง */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8">
        {/* หัวข้อ */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Training management
            </p>

            <h2 className="mt-2 text-2xl font-bold text-heading sm:text-3xl">
              จัดการระบบฝึกอบรม
            </h2>

            <p className="mt-2 text-muted">
              รายการหลักสูตรและข้อมูลการอบรมล่าสุด
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="
        inline-flex items-center gap-2 self-start
        text-sm font-semibold text-brand-600
        transition hover:text-brand-700
        sm:self-auto
      "
          >
            ดูหลักสูตรทั้งหมด
            <ArrowRight size={17} />
          </button>
        </div>
        <div
          className="
      mt-8 overflow-hidden rounded-card
      border border-border bg-surface
      shadow-card
    "
        >
          <CourseTrainingPieChart data={courseTrainingData} />
        </div>
        {/* ตาราง */}
        <div
          className="
      mt-8 overflow-hidden rounded-card
      border border-border bg-surface
      shadow-card
    "
        >
          {/* ต้องมี overflow-x-auto สำหรับโทรศัพท์ */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-slate-50">
                  <th className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                    วันที่
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                    หลักสูตร
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                    สถานที่
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                    ผู้ฝึกอบรม
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-muted">
                    ผู้เข้าอบรม
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentTrainings.map((training) => (
                  <tr
                    key={training.id}
                    className="
                border-b border-border
                transition last:border-b-0
                hover:bg-surface-hover
              "
                  >
                    {/* วันที่ */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-body">
                      {training.date}
                    </td>

                    {/* หลักสูตร */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-brand-600">
                          {training.courseCode}
                        </span>

                        <span className="text-sm font-semibold text-heading">
                          {training.courseName}
                        </span>
                      </div>
                    </td>

                    {/* สถานที่ */}
                    <td className="px-6 py-4 text-sm text-body">
                      {training.location}
                    </td>

                    {/* ผู้ฝึกอบรม */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-body">
                      {training.trainer}
                    </td>

                    {/* จำนวนผู้เข้าอบรม */}
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-heading">
                        {training.attendees}
                      </span>
                    </td>

                    {/* สถานะ */}
                    {/* <td className="whitespace-nowrap px-6 py-4">
                      {training.status === "synced" ? (
                        <span
                          className="
                      inline-flex items-center items-center gap-1.5
                      rounded-full bg-success-50 px-3 py-1.5
                      text-xs font-semibold text-success-600
                    "
                        >
                          <Check size={14} strokeWidth={3} />
                          ซิงก์แล้ว
                        </span>
                      ) : (
                        <span
                          className="
                      inline-flex items-center gap-1.5
                      rounded-full bg-accent-50 px-3 py-1.5
                      text-xs font-semibold text-accent-700
                    "
                        >
                          <Clock3 size={14} />
                          รอซิงก์ (ออฟไลน์)
                        </span>
                      )}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer ตาราง */}
          <div className="flex items-center justify-between border-t border-border bg-slate-50/70 px-6 py-3">
            <p className="text-xs text-muted">
              แสดง {recentTrainings.length} รายการล่าสุด
            </p>

            <p className="text-xs text-muted">ข้อมูลตัวอย่าง</p>
          </div>
        </div>
      </section>
    </>
  );
}
