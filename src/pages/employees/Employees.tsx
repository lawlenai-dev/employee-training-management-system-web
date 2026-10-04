import {
  Building2,
  BriefcaseBusiness,
  Eye,
  IdCard,
  Plus,
  Printer,
  QrCode,
  Search,
  UsersRound,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { ReactNode } from "react";
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { employeesMockup, positionMockup } from "../../data";
import { useAuth } from "../../auth/AuthContext";
import { PreRegistration, usePreRegistrations } from "../../auth/PreRegistrationContext";
import {
  Button,
  Card,
  Empty,
  Loading,
  MultiSelectChips,
  PageTitle,
} from "../../components/Ui";
import HeroCover from "../../components/HeroCover";
import DataTable from "../../components/DataTable";
import EmployeeModal from "./components/EmployeeModal";
import type { EmployeeFormSubmission } from "./components/EmployeeModal";
import EmployeeDetailModal, {
  EmployeeTrainingHistory,
} from "./components/EmployeeDetailModal";

type Employee = {
  id: string | number;
  employee_code: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  department?: string;
  position?: string;
  is_active: boolean | number | string;
  qr_token: string;
  supplier_id?: number;
  supplier_name?: string;
  [key: string]: unknown;
};

type CellContext<T> = { value: T };

type EmployeeColumn = {
  id?: string;
  header: string;
  accessor: string | ((row: Employee) => unknown);
  cell: (context: CellContext<unknown>) => ReactNode;
};

const createDemoEmployees = (): Employee[] =>
  (employeesMockup as Employee[]).map((employee, index) => ({
    ...employee,
    supplier_id: index % 2 === 0 ? 101 : 102,
    supplier_name: index % 2 === 0 ? "Supplier A" : "Supplier B",
  }));

const trainingHistoryMockup: EmployeeTrainingHistory[] = [
  {
    id: 1,
    employee_code: "EMP001",
    course_code: "SAF-001",
    course_name: "ความปลอดภัยในการทำงาน",
    training_date: "2026-08-12",
    duration_hours: 6,
    location: "Training Room 1",
    trainer: "สมชาย วิทยากร",
    result: "passed",
  },
  {
    id: 2,
    employee_code: "EMP001",
    course_code: "5S-001",
    course_name: "5S ในสถานประกอบการ",
    training_date: "2026-07-18",
    duration_hours: 3,
    location: "Meeting Room A",
    trainer: "วราภรณ์ ใจดี",
    result: "passed",
  },
  {
    id: 3,
    employee_code: "EMP001",
    course_code: "FIRE-001",
    course_name: "การดับเพลิงขั้นต้น",
    training_date: "2026-06-05",
    duration_hours: 6,
    location: "Safety Training Area",
    trainer: "กิตติศักดิ์ ปลอดภัย",
    result: "pending",
  },
  {
    id: 4,
    employee_code: "EMP002",
    course_code: "QC-101",
    course_name: "พื้นฐานการควบคุมคุณภาพ",
    training_date: "2026-08-20",
    duration_hours: 6,
    location: "Training Room 2",
    trainer: "ชุติมา คุณภาพ",
    result: "passed",
  },
  {
    id: 5,
    employee_code: "EMP002",
    course_code: "ISO-9001",
    course_name: "ISO 9001 Awareness",
    training_date: "2026-07-09",
    duration_hours: 3,
    location: "Meeting Room B",
    trainer: "อนุชา ระบบดี",
    result: "passed",
  },
  {
    id: 6,
    employee_code: "EMP003",
    course_code: "LOTO-001",
    course_name: "Lockout Tagout (LOTO)",
    training_date: "2026-08-02",
    duration_hours: 6,
    location: "Maintenance Workshop",
    trainer: "ธีรภัทร ช่างดี",
    result: "passed",
  },
];

export default function Employees() {
  const [searchParams, setSearchParams] = useSearchParams();
  const trainingStatus = searchParams.get("trainingStatus") ?? "";
  const supplierId = searchParams.get("supplierId") ?? "";
  const startTime = searchParams.get("startTime") ?? "";
  const endTime = searchParams.get("endTime") ?? "";
  const selectedPosition = searchParams.get("position") ?? "";
  const searchText = searchParams.get("search") ?? "";
  const invalidDateRange = Boolean(startTime && endTime && startTime > endTime);
  const setFilter = (name: string, value: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(name, value);
      else next.delete(name);
      return next;
    });
  };
  const { user, hasPermission } = useAuth();
  const { requests, submitRequest } = usePreRegistrations();
  const [employees, setEmployees] = useState<Employee[]>(createDemoEmployees),
    [search, setSearch] = useState(""),
    [show, setShow] = useState(false),
    [selected, setSelected] = useState<Employee | null>(null),
    [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");

  const submit = (payload: EmployeeFormSubmission) => {
    setError("");
    setNotice("");

    if (hasPermission("preregistration.create")) {
      submitRequest(payload);
      setShow(false);
      setNotice("ส่งข้อมูล Pre-register ให้ Admin ตรวจสอบแล้ว");
      return;
    }

    const newEmployee: Employee = {
      id: Date.now(),
      employee_code: payload.employee_code,
      first_name: payload.first_name,
      last_name: payload.last_name,
      full_name: `${payload.first_name} ${payload.last_name}`.trim(),
      department: payload.department,
      position: payload.position,
      is_active: payload.status === "active" ? 1 : 0,
      qr_token: payload.employee_code,
      supplier_id: payload.company ? 101 : undefined,
      supplier_name: payload.company,
    };

    setEmployees((current) => [...current, newEmployee]);
    setShow(false);
  };

  const registeredEmployees = useMemo<Employee[]>(() => {
    const approvedEmployees: Employee[] = requests
      .filter(
        (request): request is PreRegistration  & { employee_code: string } =>
          request.requestStatus === "approved" &&
          Boolean(request.employee_code?.trim()),
      )
      .map((request) => ({
        id: request.id,
        employee_code: request.employee_code,
        first_name: request.first_name,
        last_name: request.last_name,
        full_name: `${request.first_name} ${request.last_name}`.trim(),
        department: request.department,
        position: request.position,
        is_active: request.status === "active" ? 1 : 0,
        qr_token: request.employee_code,
        supplier_id: request.supplierId,
        supplier_name: request.supplierName,
      }));

    return [...employees, ...approvedEmployees];
  }, [employees, requests]);

  const visibleEmployees = useMemo(() => {
    if (hasPermission("employees.view_all")) return registeredEmployees;

    return registeredEmployees.filter(
      (employee) => employee.supplier_id === user?.supplierId,
    );
  }, [hasPermission, registeredEmployees, user?.supplierId]);

  const filteredEmployees = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (invalidDateRange) return [];
    const passedCodes = new Set(
      trainingHistoryMockup
        .filter(
          (history) =>
            history.result === "passed" &&
            (!startTime || history.training_date >= startTime) &&
            (!endTime || history.training_date <= endTime),
        )
        .map((history) => history.employee_code),
    );

    return visibleEmployees.filter((employee) => {
      if (supplierId && String(employee.supplier_id ?? "") !== supplierId)
        return false;
      const passed = passedCodes.has(employee.employee_code);
      if (
        trainingStatus === "not-passed" &&
        (Number(employee.is_active) !== 1 || passed)
      )
        return false;
      if (trainingStatus === "passed" && !passed) return false;
      return (
        !keyword ||
        [
          employee.employee_code,
          employee.first_name,
          employee.last_name,
          employee.full_name,
          employee.department,
          employee.position,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(keyword),
        )
      );
    });
  }, [
    search,
    visibleEmployees,
    supplierId,
    trainingStatus,
    startTime,
    endTime,
    invalidDateRange,
  ]);

  const activeCount = visibleEmployees.filter((employee) =>
    Number(employee.is_active),
  ).length;

  const selectedTrainingHistory = useMemo(
    () =>
      viewingEmployee
        ? trainingHistoryMockup.filter(
            (history) =>
              history.employee_code === viewingEmployee.employee_code,
          )
        : [],
    [viewingEmployee],
  );

  const employeeColumns = useMemo<EmployeeColumn[]>(
    () => [
      {
        header: "รหัสพนักงาน",
        accessor: "employee_code",
        cell: ({ value }) => (
          <span className="inline-flex items-center gap-2 font-mono font-bold text-brand-600">
            <IdCard size={17} />
            {String(value ?? "")}
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
              <p className="font-semibold text-heading">
                {String(value || "-")}
              </p>
              <p className="mt-0.5 text-xs text-muted">พนักงาน </p>
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
        cell: ({ value }) => {
          const details = value as {
            department?: string;
            position?: string;
          };

          return (
            <div className="space-y-1">
              <p className="flex items-center gap-2 font-medium text-body">
                <Building2 size={15} className="text-slate-400" />
                {details.department || "ไม่ระบุแผนก"}
              </p>

              <p className="flex items-center gap-2 text-xs text-muted">
                <BriefcaseBusiness size={14} className="text-slate-400" />
                {details.position || "ไม่ระบุตำแหน่ง"}
              </p>
            </div>
          );
        },
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

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "resign", label: "Resign" },
    { value: "blacklist", label: "Blacklist" },
    { value: "cancel", label: "Cancel" },
  ];

  const selectedStatuses = searchParams.getAll("status");

  const handleStatusChange = (values: string[]) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      next.delete("status");

      values.forEach((value) => {
        next.append("status", value);
      });

      return next;
    });
  };

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
              subtitle={
                !hasPermission("employees.view_all")
                  ? "แสดงเฉพาะพนักงานของบริษัทคุณ (Demo data)"
                  : "เพิ่มพนักงาน ค้นหาข้อมูล และพิมพ์ QR สำหรับใช้เช็กชื่อ"
              }
              action={
                hasPermission("employees.create") ? (
                  <Button onClick={() => setShow(true)}>
                    <Plus size={18} />
                    เพิ่มพนักงาน
                  </Button>
                ) : hasPermission("preregistration.create") ? (
                  <Button onClick={() => setShow(true)}>
                    <Plus size={18} />
                    Pre-register พนักงาน
                  </Button>
                ) : undefined
              }
            />

            {notice && (
              <div className="mt-5 rounded-xl border border-success-600/20 bg-success-50 px-4 py-3 text-sm font-medium text-success-600">
                {notice}
              </div>
            )}

            {!hasPermission("employees.view_all") && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                บัญชี Supplier เห็นเฉพาะข้อมูลของ {user?.name} เท่านั้น
              </div>
            )}

            {/* filter และ Search */}
            <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-4">
              {hasPermission("employees.view_all") && (
                <label className="text-sm font-medium text-heading ">
                  บริษัท
                  <select
                    value={supplierId}
                    onChange={(event) =>
                      setFilter("supplierId", event.target.value)
                    }
                    className="mt-2 w-full rounded-control border border-border bg-white px-3 py-2.5 text-body"
                  >
                    <option value="">ทุกบริษัท</option>
                    {Array.from(
                      new Map(
                        visibleEmployees
                          .filter((employee) => employee.supplier_id != null)
                          .map((employee) => [
                            String(employee.supplier_id),
                            employee.supplier_name ??
                              String(employee.supplier_id),
                          ]),
                      ).entries(),
                    ).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="text-sm font-medium text-heading">
                ตำแหน่ง
                <select
                  value={selectedPosition}
                  onChange={(event) =>
                    setFilter("position", event.target.value)
                  }
                  className="mt-2 w-full rounded-control border border-border bg-white px-3 py-2.5 text-body"
                >
                  <option value="">ทั้งหมด</option>

                  {positionMockup
                    .filter((position) => position.status === "active")
                    .map((position) => (
                      <option key={position.id} value={position.code}>
                        {position.name}
                      </option>
                    ))}
                </select>
              </label>
              <label className="text-sm font-medium text-heading sm:col-span-2">
                ค้นหาพนักงาน
                <input
                  type="search"
                  value={searchText}
                  onChange={(event) => setFilter("search", event.target.value)}
                  placeholder="ชื่อ หรือรหัสพนักงาน"
                  className="mt-2 w-full rounded-control border border-border bg-white px-3 py-2.5 text-body"
                />
              </label>
              <fieldset className="min-w-0 sm:col-span-2">
                <legend className="text-sm font-medium text-heading">
                  ช่วงวันที่ลงทะเบียน
                </legend>

                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="text-xs font-medium text-body">
                    {/* ตั้งแต่วันที่ */}
                    <input
                      type="date"
                      value={startTime}
                      max={endTime || undefined}
                      onChange={(event) =>
                        setFilter("startTime", event.target.value)
                      }
                      className="mt-1.5 w-full rounded-control border border-border bg-white px-3 py-2.5 text-sm text-body"
                    />
                  </label>

                  <label className="text-xs font-medium text-body">
                    {/* ถึงวันที่ */}
                    <input
                      type="date"
                      value={endTime}
                      min={startTime || undefined}
                      onChange={(event) =>
                        setFilter("endTime", event.target.value)
                      }
                      className="mt-1.5 w-full rounded-control border border-border bg-white px-3 py-2.5 text-sm text-body"
                    />
                  </label>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  วันที่สิ้นสุดต้องตรงกับหรืออยู่หลังวันที่เริ่มต้น
                </p>
              </fieldset>
              <MultiSelectChips
                label="สถานะพนักงาน"
                options={statusOptions}
                value={selectedStatuses}
                onChange={handleStatusChange}
                helperText="เลือกได้หลายสถานะ · ไม่เลือกหมายถึงทุกสถานะ"
                className="sm:col-span-2 lg:col-span-6"
              />
            </div>
            <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-3">
                <div className="rounded-xl bg-brand-50 px-4 py-2">
                  <p className="text-xs text-muted">พนักงานทั้งหมด</p>
                  <p className="mt-0.5 font-bold text-brand-700">
                    {visibleEmployees.length} คน
                  </p>
                </div>

                <div className="rounded-xl bg-success-50 px-4 py-2">
                  <p className="text-xs text-muted">กำลังใช้งาน</p>
                  <p className="mt-0.5 font-bold text-success-600">
                    {activeCount} คน
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
              <p>
                ช่วงวันที่กรองตามวันที่ผ่านการอบรม ·
                ประวัติการอบรมขณะนี้เป็นข้อมูลตัวอย่าง
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSearchParams({});
                }}
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                ล้างตัวกรอง
              </button>
            </div>
            {invalidDateRange && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                วันสิ้นสุดต้องไม่ก่อนวันเริ่มต้น
              </p>
            )}
          </Card>

          {/* Add employee form */}
          {show && (
            <EmployeeModal
              open={show}
              onClose={() => setShow(false)}
              onSubmit={submit}
              error={error}
              title={
                hasPermission("preregistration.create")
                  ? "Pre-register พนักงาน"
                  : undefined
              }
              description={
                hasPermission("preregistration.create")
                  ? "ส่งข้อมูลให้ Admin ตรวจสอบก่อนขึ้นทะเบียนพนักงาน"
                  : undefined
              }
              submitLabel={
                hasPermission("preregistration.create")
                  ? "ส่งให้ Admin ตรวจสอบ"
                  : undefined
              }
            />
          )}

          {/* Employee table */}
          {employees === null ? (
            <Card className="py-16">
              <Loading />
            </Card>
          ) : filteredEmployees.length === 0 ? (
            <Card className="py-16">
              <Empty>ไม่พบข้อมูลพนักงาน</Empty>
            </Card>
          ) : (
            <Card className="overflow-hidden border-0 shadow-lg shadow-slate-900/5">
              <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-bold text-heading">รายชื่อพนักงาน</h2>

                  <p className="mt-1 text-sm text-muted">
                    พบข้อมูลทั้งหมด {filteredEmployees.length} รายการ
                  </p>
                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 sm:flex">
                  <UsersRound size={20} />
                </div>
              </div>

              <DataTable
                columns={employeeColumns}
                data={filteredEmployees}
                rowKey="id"
                minWidth="760px"
                emptyMessage="ไม่พบข้อมูลพนักงาน"
                actions={(employee: Employee) => (
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      title="ดูข้อมูลและประวัติการอบรม"
                      aria-label={`ดูข้อมูล ${employee.employee_code}`}
                      onClick={() => setViewingEmployee(employee)}
                      className="inline-flex items-center gap-2 rounded-control bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-700 hover:text-white"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      type="button"
                      title="ดูบัตร QR"
                      aria-label={`ดูบัตร QR ${employee.employee_code}`}
                      onClick={() => setSelected(employee)}
                      className="inline-flex items-center gap-2 rounded-control bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-600 hover:text-white"
                    >
                      <QrCode size={18} />
                    </button>
                  </div>
                )}
              />

              <div className="flex items-center justify-between border-t border-border bg-slate-50/70 px-5 py-3 sm:px-6">
                <p className="text-xs text-muted">
                  แสดง {filteredEmployees.length} รายการ
                </p>

                <p className="text-xs text-muted"> Employee Database</p>
              </div>
            </Card>
          )}
        </div>
      </section>

      {viewingEmployee && (
        <EmployeeDetailModal
          open
          employee={viewingEmployee}
          histories={selectedTrainingHistory}
          onClose={() => setViewingEmployee(null)}
        />
      )}

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
                {selected.full_name ||
                  `${selected.first_name ?? ""} ${selected.last_name ?? ""}`.trim() ||
                  "ไม่ระบุชื่อ"}
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
                  value={selected.qr_token || selected.employee_code}
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
