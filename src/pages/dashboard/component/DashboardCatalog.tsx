import { ArrowUpRight, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import { dashboardCatalog, type DashboardId } from "../dashboardConfig";
import { camps, demoIncidents, demoPeople } from "../dashboardDemo";

const number = (value: number) => value.toLocaleString("th-TH");
const percent = (value: number, total: number) =>
  total ? Math.round((value / total) * 100) : 0;
const total = demoPeople.length;
const active = demoPeople.filter((person) => person.active).length;
const residents = demoPeople.filter((person) => person.campId !== null).length;
const capacity = camps.reduce((sum, camp) => sum + camp.capacity, 0);
const checked = demoPeople.filter(
  (person) => person.health !== "ยังไม่ตรวจ",
).length;
const follow = demoPeople.filter(
  (person) => person.health === "ต้องติดตาม",
).length;
const closed = demoIncidents.filter((row) => row.status === "ปิดแล้ว").length;

const summaries: Record<
  DashboardId,
  {
    label: string;
    value: number;
    unit: string;
    progressLabel: string;
    progress: number;
    secondary: { label: string; value: number; unit: string }[];
  }
> = {
  manpower: {
    label: "พนักงานทั้งหมด",
    value: total,
    unit: "คน",
    progressLabel: "สัดส่วนพนักงาน Active",
    progress: percent(active, total),
    secondary: [
      { label: "พนักงาน Active", value: active, unit: "คน" },
      { label: "พนักงาน Inactive", value: total - active, unit: "คน" },
    ],
  },
  residential: {
    label: "ผู้พักอาศัยในแคมป์",
    value: residents,
    unit: "คน",
    progressLabel: "อัตราการใช้ความจุแคมป์",
    progress: percent(residents, capacity),
    secondary: [
      { label: "เตียงว่าง", value: capacity - residents, unit: "เตียง" },
      { label: "แคมป์ทั้งหมด", value: camps.length, unit: "แคมป์" },
    ],
  },
  health: {
    label: "ตรวจสุขภาพแล้ว",
    value: checked,
    unit: "คน",
    progressLabel: "ความครอบคลุมการตรวจสุขภาพ",
    progress: percent(checked, total),
    secondary: [
      { label: "ต้องติดตาม", value: follow, unit: "คน" },
      { label: "ยังไม่ตรวจ", value: total - checked, unit: "คน" },
    ],
  },
  accident: {
    label: "เหตุการณ์ทั้งหมด",
    value: demoIncidents.length,
    unit: "รายการ",
    progressLabel: "สัดส่วนเหตุการณ์ที่ปิดแล้ว",
    progress: percent(closed, demoIncidents.length),
    secondary: [
      {
        label: "ยังไม่ปิด",
        value: demoIncidents.length - closed,
        unit: "รายการ",
      },
      { label: "ปิดแล้ว", value: closed, unit: "รายการ" },
    ],
  },
};

export default function DashboardCatalog({
  href,
}: {
  href: (view?: string) => string;
}) {
  return (
    <section
      aria-label="Dashboard catalog"
      className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <LayoutGrid size={20} aria-hidden="true" />
          </span>
          <div>
            <h2
              tabIndex={-1}
              id="dashboard-catalog-heading"
              className="font-bold text-slate-900 outline-none"
            >
              เลือกภาพรวมที่ต้องการดู
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              ข้อมูลตัวอย่าง • ตัวเลขรวมทุกบริษัท
            </p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
          4 Dashboards
        </span>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
        {dashboardCatalog.map((item) => {
          const Icon = item.icon;
          const summary = summaries[item.id];
          return (
            <Link
              key={item.id}
              to={href(item.id)}
              className="group relative min-w-0 overflow-hidden rounded-[28px] border p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 sm:p-8"
              style={{ backgroundColor: item.soft, borderColor: item.border }}
            >
              <Icon
                aria-hidden="true"
                size={190}
                strokeWidth={1}
                className="pointer-events-none absolute -right-8 -top-7 rotate-[-12deg] opacity-[0.045]"
                style={{ color: item.color }}
              />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80"
                    style={{ color: item.color }}
                  >
                    <Icon size={23} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold leading-6 text-slate-900 sm:text-lg">
                      {item.title} Dashboard
                    </h3>
                    <p className="mt-1 text-xs text-slate-600">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white bg-white/60 text-slate-600 transition group-hover:bg-white">
                  <ArrowUpRight size={19} aria-hidden="true" />
                </span>
              </div>
              <div className="relative mt-8">
                <p className="text-sm text-slate-600">{summary.label}</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-3">
                  <strong
                    className="text-[64px] font-semibold leading-none tracking-tight tabular-nums sm:text-[76px]"
                    style={{ color: item.color }}
                  >
                    {number(summary.value)}
                  </strong>
                  <span className="text-sm font-medium text-slate-600">
                    {summary.unit}
                  </span>
                </div>
              </div>
              <div className="relative mt-6">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-600">
                    {summary.progressLabel}
                  </span>
                  <strong
                    className="text-sm tabular-nums"
                    style={{ color: item.color }}
                  >
                    {summary.progress}%
                  </strong>
                </div>
                <div
                  aria-hidden="true"
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/80"
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${summary.progress}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
              <dl className="relative mt-6 grid grid-cols-2 gap-3">
                {summary.secondary.map((metric) => (
                  <div
                    key={metric.label}
                    className="min-w-0 rounded-2xl border border-white/80 bg-white/65 p-4"
                  >
                    <dt className="text-xs leading-5 text-slate-600">
                      {metric.label}
                    </dt>
                    <dd className="mt-2 flex flex-wrap items-baseline gap-x-2">
                      <strong className="text-2xl font-semibold tabular-nums text-slate-900 sm:text-3xl">
                        {number(metric.value)}
                      </strong>
                      <span className="text-xs text-slate-500">
                        {metric.unit}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
              <div
                className="relative mt-5 flex items-center justify-between gap-3 border-t pt-4"
                style={{ borderColor: item.border }}
              >
                <p className="max-w-[75%] text-xs leading-5 text-slate-600">
                  {item.description}
                </p>
                <span
                  className="shrink-0 text-xs font-bold"
                  style={{ color: item.color }}
                >
                  ดูรายละเอียด <span aria-hidden="true">↗</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      <p className="mt-5 text-xs leading-6 text-slate-500">
        หมายเหตุ: ผู้ที่ต้องติดตามสุขภาพรวมอยู่ในจำนวนผู้ตรวจแล้ว •
        ข้อมูลตัวอย่างยังไม่ได้เชื่อม API
      </p>
    </section>
  );
}
