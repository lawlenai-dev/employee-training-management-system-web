import { useMemo } from "react";
import { Chart } from "@highcharts/react";
import type { ComponentProps } from "react";
import { BookOpenCheck } from "lucide-react";

export type CourseTrainingDatum = {
  id: string | number;
  courseName: string;
  courseCode: string;
  employees: number; // distinct employee_id ที่ผ่านหลักสูตรนี้
  color?: string;
};
type Props = { data?: CourseTrainingDatum[] };

export default function CourseTrainingPieChart({ data = [] }: Props) {
  const options = useMemo<ComponentProps<typeof Chart>["options"]>(() => ({
    chart: { type: "bar", height: Math.max(320, data.length * 58 + 90), backgroundColor: "transparent", style: { fontFamily: "Sarabun, sans-serif" } },
    title: { text: undefined },
    xAxis: { categories: data.map(item => item.courseCode), title: { text: undefined }, lineWidth: 0, tickWidth: 0 },
    yAxis: { min: 0, allowDecimals: false, title: { text: "จำนวนผู้ผ่าน (คน)" }, gridLineColor: "#e5e7eb" },
    tooltip: { formatter() { const course = data[this.index]; return `${course?.courseCode ?? ""} ${course?.courseName ?? ""}<br/><b>ผ่าน ${this.y ?? 0} คน</b>`; } },
    plotOptions: { bar: { borderRadius: 5, pointPadding: 0.16, dataLabels: { enabled: true, format: "{y} คน" } } },
    series: [{ type: "bar", name: "ผู้ผ่านการอบรม", data: data.map(item => ({ y: Number(item.employees) || 0, color: item.color ?? "#2563eb" })) }],
    legend: { enabled: false }, credits: { enabled: false }, exporting: { enabled: false },
  }), [data]);

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
      <div className="flex items-start gap-3 border-b border-border p-5 sm:p-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><BookOpenCheck size={22} /></span>
        <div><h2 className="text-xl font-bold text-heading">พนักงานที่ผ่านการอบรมแยกตามหลักสูตร</h2><p className="mt-1 text-sm text-muted">จำนวนพนักงานไม่ซ้ำภายในแต่ละหลักสูตร · {data.length} หลักสูตรที่แสดง</p></div>
      </div>
      {data.length ? <div className="p-4 sm:p-6"><Chart options={options} /></div> : <p className="p-8 text-center text-sm text-muted">ยังไม่มีข้อมูลผลการอบรม</p>}
      <div className="border-t border-border bg-slate-50/60 px-5 py-4 text-sm text-muted">
        {data.map(item => <div key={item.id} className="flex justify-between gap-3 py-1"><span><strong className="text-heading">{item.courseCode}</strong> {item.courseName}</span><strong className="shrink-0 text-heading">{item.employees.toLocaleString("th-TH")} คน</strong></div>)}
      </div>
    </div>
  );
}
