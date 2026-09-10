import {
  CheckCircle2,
  ChevronRight,
  // KeyRound,
  Pencil,
  Plus,
  Search,
  Settings as SettingsIcon,
  Shapes,
  Tags,
  Trash2,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import HeroCover from "../../components/HeroCover";
import { Button } from "../../components/Ui";
import DataTable from "../../components/DataTable";
import { positionMockup, supplierMockup } from "../../data";
import PersonalSetting from "./components/PersonnalSetting";
/* ---------------- Mockup data ---------------- */

const settingsConfig = {
  users: {
    title: "User & Permission",
    thaiTitle: "ผู้ใช้งานและสิทธิ์",
    description: "จัดการบัญชีผู้ใช้งาน บทบาท และสิทธิ์ในการเข้าถึงระบบ",
    addLabel: "เพิ่มผู้ใช้งาน",
    icon: UsersRound,

    columns: [
      { key: "name", label: "ชื่อผู้ใช้งาน" },
      { key: "username", label: "Username" },
      { key: "department", label: "แผนก" },
      { key: "role", label: "สิทธิ์" },
      { key: "status", label: "สถานะ" },
    ],

    rows: [
      {
        id: 1,
        name: "สมชาย ใจดี",
        username: "somchai",
        department: "Safety",
        role: "Admin",
        status: "active",
      },
      {
        id: 2,
        name: "วราภรณ์ มั่นคง",
        username: "waraporn",
        department: "Human Resource",
        role: "HR",
        status: "active",
      },
      {
        id: 3,
        name: "ประเสริฐ ทำงานดี",
        username: "prasert",
        department: "Production",
        role: "Trainer",
        status: "active",
      },
      {
        id: 4,
        name: "กิตติชัย ปลอดภัย",
        username: "kittichai",
        department: "Contractor",
        role: "Viewer",
        status: "inactive",
      },
    ],
  },
  positions: {
    title: "Positions",
    thaiTitle: "ตำแหน่ง",
    description: "ตำแหน่งของพนักงาน",
    addLabel: "เพิ่มตำแหน่ง",
    icon: Shapes,

    columns: [
      { key: "code", label: "รหัส" },
      { key: "name", label: "ชื่อตำแหน่ง" },
      { key: "description", label: "รายละเอียด" },
      { key: "status", label: "สถานะ" },
    ],

    rows: positionMockup,
  },
  suppliers: {
    title: "Suppliers",
    thaiTitle: "บริษัท",
    description: "รายชื่อบริษัท",
    addLabel: "เพิ่มรายชื่อบริษัท",
    icon: Shapes,

    columns: [
      {
        key: "rowNumber",
        label: "ลำดับ",
        accessor: (_row, rowIndex) => rowIndex + 1,
        cellClassName: "w-20 font-semibold text-muted",
      },
      {
        key: "supplierNameTH",
        label: "ชื่อบริษัท (ไทย)",
        accessor: "supplierNameTH",
      },
      {
        key: "supplierNameEN",
        label: "ชื่อบริษัท (อังกฤษ)",
        accessor: "supplierNameEN",
      },
      {
        key: "address",
        label: "ที่อยู่",
        accessor: "address",
      },
      {
        key: "status",
        label: "สถานะ",
        accessor: "status",
      },
    ],

    rows: supplierMockup,
  },
  categories: {
    title: "Category",
    thaiTitle: "หมวดหมู่หลักสูตร",
    description: "กำหนดหมวดหมู่สำหรับจัดกลุ่มหลักสูตรอบรม",
    addLabel: "เพิ่มหมวดหมู่",
    icon: Tags,

    columns: [
      { key: "code", label: "รหัส" },
      { key: "name", label: "ชื่อหมวดหมู่" },
      { key: "description", label: "รายละเอียด" },
      { key: "courseCount", label: "จำนวนหลักสูตร" },
      { key: "status", label: "สถานะ" },
    ],

    rows: [
      {
        id: 1,
        code: "SAFETY",
        name: "ความปลอดภัย",
        description: "หลักสูตรอบรมด้านความปลอดภัยในการทำงาน",
        courseCount: 12,
        status: "active",
      },
      {
        id: 2,
        code: "TECHNICAL",
        name: "ทักษะเฉพาะทาง",
        description: "หลักสูตรอบรมด้านเทคนิคและการปฏิบัติงาน",
        courseCount: 8,
        status: "active",
      },
      {
        id: 3,
        code: "MANAGEMENT",
        name: "การบริหารจัดการ",
        description: "หลักสูตรสำหรับหัวหน้างานและผู้บริหาร",
        courseCount: 5,
        status: "active",
      },
      {
        id: 4,
        code: "GENERAL",
        name: "ความรู้ทั่วไป",
        description: "หลักสูตรทั่วไปสำหรับพนักงาน",
        courseCount: 3,
        status: "inactive",
      },
    ],
  },

  types: {
    title: "Type",
    thaiTitle: "ประเภทหลักสูตร",
    description: "กำหนดรูปแบบและประเภทของการจัดอบรม",
    addLabel: "เพิ่มประเภท",
    icon: Shapes,

    columns: [
      { key: "code", label: "รหัส" },
      { key: "name", label: "ชื่อประเภท" },
      { key: "category", label: "หมวดหมู่" },
      { key: "description", label: "รายละเอียด" },
      { key: "status", label: "สถานะ" },
    ],

    rows: [
      {
        id: 1,
        code: "INTERNAL",
        name: "อบรมภายใน",
        category: "ความปลอดภัย",
        description: "จัดอบรมโดยวิทยากรภายในบริษัท",
        status: "active",
      },
      {
        id: 2,
        code: "EXTERNAL",
        name: "อบรมภายนอก",
        category: "ทักษะเฉพาะทาง",
        description: "ส่งพนักงานเข้าอบรมกับหน่วยงานภายนอก",
        status: "active",
      },
      {
        id: 3,
        code: "ONLINE",
        name: "Online Training",
        category: "ความรู้ทั่วไป",
        description: "เรียนผ่านระบบออนไลน์",
        status: "active",
      },
      {
        id: 4,
        code: "ONSITE",
        name: "On-site Training",
        category: "ความปลอดภัย",
        description: "จัดอบรมภายในพื้นที่ปฏิบัติงาน",
        status: "inactive",
      },
    ],
  },
};

const personalSetting = {
  title: "Personal",
  thaiTitle: "ส่วนข้อมูลส่วนบุคคล",
  description: "จัดการข้อมูลส่วนบุคคลของพนักงาน",
  addLabel: "เพิ่มข้อมูล",
  icon: UsersRound,
};
/* ---------------- Component ---------------- */

export default function Settings() {
  const [activeMenu, setActiveMenu] = useState("users");
  const [search, setSearch] = useState("");

  const currentSetting =
    activeMenu === "personal" ? personalSetting : settingsConfig[activeMenu];
  const CurrentIcon = currentSetting?.icon ?? SettingsIcon;

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (activeMenu === "personal") {
      return [];
    }

    const rows = currentSetting?.rows ?? [];

    if (!keyword) {
      return rows;
    }

    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(keyword),
      ),
    );
  }, [activeMenu, currentSetting, search]);

  const handleSelectMenu = (menuKey) => {
    setActiveMenu(menuKey);
    setSearch("");
  };

  const tableColumns = useMemo(
    () =>
      (currentSetting?.columns ?? []).map((column) => ({
        id: column.key,
        header: column.label,
        accessor: column.accessor ?? column.key,
        headerClassName: column.headerClassName,
        cellClassName: column.cellClassName,

        cell:
          column.cell ??
          (({ value }) => (
            <CellValue column={column.key} value={value} />
          )),
      })),
    [currentSetting],
  );

  return (
    <>
      <HeroCover
        size="small"
        image="/training-cover.jpg"
        imagePosition="center"
        eyebrow="System Configuration"
        eyebrowIcon={SettingsIcon}
        title="ตั้งค่า"
        // highlight="ระบบฝึกอบรม"
        description="จัดการผู้ใช้งาน สิทธิ์ หมวดหมู่ และประเภทหลักสูตร"
      />

      <section className="relative z-10 -mt-10 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* เมนู Settings */}
          <aside className="self-start rounded-card border border-border bg-surface p-3 shadow-card lg:sticky lg:top-24">
            <div className="mb-2 border-b border-slate-200 px-3 pb-4 pt-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <SettingsIcon size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-heading">Settings</h2>

                  <p className="text-xs text-muted">ตั้งค่าการทำงานของระบบ</p>
                </div>
              </div>
            </div>

            <nav className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {/*  Personnal Information Setting  */}
              <button
                type="button"
                onClick={() => handleSelectMenu("personal")}
                className={`
                        group flex items-center gap-3 rounded-control
                        px-3 py-3 text-left transition
                        ${
                          activeMenu === "personal"
                            ? "bg-brand-600 text-white shadow-md shadow-brand-900/15"
                            : "text-body hover:bg-brand-50 hover:text-brand-600"
                        }
                      `}
              >
                <span
                  className={`
                          flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                          ${
                            activeMenu === "personal"
                              ? "bg-white/15 text-white"
                              : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-brand-600"
                          }
                        `}
                >
                  <UsersRound size={18} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    Personal
                  </span>

                  <span
                    className={`hidden truncate text-xs lg:block ${
                      activeMenu === "personal" ? "text-white/65" : "text-muted"
                    }`}
                  >
                    ส่วนข้อมูลส่วนบุคคล
                  </span>
                </span>

                <ChevronRight size={17} className="hidden lg:block" />
              </button>
              {Object.entries(settingsConfig).map(([menuKey, menu]) => {
                const MenuIcon = menu.icon;
                const isActive = activeMenu === menuKey;

                return (
                  <button
                    key={menuKey}
                    type="button"
                    onClick={() => handleSelectMenu(menuKey)}
                    className={`
                        group flex items-center gap-3 rounded-control
                        px-3 py-3 text-left transition
                        ${
                          isActive
                            ? "bg-brand-600 text-white shadow-md shadow-brand-900/15"
                            : "text-body hover:bg-brand-50 hover:text-brand-600"
                        }
                      `}
                  >
                    <span
                      className={`
                          flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                          ${
                            isActive
                              ? "bg-white/15 text-white"
                              : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-brand-600"
                          }
                        `}
                    >
                      <MenuIcon size={18} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {menu.title}
                      </span>

                      <span
                        className={`hidden truncate text-xs lg:block ${
                          isActive ? "text-white/65" : "text-muted"
                        }`}
                      >
                        {menu.thaiTitle}
                      </span>
                    </span>

                    <ChevronRight size={17} className="hidden lg:block" />
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* พื้นที่ข้อมูล */}
          <main className="min-w-0">
            {activeMenu === "personal" ? (
              <PersonalSetting />
            ) : (
              <div className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
                {/* Header */}
                <div className="border-b border-border px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <CurrentIcon size={22} />
                  </div>

                  <div>
                    <h1 className="text-xl font-bold text-heading">
                      {currentSetting?.thaiTitle}
                    </h1>

                    <p className="mt-1 text-sm text-muted">
                      {currentSetting?.description}
                    </p>
                  </div>
                </div>

                <Button className="w-full xl:w-auto">
                  <Plus size={18} />
                  {currentSetting?.addLabel}
                </Button>
              </div>

              {/* Search */}
              <div className="relative mt-5 max-w-md">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`ค้นหา${currentSetting?.thaiTitle}...`}
                  className="
                    h-11 w-full rounded-control border border-border
                    bg-white pl-10 pr-4 text-sm text-body
                    outline-none transition placeholder:text-placeholder
                    focus:border-brand-500 focus:ring-4 focus:ring-brand-100
                  "
                />
              </div>
                </div>

                <DataTable
                  columns={tableColumns}
                  data={filteredRows}
                  rowKey="id"
                  emptyMessage="ไม่พบข้อมูล"
                  actions={(row) => (
                    <div className="inline-flex items-center gap-1">
                  {/* {activeMenu === "users" && (
                    <button
                      type="button"
                      title="กำหนดสิทธิ์"
                      onClick={() => handlePermission(row)}
                      className="
            rounded-lg p-2 text-accent-600
            transition hover:bg-accent-50
          "
                    >
                      <KeyRound size={17} />
                    </button>
                  )} */}

                  <button
                    type="button"
                    title="แก้ไข"
                    onClick={() => handleEdit(row)}
                    className="
          rounded-lg p-2 text-brand-600
          transition hover:bg-brand-50
        "
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    title="ลบ"
                    onClick={() => handleDelete(row)}
                    className="
          rounded-lg p-2 text-danger-600
          transition hover:bg-danger-50
        "
                  >
                    <Trash2 size={17} />
                  </button>
                    </div>
                  )}
                />

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border bg-slate-50/70 px-5 py-3">
                  <p className="text-xs text-muted">
                    แสดง {filteredRows.length} รายการ
                  </p>

                  <p className="text-xs text-muted">ข้อมูลตัวอย่าง</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </section>
    </>
  );
}

/* ---------------- Cell renderer ---------------- */

function CellValue({ column, value }) {
  if (column === "status") {
    const isActive = value === "active";

    return (
      <span
        className={`
          inline-flex items-center gap-1.5 rounded-full
          px-3 py-1.5 text-xs font-semibold
          ${
            isActive
              ? "bg-success-50 text-success-600"
              : "bg-slate-100 text-slate-500"
          }
        `}
      >
        {isActive && <CheckCircle2 size={14} />}
        {isActive ? "ใช้งาน" : "ปิดใช้งาน"}
      </span>
    );
  }

  if (column === "role") {
    const roleColors = {
      Admin: "bg-brand-50 text-brand-700",
      HR: "bg-purple-50 text-purple-700",
      Trainer: "bg-accent-50 text-accent-700",
      Viewer: "bg-slate-100 text-slate-600",
    };

    return (
      <span
        className={`
          rounded-full px-3 py-1.5 text-xs font-semibold
          ${roleColors[value] ?? roleColors.Viewer}
        `}
      >
        {value}
      </span>
    );
  }

  if (column === "code" || column === "username") {
    return (
      <span className="font-mono font-semibold text-brand-600">{value}</span>
    );
  }

  if (column === "courseCount") {
    return <span className="font-bold text-heading">{value} หลักสูตร</span>;
  }

  return (
    <span className={column === "name" ? "font-semibold text-heading" : ""}>
      {value}
    </span>
  );
}
