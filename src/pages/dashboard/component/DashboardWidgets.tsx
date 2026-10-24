import type { ComponentProps } from "react";
import { Chart } from "@highcharts/react";

export type Distribution = { name: string; count: number };
export function DashboardChart({
  title,
  description,
  data,
  color,
  kind = "bar",
  unit = "คน",
}: {
  title: string;
  description: string;
  data: Distribution[];
  color: string;
  kind?: "bar" | "pie" | "column";
  unit?: string;
}) {
  const options: ComponentProps<typeof Chart>["options"] = {
    chart: {
      type: kind,
      height: 290,
      backgroundColor: "transparent",
      style: { fontFamily: "inherit" },
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: kind === "pie" },
    xAxis: {
      categories: data.map((row) => row.name),
      title: { text: undefined },
    },
    yAxis: { min: 0, allowDecimals: false, title: { text: `จำนวน (${unit})` } },
    tooltip: { pointFormat: `<b>{point.y} ${unit}</b>` },
    plotOptions: {
      pie: {
        innerSize: "65%",
        showInLegend: true,
        dataLabels: { enabled: false },
      },
      bar: { borderRadius: 5, dataLabels: { enabled: true } },
      column: { borderRadius: 5, dataLabels: { enabled: true } },
    },
    series:
      kind === "pie"
        ? [
            {
              type: "pie",
              name: "จำนวน",
              data: data.map((row, i) => ({
                name: row.name,
                y: row.count,
                color: [color, "#94a3b8", "#cbd5e1", "#e2e8f0"][i % 4],
              })),
            },
          ]
        : kind === "column"
          ? [
              {
                type: "column",
                name: "จำนวน",
                color,
                data: data.map((row) => row.count),
              },
            ]
          : [
              {
                type: "bar",
                name: "จำนวน",
                color,
                data: data.map((row) => row.count),
              },
            ],
  };
  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="mb-4 mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
      {data.some((row) => row.count > 0) ? (
        <Chart options={options} />
      ) : (
        <p className="flex h-[290px] items-center justify-center text-sm text-slate-500">
          ไม่พบข้อมูลตามตัวกรอง
        </p>
      )}
    </article>
  );
}
export function MetricCards({
  items,
  color,
  soft,
}: {
  items: { label: string; value: string | number; hint: string }[];
  color: string;
  soft: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-slate-600">{item.label}</p>
          <p
            className="mt-4 text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl"
            style={{ color }}
          >
            {typeof item.value === "number"
              ? item.value.toLocaleString("th-TH")
              : item.value}
          </p>
          <p
            className="mt-3 inline-block rounded-lg px-2 py-1 text-xs text-slate-600"
            style={{ background: soft }}
          >
            {item.hint}
          </p>
        </article>
      ))}
    </div>
  );
}
