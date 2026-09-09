import {
  Building2,
  BriefcaseBusiness,
  IdCard,
  Plus,
  Printer,
  QrCode,
  Search,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState, useMemo } from "react";
import { createEmployee, getEmployees } from "../../api";
import { employeesMockup } from "../../data";
import {
  Button,
  Card,
  Empty,
  Input,
  Loading,
  PageTitle,
} from "../../components/Ui";
import HeroCover from "../../components/HeroCover";
import DataTable from "../../components/DataTable";
import EmployeeModal from "./components/EmployeeModal";

const initial = {
  employee_code: "",
  first_name: "",
  last_name: "",
  department: "",
  position: "",
};

export default function Employees() {
  const [employees, setEmployees] = useState(employeesMockup),
    [search, setSearch] = useState(""),
    [show, setShow] = useState(false),
    [selected, setSelected] = useState(null),
    [form, setForm] = useState(initial),
    [error, setError] = useState("");
  const load = (q = search) =>
    // getEmployees(q).then((r) => setEmployees(r.data));
    useEffect(() => {
      const timer = setTimeout(() => load(search), 250);
      return () => clearTimeout(timer);
    }, [search]);
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createEmployee(form);
      setForm(initial);
      setShow(false);
      await load("");
    } catch (e) {
      setError(e.message);
    }
  };
  const activeCount =
    employees?.filter((employee) => Number(employee.is_active)).length ?? 0;

  const employeeColumns = useMemo(
    () => [
      {
        header: "รหัสพนักงาน",
        accessor: "employee_code",
        cell: ({ value }) => (
          <span className="inline-flex items-center gap-2 font-mono font-bold text-brand-600">
            <IdCard size={17} />
            {value}
          </span>
        ),
      },
      {
        header: "ชื่อ–นามสกุล",
        accessor: (row) =>
          `${row.first_name || ""} ${row.last_name || ""}`.trim(),
        cell: ({ value }) => (
          <div className="flex items-center gap-3">
            <div>
              <p className="font-semibold text-heading">{value || "-"}</p>
              <p className="mt-0.5 text-xs text-muted">พนักงาน CHK</p>
            </div>
          </div>
        ),
      },
      {
        id: "department_position",
        header: "แผนก / ตำแหน่ง",
        accessor: (row) => ({
          department: row.department,
          position: row.position,
        }),
        cell: ({ value }) => (
          <div className="space-y-1">
            <p className="flex items-center gap-2 font-medium text-body">
              <Building2 size={15} className="text-slate-400" />
              {value.department || "ไม่ระบุแผนก"}
            </p>

            <p className="flex items-center gap-2 text-xs text-muted">
              <BriefcaseBusiness size={14} className="text-slate-400" />
              {value.position || "ไม่ระบุตำแหน่ง"}
            </p>
          </div>
        ),
      },
      {
        header: "สถานะ",
        accessor: "is_active",
        cell: ({ value }) => {
          const isActive = Number(value) === 1;

          return (
            <span
              className={`
              inline-flex items-center gap-2 rounded-full px-3 py-1.5
              text-xs font-semibold
              ${
                isActive
                  ? "bg-success-50 text-success-600"
                  : "bg-slate-100 text-slate-500"
              }
            `}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive ? "bg-success-600" : "bg-slate-400"
                }`}
              />

              {isActive ? "ใช้งาน" : "ปิดใช้งาน"}
            </span>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      <HeroCover
        size="small"
        image="/training-cover.jpg"
        imagePosition="center"
        eyebrow="Employee Management"
        eyebrowIcon={UsersRound}
        title="ข้อมูลพนักงาน"
        highlight="และบัตร QR"
        description="จัดการข้อมูลพนักงานและสร้างบัตร QR สำหรับเช็กชื่อเข้าอบรม"
      />

      <section className="relative z-10 -mt-10 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <Card className="mb-6 border-0 p-5 shadow-lg shadow-slate-900/5 sm:p-6">
            <PageTitle
              title="พนักงานและบัตร QR"
              subtitle="เพิ่มพนักงาน ค้นหาข้อมูล และพิมพ์ QR สำหรับใช้เช็กชื่อ"
              action={
                <Button onClick={() => setShow(true)}>
                  <Plus size={18} />
                  เพิ่มพนักงาน
                </Button>
              }
            />

            {/* Summary และ Search */}
            <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-3">
                <div className="rounded-xl bg-brand-50 px-4 py-2">
                  <p className="text-xs text-muted">พนักงานทั้งหมด</p>
                  <p className="mt-0.5 font-bold text-brand-700">
                    {employees?.length ?? 0} คน
                  </p>
                </div>

                <div className="rounded-xl bg-success-50 px-4 py-2">
                  <p className="text-xs text-muted">กำลังใช้งาน</p>
                  <p className="mt-0.5 font-bold text-success-600">
                    {activeCount} คน
                  </p>
                </div>
              </div>

              <div className="relative w-full lg:max-w-md">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="ค้นหารหัส ชื่อ แผนก หรือตำแหน่ง..."
                  className="
                  h-11 w-full rounded-control border border-border
                  bg-white pl-10 pr-4 text-sm text-body
                  outline-none transition placeholder:text-placeholder
                  focus:border-brand-500 focus:ring-4 focus:ring-brand-100
                "
                />
              </div>
            </div>
          </Card>

          {/* Add employee form */}
          {show && (
            <EmployeeModal
              open={show}
              onClose={() => setShow(false)}
              form={form}
              setForm={setForm}
              onSubmit={submit}
              error={error}
            />
          )}

          {/* Employee table */}
          {employees === null ? (
            <Card className="py-16">
              <Loading />
            </Card>
          ) : employees.length === 0 ? (
            <Card className="py-16">
              <Empty>ไม่พบข้อมูลพนักงาน</Empty>
            </Card>
          ) : (
            <Card className="overflow-hidden border-0 shadow-lg shadow-slate-900/5">
              <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-bold text-heading">รายชื่อพนักงาน</h2>

                  <p className="mt-1 text-sm text-muted">
                    พบข้อมูลทั้งหมด {employees.length} รายการ
                  </p>
                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 sm:flex">
                  <UsersRound size={20} />
                </div>
              </div>

              <DataTable
                columns={employeeColumns}
                data={employees}
                rowKey="id"
                minWidth="760px"
                emptyMessage="ไม่พบข้อมูลพนักงาน"
                actions={(employee) => (
                  <button
                    type="button"
                    title="ดูบัตร QR"
                    onClick={() => setSelected(employee)}
                    className="
                    inline-flex items-center gap-2 rounded-control
                    bg-brand-50 px-3 py-2 text-sm font-semibold
                    text-brand-600 transition
                    hover:bg-brand-600 hover:text-white
                  "
                  >
                    <QrCode size={18} />
                    <span>ดู QR</span>
                  </button>
                )}
              />

              <div className="flex items-center justify-between border-t border-border bg-slate-50/70 px-5 py-3 sm:px-6">
                <p className="text-xs text-muted">
                  แสดง {employees.length} รายการ
                </p>

                <p className="text-xs text-muted">CHK Employee Database</p>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* QR Modal */}
      {selected && (
        <div
          className="
          fixed inset-0 z-[60] flex items-center justify-center
          bg-slate-950/65 p-4 backdrop-blur-sm
        "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-qr-title"
            className="
            relative w-full max-w-sm overflow-hidden
            rounded-3xl bg-white shadow-2xl
          "
          >
            <div className="h-2 bg-gradient-to-r from-brand-600 via-brand-500 to-amber-400" />

            <button
              type="button"
              aria-label="ปิด"
              onClick={() => setSelected(null)}
              className="
              no-print absolute right-4 top-5 rounded-full
              bg-slate-100 p-2 text-slate-500 transition
              hover:bg-slate-200 hover:text-slate-800
            "
            >
              <X size={18} />
            </button>

            <div className="px-6 pb-7 pt-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <QrCode size={28} />
              </div>

              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
                Employee QR Card
              </p>

              <h2
                id="employee-qr-title"
                className="mt-2 text-xl font-bold text-heading"
              >
                {selected.full_name}
              </h2>

              <p className="mt-1 font-mono text-sm font-semibold text-brand-600">
                {selected.employee_code}
              </p>

              <p className="mt-1 text-sm text-muted">
                {selected.department || "ไม่ระบุแผนก"}
                {" • "}
                {selected.position || "ไม่ระบุตำแหน่ง"}
              </p>

              <div className="my-6 inline-block rounded-3xl border border-border bg-white p-4 shadow-lg shadow-slate-900/10">
                <QRCodeSVG
                  value={selected.qr_token}
                  size={210}
                  level="H"
                  includeMargin
                />
              </div>

              <p className="text-xs leading-5 text-muted">
                แสดง QR Code นี้ต่อกล้องสำหรับเช็กชื่อเข้าอบรม
              </p>

              <Button
                className="no-print mt-5 w-full"
                onClick={() => window.print()}
              >
                <Printer size={18} />
                พิมพ์บัตร QR
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
