import {
  CheckCircle2,
  ChevronRight,
  // KeyRound,
  Pencil,
  Plus,
  Search,
  Settings as SettingsIcon,
  Trash2,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getSettingsSection } from "../../config/settingsSections";
import type { SettingsSection } from "../../config/settingsSections";
import HeroCover from "../../components/HeroCover";
import { Button } from "../../components/Ui";
import DataTable from "../../components/DataTable";
import PersonalSetting from "./components/PersonnalSetting";
import SettingFormModal from "./modals/SettingFormModal";
import AccessSettingsPanel from "./components/AccessSettingsPanel";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  saveSetting,
  deleteSetting,
} from "../../features/settings/settingsSlice";
import type {
  SettingDefinition,
  SettingMenuKey,
  SettingRow,
} from "./settings.types";
import { settingsConfig } from "./components/settingsConfig";
import SectionSettings from "./components/SectionSettings";

type ActiveMenuKey = SettingMenuKey | "personal";

/* ---------------- Component ---------------- */

export default function Settings() {
  const [params] = useSearchParams();
  const section = getSettingsSection(params.get("section"));
  return <SettingsSectionPage key={section.id} section={section} />;
}
function SettingsSectionPage({ section }: { section: SettingsSection }) {
  const [activeMenu, setActiveMenu] = useState<ActiveMenuKey>(
    section.menus[0]!,
  );
  const [search, setSearch] = useState("");
  const dispatch = useAppDispatch();
  const rowsByMenu = useAppSelector((state) => state.settings.rowsByMenu);
  const [editingRow, setEditingRow] = useState<SettingRow | null>(null);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const currentSetting =
    activeMenu === "personal" ? null : settingsConfig[activeMenu];
  const CurrentIcon = currentSetting?.icon ?? SettingsIcon;

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (
      activeMenu === "personal" ||
      activeMenu === "roles" ||
      activeMenu === "users" ||
      activeMenu === "sections"
    ) {
      return [];
    }

    const rows = rowsByMenu[activeMenu] ?? [];

    if (!keyword) {
      return rows;
    }

    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(keyword),
      ),
    );
  }, [activeMenu, rowsByMenu, search]);

  const handleSelectMenu = (menuKey: ActiveMenuKey) => {
    setActiveMenu(menuKey);
    setSearch("");
    setIsAddModalOpen(false);
    setEditingRow(null);
    setError("");
  };

  const handleAdd = () => {
    setEditingRow(null);
    setError("");
    if (activeMenu !== "personal") {
      setIsAddModalOpen(true);
    }
  };

  const handleSave = (values: Record<string, unknown>) => {
    if (
      activeMenu === "personal" ||
      activeMenu === "roles" ||
      activeMenu === "users"
    )
      return;
    dispatch(saveSetting(activeMenu, values, editingRow?.id));
    setIsAddModalOpen(false);
    setEditingRow(null);
  };
  const handleEdit = (row: SettingRow) => {
    setEditingRow(row);
    setError("");
    setIsAddModalOpen(true);
  };
  const handleDelete = (row: SettingRow) => {
    if (
      activeMenu === "personal" ||
      activeMenu === "roles" ||
      activeMenu === "users"
    )
      return;
    if (!window.confirm("ยืนยันลบรายการนี้?")) return;
    try {
      dispatch(deleteSetting(activeMenu, row.id));
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "ลบไม่สำเร็จ");
    }
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
          (({ value }: { value: unknown }) => (
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
        title={section.label}
        description={section.description}
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
                  <h2 className="font-bold text-heading">{section.label}</h2>

                  <p className="text-xs text-muted">ตั้งค่าการทำงานของระบบ</p>
                </div>
              </div>
            </div>

            <nav className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {/* Personal data belongs to general settings only. */}
              {section.menus.includes("personal") && (
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
                        activeMenu === "personal"
                          ? "text-white/65"
                          : "text-muted"
                      }`}
                    >
                      ส่วนข้อมูลส่วนบุคคล
                    </span>
                  </span>

                  <ChevronRight size={17} className="hidden lg:block" />
                </button>
              )}
              {(
                Object.entries(settingsConfig) as [
                  SettingMenuKey,
                  SettingDefinition,
                ][]
              )
                .filter(([menuKey]) => section.menus.includes(menuKey))
                .map(([menuKey, menu]) => {
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

          {/* display data เด้อ */}
          <main className="min-w-0">
            {activeMenu === "personal" ? (
              <PersonalSetting />
            ) : activeMenu === "roles" || activeMenu === "users" ? (
              <AccessSettingsPanel key={activeMenu} kind={activeMenu} />
            ) : activeMenu === "sections" ? (
              <SectionSettings />
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

                    <Button
                      type="button"
                      onClick={handleAdd}
                      className="w-full xl:w-auto"
                    >
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

                {error && (
                  <p
                    role="alert"
                    className="mx-5 my-3 rounded-xl bg-red-50 p-3 text-sm text-red-700"
                  >
                    {error}
                  </p>
                )}
                <DataTable
                  columns={tableColumns}
                  data={filteredRows}
                  rowKey="id"
                  emptyMessage="ไม่พบข้อมูล"
                  actions={(row: SettingRow) => (
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

                  <p className="text-xs text-muted">ข้อมูลจาก Redux</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </section>

      {activeMenu !== "personal" &&
        activeMenu !== "roles" &&
        activeMenu !== "users" &&
        activeMenu !== "sections" && (
          <SettingFormModal
            open={isAddModalOpen}
            setting={settingsConfig[activeMenu]}
            mode={editingRow ? "edit" : "create"}
            initialValue={editingRow}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleSave}
          />
        )}
    </>
  );
}

/* ---------------- Cell renderer ---------------- */

type CellValueProps = {
  column: string;
  value: unknown;
};

function CellValue({ column, value }: CellValueProps) {
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
    const roleColors: Record<string, string> = {
      Admin: "bg-brand-50 text-brand-700",
      HR: "bg-purple-50 text-purple-700",
      Trainer: "bg-accent-50 text-accent-700",
      Subcontract: "bg-orange-50 text-orange-700",
      Viewer: "bg-slate-100 text-slate-600",
    };

    return (
      <span
        className={`
          rounded-full px-3 py-1.5 text-xs font-semibold
          ${roleColors[String(value)] ?? roleColors.Viewer}
        `}
      >
        {String(value)}
      </span>
    );
  }

  if (column === "supplierTier") {
    const labels: Record<string, string> = {
      tier1: "Tier 1",
      tier2: "Tier 2",
      tier3: "Tier 3",
    };
    return (
      <span className="text-sm text-body">{labels[String(value)] ?? "—"}</span>
    );
  }

  if (column === "code" || column === "username") {
    return (
      <span className="font-mono font-semibold text-brand-600">
        {String(value)}
      </span>
    );
  }

  if (column === "courseCount") {
    return (
      <span className="font-bold text-heading">{String(value)} หลักสูตร</span>
    );
  }

  return (
    <span className={column === "name" ? "font-semibold text-heading" : ""}>
      {String(value ?? "")}
    </span>
  );
}
