import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  GraduationCap,
  QrCode,
  Users,
  UserX,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link, createSearchParams } from "react-router-dom";
import HeroCover from "../../components/HeroCover";
import { useState } from "react";
import { Chart } from "@highcharts/react";
import type { ComponentProps } from "react";
import CourseTrainingPieChart, {
  type CourseTrainingDatum,
} from "./component/CourseTrainingPieChart";

// ข้อมูลตัวอย่าง: เชื่อม API ด้วยข้อมูลจากช่วงเวลาเดียวกัน
const courseCatalog: CourseTrainingDatum[] = [
  {
    id: 1,
    courseCode: "SAF-001",
    courseName: "ความปลอดภัยในการทำงาน",
    employees: 142,
    color: "#2563eb",
  },
  {
    id: 2,
    courseCode: "QMS-002",
    courseName: "ระบบบริหารคุณภาพ",
    employees: 108,
    color: "#0d9488",
  },
  {
    id: 3,
    courseCode: "PRO-003",
    courseName: "มาตรฐานการผลิต",
    employees: 86,
    color: "#7c3aed",
  },
  {
    id: 4,
    courseCode: "FIR-004",
    courseName: "การป้องกันอัคคีภัย",
    employees: 71,
    color: "#ea580c",
  },
  {
    id: 5,
    courseCode: "MED-005",
    courseName: "การปฐมพยาบาลเบื้องต้น",
    employees: 39,
    color: "#db2777",
  },
];
const employees = Array.from({ length: 245 }, (_, index) => ({
  id: index + 1,
  companyId: index < 140 ? "company-a" : "company-b",
  active: index < 228,
  age: 20 + (index % 46),
  gender: index % 3 === 0 ? "หญิง" : "ชาย",
  nationality: index % 7 === 0 ? "ลาว" : "ไทย",
  position: ["ฝ่ายผลิต", "ช่างเทคนิค", "คลังสินค้า", "ธุรการ", "หัวหน้างาน"][
    index % 5
  ],
}));
const companies = [
  { id: "company-a", name: "บริษัท A (ตัวอย่าง)" },
  { id: "company-b", name: "บริษัท B (ตัวอย่าง)" },
];
// วันที่เป็นวันผ่านการอบรม เก็บแบบ YYYY-MM-DD เพื่อเปรียบเทียบช่วงวันได้โดยตรง
const completions = [
  ...courseCatalog.flatMap((course, courseIndex) =>
    Array.from({ length: course.employees }, (_, index) => ({
      employeeId: index + 1,
      courseId: course.id,
      date: `2026-${String(1 + ((index + courseIndex * 2) % 9)).padStart(2, "0")}-${String(1 + (index % 28)).padStart(2, "0")}`,
    })),
  ),
  ...Array.from({ length: 22 }, (_, index) => ({
    employeeId: 143 + index,
    courseId: courseCatalog[1].id,
    date: `2026-08-${String(index + 1).padStart(2, "0")}`,
  })),
];
type Summary = {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  link: string;
};
type Distribution = { name: string; count: number };

function DemographicChart({
  title,
  description,
  data,
  kind,
}: {
  title: string;
  description: string;
  data: Distribution[];
  kind: "bar" | "pie";
}) {
  const colors = [
    "#2563eb",
    "#0d9488",
    "#7c3aed",
    "#ea580c",
    "#db2777",
    "#0891b2",
  ];
  const options: ComponentProps<typeof Chart>["options"] = {
    chart: {
      type: kind,
      height: 290,
      backgroundColor: "transparent",
      style: { fontFamily: "Sarabun, sans-serif" },
    },
    title: { text: undefined },
    xAxis:
      kind === "bar"
        ? {
            categories: data.map((item) => item.name),
            title: { text: undefined },
          }
        : undefined,
    yAxis:
      kind === "bar"
        ? { min: 0, allowDecimals: false, title: { text: "จำนวนพนักงาน (คน)" } }
        : undefined,
    tooltip: { pointFormat: "<b>{point.y} คน</b>" },
    plotOptions: {
      pie: {
        innerSize: "58%",
        dataLabels: { enabled: true, format: "{point.name}: {point.y} คน" },
      },
      bar: { borderRadius: 4, dataLabels: { enabled: true, format: "{y} คน" } },
    },
    series:
      kind === "bar"
        ? [
            {
              type: "bar",
              name: "พนักงาน",
              data: data.map((item, index) => ({
                y: item.count,
                color: colors[index % colors.length],
              })),
            },
          ]
        : [
            {
              type: "pie",
              name: "พนักงาน",
              data: data.map((item, index) => ({
                name: item.name,
                y: item.count,
                color: colors[index % colors.length],
              })),
            },
          ],
    legend: { enabled: false },
    credits: { enabled: false },
  };
  return (
    <article className="min-w-0 rounded-card border border-border bg-surface p-5 shadow-card sm:p-6">
      <h3 className="text-lg font-bold text-heading">{title}</h3>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div className="mt-4">
        <Chart options={options} />
      </div>
    </article>
  );
}

export default function Dashboard() {
  const [companyId, setCompanyId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const invalidRange = Boolean(startTime && endTime && startTime > endTime);
  const selectedEmployees = employees.filter(
    (employee) => !companyId || employee.companyId === companyId,
  );
  const countBy = (
    labels: string[],
    getLabel: (employee: (typeof employees)[number]) => string,
  ): Distribution[] =>
    labels.map((name) => ({
      name,
      count: selectedEmployees.filter((employee) => getLabel(employee) === name)
        .length,
    }));
  const ageGroup = (age: number) =>
    age < 30
      ? "20–29 ปี"
      : age < 40
        ? "30–39 ปี"
        : age < 50
          ? "40–49 ปี"
          : age < 60
            ? "50–59 ปี"
            : "60 ปีขึ้นไป";
  const ageData = countBy(
    ["20–29 ปี", "30–39 ปี", "40–49 ปี", "50–59 ปี", "60 ปีขึ้นไป"],
    (employee) => ageGroup(employee.age),
  );
  const genderData = countBy(["ชาย", "หญิง"], (employee) => employee.gender);
  const nationalityData = countBy(
    ["ไทย", "ลาว"],
    (employee) => employee.nationality,
  );
  const positionData = countBy(
    ["ฝ่ายผลิต", "ช่างเทคนิค", "คลังสินค้า", "ธุรการ", "หัวหน้างาน"],
    (employee) => employee.position,
  );
  const activeIds = new Set(
    selectedEmployees
      .filter((employee) => employee.active)
      .map((employee) => employee.id),
  );
  const filteredCompletions = invalidRange
    ? []
    : completions.filter(
        (result) =>
          activeIds.has(result.employeeId) &&
          (!startTime || result.date >= startTime) &&
          (!endTime || result.date <= endTime),
      );
  const trained = new Set(
    filteredCompletions.map((result) => result.employeeId),
  ).size;
  const overview = {
    employees: selectedEmployees.length,
    active: activeIds.size,
    courses: 12,
    trained,
  };
  const courses = courseCatalog.map((course) => ({
    ...course,
    employees: new Set(
      filteredCompletions
        .filter((result) => result.courseId === course.id)
        .map((result) => result.employeeId),
    ).size,
  }));
  const summaries: Summary[] = [
    {
      title: "พนักงานทั้งหมด",
      value: overview.employees,
      description: "พนักงานที่ขึ้นทะเบียนในระบบ",
      icon: Users,
      link: "/employees",
    },
    {
      title: "พนักงาน Active",
      value: overview.active,
      description: "พนักงานที่มีสถานะ Active",
      icon: CheckCircle2,
      link: "/employees",
    },
    {
      title: "หลักสูตรทั้งหมด",
      value: overview.courses,
      description: "หลักสูตรที่บันทึกในระบบ",
      icon: BookOpenCheck,
      link: "/courses",
    },
    {
      title: "พนักงานที่ผ่านการอบรม",
      value: overview.trained,
      description: "Active และผ่านอย่างน้อย 1 หลักสูตร",
      icon: GraduationCap,
      link: "/employees",
    },
  ];
  const coverage = overview.active
    ? Math.round((overview.trained / overview.active) * 100)
    : 0;

  const untrainedEmployeesUrl = `/employees?${createSearchParams({
    trainingStatus: "not-passed",
    ...(companyId
      ? { supplierId: companyId === "company-a" ? "101" : "102" }
      : {}),
    ...(startTime ? { startTime } : {}),
    ...(endTime ? { endTime } : {}),
  })}`;
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
        description="จัดการหลักสูตร ลงทะเบียนพนักงาน และบันทึกการเข้าร่วมอบรม ด้วยรหัสพนักงานหรือ QR Code"
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
      <main className="relative z-10 -mt-12 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <section
            aria-label="ตัวกรอง Dashboard"
            className="rounded-card border border-border bg-surface p-5 shadow-card sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-bold text-heading">ตัวกรองข้อมูล</h2>
              <button
                type="button"
                onClick={() => {
                  setCompanyId("");
                  setStartTime("");
                  setEndTime("");
                }}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                ล้างตัวกรอง
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block text-sm font-medium text-heading">
                บริษัท
                <select
                  value={companyId}
                  onChange={(event) => setCompanyId(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-body focus:border-brand-600 focus:outline-none"
                >
                  <option value="">ทุกบริษัท</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-heading">
                Start time
                <input
                  type="date"
                  value={startTime}
                  max={endTime || undefined}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-body focus:border-brand-600 focus:outline-none"
                />
              </label>
              <label className="block text-sm font-medium text-heading">
                End time
                <input
                  type="date"
                  value={endTime}
                  min={startTime || undefined}
                  onChange={(event) => setEndTime(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-body focus:border-brand-600 focus:outline-none"
                />
              </label>
            </div>
            {/* {invalidRange && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                วันสิ้นสุดต้องไม่ก่อนวันเริ่มต้น
              </p>
            )} */}
          </section>
          <section
            aria-label="ตัวเลขภาพรวม"
            className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {summaries.map(
              ({ title, value, description, icon: Icon, link }) => (
                <Link
                  key={title}
                  to={link}
                  className="group rounded-card border border-border bg-surface p-5 shadow-card transition hover:-translate-y-1 hover:border-brand-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-muted">{title}</p>
                      <p className="mt-3 text-3xl font-bold text-heading">
                        {value.toLocaleString("th-TH")}
                      </p>
                      <p className="mt-1 text-xs text-muted">{description}</p>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon size={21} />
                    </span>
                  </div>
                </Link>
              ),
            )}
          </section>
          <section aria-labelledby="demographic-title" className="mt-8">
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <DemographicChart
                title="ช่วงอายุ"
                description="จำนวนพนักงานในแต่ละช่วงอายุ"
                data={ageData}
                kind="bar"
              />
              <DemographicChart
                title="เพศ"
                description="จำนวนพนักงานแยกตามเพศ"
                data={genderData}
                kind="pie"
              />
              <DemographicChart
                title="สัญชาติ"
                description="จำนวนพนักงานสัญชาติไทยและลาว"
                data={nationalityData}
                kind="pie"
              />
              <DemographicChart
                title="ตำแหน่ง"
                description="จำนวนพนักงานในแต่ละตำแหน่ง"
                data={positionData}
                kind="bar"
              />
            </div>
          </section>
          <header className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h4 className="mt-2 text-3xl font-bold text-heading">
                ภาพรวมการอบรมพนักงาน
              </h4>
              <p className="mt-2 text-sm text-muted">
                ติดตามสถานะพนักงานและผลการอบรมของแต่ละหลักสูตร
              </p>
            </div>
          </header>

          <section
            aria-label="ประเด็นที่ควรติดตาม"
            className="mt-6 grid gap-4 lg:grid-cols-3"
          >
            <div className="rounded-card border border-border bg-surface p-6 shadow-card lg:col-span-2">
              <h2 className="font-bold text-heading">ความครอบคลุมการอบรม</h2>
              <p className="mt-2 text-sm text-muted">
                พนักงาน Active ที่ผ่านอย่างน้อยหนึ่งหลักสูตร
              </p>
              <div className="mt-4 flex items-end justify-between">
                <strong className="text-3xl text-heading">{coverage}%</strong>
                <span className="text-sm text-muted">
                  {overview.trained} / {overview.active} คน
                </span>
              </div>
              <div
                className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label="ความครอบคลุมการอบรม"
                aria-valuenow={coverage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-brand-600"
                  style={{ width: `${coverage}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-muted">
                เกณฑ์นี้หมายถึงผ่านอย่างน้อย 1 หลักสูตร
                ไม่ได้หมายถึงผ่านครบทุกหลักสูตรที่จำเป็น
              </p>
            </div>

            <Link
              to={untrainedEmployeesUrl}
              className="
    group block rounded-card border border-border bg-surface
    p-6 shadow-card transition-colors duration-200
    hover:border-orange-300 
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-orange-500
  "
            >
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-heading">
                  พนักงานสถานะ Active ที่ยังไม่ผ่านหลักสูตรใด
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-orange-600 transition-transform group-hover:translate-x-1"
                  />
                </span>

                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <UserX size={22} />
                </span>
              </div>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-bold leading-none text-orange-600">
                  {(overview.active - overview.trained).toLocaleString("th-TH")}
                </span>
                <span className="pb-0.5 text-sm font-medium text-muted">
                  คน
                </span>
              </div>

              <p className="mt-3 text-xs text-muted">
                จากพนักงาน Active {overview.active.toLocaleString("th-TH")} คน
              </p>
            </Link>
          </section>

          <section className="mt-8" aria-label="ผู้ผ่านการอบรมแยกตามหลักสูตร">
            <CourseTrainingPieChart data={courses} />
            <p className="mt-3 text-xs text-muted">
              แสดง {courses.length} จาก {overview.courses} หลักสูตร ·
              พนักงานคนเดียวอาจผ่านหลายหลักสูตร
              จึงไม่ควรนำยอดรายหลักสูตรมารวมเป็นจำนวนพนักงานทั้งหมด
            </p>
            <Link
              to="/courses"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              ดูหลักสูตรทั้งหมด <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
