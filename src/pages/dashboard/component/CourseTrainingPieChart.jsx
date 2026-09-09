import { useMemo } from "react";
import { Chart } from "@highcharts/react";
import {
  BookOpenCheck,
  TrendingUp,
} from "lucide-react";

export default function CourseTrainingPieChart({
  data = [],
}) {
  const total = data.reduce(
    (sum, item) => sum + Number(item.employees || 0),
    0,
  );

  const options = useMemo(
    () => ({
      chart: {
        type: "pie",
        height: 380,
        backgroundColor: "transparent",
        spacing: [10, 10, 10, 10],

        style: {
          fontFamily: "Sarabun, sans-serif",
        },
      },

      title: {
        text: `
          <div style="text-align:center">
            <div style="
              font-size:34px;
              font-weight:700;
              color:#111827;
              line-height:1;
            ">
              ${total}
            </div>

            <div style="
              margin-top:8px;
              font-size:12px;
              font-weight:400;
              color:#6b7280;
            ">
              การเข้าอบรม
            </div>
          </div>
        `,
        useHTML: true,
        align: "center",
        verticalAlign: "middle",
        floating: true,
        y: 12,
      },

      tooltip: {
        useHTML: true,
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderRadius: 12,
        shadow: true,

        formatter() {
          const percentage =
            total > 0
              ? ((this.y / total) * 100).toFixed(1)
              : 0;

          return `
            <div style="padding:4px">
              <div style="font-size:13px;font-weight:700">
                ${this.point.courseCode}
              </div>

              <div style="
                margin-top:3px;
                max-width:220px;
                color:#6b7280;
                font-size:12px;
              ">
                ${this.point.name}
              </div>

              <div style="margin-top:8px">
                <b>${this.y} คน</b>
                <span style="color:#6b7280">
                  (${percentage}%)
                </span>
              </div>
            </div>
          `;
        },
      },

      plotOptions: {
        pie: {
          innerSize: "68%",
          size: "90%",
          borderWidth: 4,
          borderColor: "#ffffff",
          borderRadius: 7,
          cursor: "pointer",

          dataLabels: {
            enabled: false,
          },

          states: {
            hover: {
              brightness: 0.05,
              halo: {
                size: 8,
                opacity: 0.08,
              },
            },
          },
        },
      },

      series: [
        {
          type: "pie",
          name: "ผู้เข้าอบรม",

          data: data.map((item) => ({
            id: item.id,
            name: item.courseName,
            courseCode: item.courseCode,
            y: Number(item.employees || 0),
            color: item.color,
          })),
        },
      ],

      credits: {
        enabled: false,
      },

      legend: {
        enabled: false,
      },

      exporting: {
        enabled: false,
      },
    }),
    [data, total],
  );

  return (
    <section className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
      <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <BookOpenCheck size={22} />
          </span>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              Training Analytics
            </p>

            <h2 className="mt-1 text-xl font-bold text-heading">
              สัดส่วนการเข้าอบรมแยกตามหลักสูตร
            </h2>

            <p className="mt-1 text-sm text-muted">
              เปรียบเทียบจำนวนผู้เข้าอบรมของแต่ละหลักสูตร
            </p>
          </div>
        </div>

        <span className="inline-flex self-start items-center gap-2 rounded-full bg-success-50 px-3 py-1.5 text-xs font-semibold text-success-600">
          <TrendingUp size={15} />
          ข้อมูลปี 2026
        </span>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
        {/* Highcharts */}
        <div className="min-w-0 px-3 py-5">
          <Chart options={options} />
        </div>

        {/* Legend */}
        <div className="border-t border-border bg-slate-50/60 p-5 lg:border-l lg:border-t-0 sm:p-6">
          <h3 className="font-bold text-heading">
            รายละเอียดหลักสูตร
          </h3>

          <p className="mt-1 text-xs text-muted">
            ทั้งหมด {data.length} หลักสูตร
          </p>

          <div className="mt-5 space-y-3">
            {data.map((item) => {
              const percentage =
                total > 0
                  ? ((item.employees / total) * 100).toFixed(1)
                  : 0;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-white px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-heading">
                          {item.courseCode}{" "}
                          <span className="font-normal text-muted">
                            {item.courseName}
                          </span>
                        </p>

                        <p className="shrink-0 text-sm font-bold text-heading">
                          {item.employees} คน
                        </p>
                      </div>

                      <div className="mt-2 flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>

                        <p className="w-11 text-right text-xs font-semibold text-muted">
                          {percentage}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}