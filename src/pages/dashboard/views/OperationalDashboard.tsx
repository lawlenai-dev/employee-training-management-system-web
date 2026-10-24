import { useState } from "react";
import { dashboardCatalog } from "../dashboardConfig";
import {
  camps,
  demoCompanies,
  demoIncidents,
  demoPeople,
} from "../dashboardDemo";
import { DashboardChart, MetricCards } from "../component/DashboardWidgets";

type Kind = "residential" | "health" | "accident";
const group = <T,>(rows: T[], labels: string[], get: (row: T) => string) =>
  labels.map((name) => ({
    name,
    count: rows.filter((row) => get(row) === name).length,
  }));
const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300";

export default function OperationalDashboard({ kind }: { kind: Kind }) {
  const theme = dashboardCatalog.find((item) => item.id === kind)!;
  const [company, setCompany] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const invalid = Boolean(start && end && start > end);
  const people = demoPeople.filter(
    (row) => !company || row.companyId === company,
  );
  const incidents = invalid
    ? []
    : demoIncidents.filter(
        (row) =>
          (!company || row.companyId === company) &&
          (!start || row.date >= start) &&
          (!end || row.date <= end),
      );
  const residents = people.filter((row) => row.campId !== null);
  const capacity = camps.reduce((sum, row) => sum + row.capacity, 0);
  const occupied = demoPeople.filter((row) => row.campId !== null).length;
  const checked = people.filter((row) => row.health !== "ยังไม่ตรวจ").length;
  const follow = people.filter((row) => row.health === "ต้องติดตาม").length;
  const closed = incidents.filter((row) => row.status === "ปิดแล้ว").length;
  const campRows = camps.map((camp) => ({
    ...camp,
    total: demoPeople.filter((row) => row.campId === camp.id).length,
    selected: residents.filter((row) => row.campId === camp.id).length,
  }));
  const metrics =
    kind === "residential"
      ? [
          {
            label: "ผู้พักอาศัย",
            value: residents.length,
            hint: "คน • ตามบริษัทที่เลือก",
          },
          {
            label: "พนักงานไม่พักในแคมป์",
            value: people.length - residents.length,
            hint: "คน • ตามบริษัทที่เลือก",
          },
          {
            label: "ความจุแคมป์ทั้งหมด",
            value: capacity,
            hint: "เตียง • รวมทุกบริษัท",
          },
          {
            label: "เตียงว่างทั้งหมด",
            value: capacity - occupied,
            hint: "เตียง • รวมทุกบริษัท",
          },
        ]
      : kind === "health"
        ? [
            {
              label: "พนักงานทั้งหมด",
              value: people.length,
              hint: "คน • ตามบริษัทที่เลือก",
            },
            {
              label: "ตรวจสุขภาพแล้ว",
              value: checked,
              hint: "คน • รวมผลปกติและต้องติดตาม",
            },
            {
              label: "ต้องติดตาม",
              value: follow,
              hint: "คน • ตามผลตรวจล่าสุด",
            },
            {
              label: "ความครอบคลุมการตรวจ",
              value: `${people.length ? Math.round((checked / people.length) * 100) : 0}%`,
              hint: "ตรวจแล้ว / พนักงานที่เลือก",
            },
          ]
        : [
            {
              label: "เหตุการณ์ทั้งหมด",
              value: incidents.length,
              hint: "รายการ • ตามช่วงวันที่เกิดเหตุ",
            },
            {
              label: "อยู่ระหว่างดำเนินการ",
              value: incidents.length - closed,
              hint: "รายการ • ยังไม่ปิด",
            },
            {
              label: "ปิดการดำเนินการแล้ว",
              value: closed,
              hint: "รายการ • ตามตัวกรอง",
            },
            {
              label: "เหตุการณ์ระดับปานกลาง",
              value: incidents.filter((row) => row.severity === "ปานกลาง")
                .length,
              hint: "รายการ • ตามตัวกรอง",
            },
          ];
  return (
    <div className="space-y-6">
      <section
        aria-label="ตัวกรองข้อมูล"
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-slate-900">ตัวกรองข้อมูล</h2>
          <button
            type="button"
            onClick={() => {
              setCompany("");
              setStart("");
              setEnd("");
            }}
            className="rounded px-2 py-1 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            style={{ color: theme.color }}
          >
            ล้างตัวกรอง
          </button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="text-sm text-slate-600">
            บริษัท
            <select
              className={inputClass}
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            >
              <option value="">ทุกบริษัท</option>
              {demoCompanies.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                </option>
              ))}
            </select>
          </label>
          {kind === "accident" && (
            <>
              <label className="text-sm text-slate-600">
                วันที่เกิดเหตุเริ่มต้น
                <input
                  type="date"
                  className={inputClass}
                  value={start}
                  max={end || undefined}
                  onChange={(event) => setStart(event.target.value)}
                />
              </label>
              <label className="text-sm text-slate-600">
                วันที่เกิดเหตุสิ้นสุด
                <input
                  type="date"
                  className={inputClass}
                  value={end}
                  min={start || undefined}
                  onChange={(event) => setEnd(event.target.value)}
                />
              </label>
            </>
          )}
        </div>
        {invalid && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            วันสิ้นสุดต้องไม่ก่อนวันเริ่มต้น
          </p>
        )}
        <p className="mt-3 text-xs leading-5 text-slate-500">
          {kind === "residential"
            ? "จำนวนผู้พักกรองตามบริษัท • ความจุ เตียงว่าง และอัตราเข้าพักรวมทุกบริษัท เพื่อสะท้อนพื้นที่ที่ใช้ร่วมกัน"
            : kind === "health"
              ? "แสดงสถานะสุขภาพล่าสุดของพนักงานในชุดตัวอย่าง ไม่ใช่ประวัติผลตรวจตามช่วงเวลา"
              : "แสดงเหตุการณ์ตามบริษัทและวันที่เกิดเหตุที่เลือก"}
        </p>
      </section>
      <MetricCards items={metrics} color={theme.color} soft={theme.soft} />
      <div className="grid gap-5 lg:grid-cols-2">
        {kind === "residential" ? (
          <>
            <DashboardChart
              title="ผู้พักอาศัยแยกตามแคมป์"
              description="จำนวนคนตามบริษัทที่เลือก"
              data={campRows.map((row) => ({
                name: row.name,
                count: row.selected,
              }))}
              color={theme.color}
            />
            <DashboardChart
              title="สัดส่วนการอยู่อาศัย"
              description="พนักงานตามบริษัทที่เลือก"
              data={[
                { name: "พักในแคมป์", count: residents.length },
                {
                  name: "ไม่พักในแคมป์",
                  count: people.length - residents.length,
                },
              ]}
              color={theme.color}
              kind="pie"
            />
          </>
        ) : kind === "health" ? (
          <>
            <DashboardChart
              title="สถานะการตรวจสุขภาพ"
              description="หนึ่งสถานะล่าสุดต่อพนักงานหนึ่งคน"
              data={group(
                people,
                ["ปกติ", "ต้องติดตาม", "ยังไม่ตรวจ"],
                (row) => row.health,
              )}
              color={theme.color}
              kind="pie"
            />
            <DashboardChart
              title="กรุ๊ปเลือด"
              description="จำนวนพนักงานแยกตามกรุ๊ปเลือดในชุดตัวอย่าง"
              data={group(people, ["A", "B", "O", "AB"], (row) => row.blood)}
              color={theme.color}
            />
          </>
        ) : (
          <>
            <DashboardChart
              title="เหตุการณ์รายเดือน"
              description="พฤษภาคม–ตุลาคม 2026 • ตามตัวกรอง"
              data={group(
                incidents,
                ["05", "06", "07", "08", "09", "10"],
                (row) => row.date.slice(5, 7),
              ).map((row, index) => ({
                ...row,
                name: ["พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค."][index],
              }))}
              color={theme.color}
              kind="column"
              unit="รายการ"
            />
            <DashboardChart
              title="ประเภทเหตุการณ์"
              description="จำนวนเหตุการณ์ในช่วงที่เลือก"
              data={group(
                incidents,
                ["บาดเจ็บเล็กน้อย", "ทรัพย์สินเสียหาย", "เกือบเกิดอุบัติเหตุ"],
                (row) => row.type,
              )}
              color={theme.color}
              kind="pie"
              unit="รายการ"
            />
          </>
        )}
      </div>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-bold text-slate-900">
            {kind === "residential"
              ? "การใช้พื้นที่แคมป์"
              : kind === "health"
                ? "สรุปสุขภาพแยกตามบริษัท"
                : "รายการเหตุการณ์"}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            ข้อมูลตัวอย่าง •{" "}
            {kind === "residential"
              ? "ความจุและเตียงว่างคำนวณจากผู้พักทุกบริษัท"
              : "ตามตัวกรองด้านบน"}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                {(kind === "residential"
                  ? [
                      "แคมป์",
                      "ผู้พักที่เลือก",
                      "ผู้พักทั้งหมด",
                      "ความจุ",
                      "เตียงว่าง",
                      "อัตราเข้าพักรวม",
                    ]
                  : kind === "health"
                    ? ["บริษัท", "พนักงาน", "ปกติ", "ต้องติดตาม", "ยังไม่ตรวจ"]
                    : [
                        "เลขที่เหตุการณ์",
                        "วันที่เกิดเหตุ",
                        "บริษัท",
                        "ประเภท",
                        "ความรุนแรง",
                        "สถานะ",
                      ]
                ).map((label) => (
                  <th
                    key={label}
                    scope="col"
                    className="px-5 py-3 font-semibold"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {kind === "residential" ? (
                campRows.map((row) => (
                  <tr key={row.id}>
                    {[
                      row.name,
                      row.selected,
                      row.total,
                      row.capacity,
                      row.capacity - row.total,
                      `${Math.round((row.total / row.capacity) * 100)}%`,
                    ].map((value, index) => (
                      <td key={index} className="px-5 py-4">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))
              ) : kind === "health" ? (
                demoCompanies
                  .filter((row) => !company || row.id === company)
                  .map((row) => {
                    const members = people.filter(
                      (person) => person.companyId === row.id,
                    );
                    return (
                      <tr key={row.id}>
                        {[
                          row.name,
                          members.length,
                          ...["ปกติ", "ต้องติดตาม", "ยังไม่ตรวจ"].map(
                            (status) =>
                              members.filter(
                                (person) => person.health === status,
                              ).length,
                          ),
                        ].map((value, index) => (
                          <td key={index} className="px-5 py-4">
                            {value}
                          </td>
                        ))}
                      </tr>
                    );
                  })
              ) : incidents.length ? (
                [...incidents]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((row) => (
                    <tr key={row.id}>
                      {[
                        row.id,
                        row.date,
                        demoCompanies.find(
                          (companyRow) => companyRow.id === row.companyId,
                        )?.name,
                        row.type,
                        row.severity,
                        row.status,
                      ].map((value, index) => (
                        <td key={index} className="px-5 py-4">
                          {index === 5 ? (
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${row.status === "ปิดแล้ว" ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"}`}
                            >
                              {value}
                            </span>
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    ไม่พบเหตุการณ์ตามตัวกรอง
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
