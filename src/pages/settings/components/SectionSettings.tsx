import { useMemo, useState } from "react";
import {
  Building2,
  ChevronRight,
  FolderTree,
  Pencil,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { Button } from "../../../components/Ui";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  deleteSectionSetting,
  isAssigned,
  sameId,
  sectionName,
} from "../../../features/settings/sectionSettings";
import type { SettingRow } from "../settings.types";
import SectionSettingModal from "../modals/SectionSettingModal";

const emptyRows: SettingRow[] = [];
type Modal = {
  kind: "sections" | "subsections";
  row?: SettingRow;
  parentId?: string | number;
};
function StatusBadge({ row }: { row: SettingRow }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${row.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
    >
      {row.status === "active" ? "ใช้งาน" : "ปิดใช้งาน"}
    </span>
  );
}
function matches(row: SettingRow, query: string) {
  return [row.code, row.name, row.description].some((value) =>
    String(value ?? "")
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
}

export default function SectionSettings() {
  const sectionRows = useAppSelector(
    (state) => state.settings.rowsByMenu.sections,
  );
  const subsectionRows = useAppSelector(
    (state) => state.settings.rowsByMenu.subsections,
  );
  const sections = sectionRows ?? emptyRows;
  const subsections = subsectionRows ?? emptyRows;
  const dispatch = useAppDispatch();
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [showUnassigned, setShowUnassigned] = useState(false);
  const [sectionSearch, setSectionSearch] = useState("");
  const [childSearch, setChildSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [modal, setModal] = useState<Modal | null>(null);
  const [error, setError] = useState("");
  const selected =
    sections.find((section) => sameId(section.id, selectedId)) ?? sections[0];
  const unassigned = useMemo(
    () => subsections.filter((row) => !isAssigned(row, sections)),
    [subsections, sections],
  );
  const children = useMemo(
    () =>
      showUnassigned
        ? unassigned
        : selected
          ? subsections.filter((row) => sameId(row.sectionId, selected.id))
          : emptyRows,
    [showUnassigned, unassigned, selected, subsections],
  );
  const filteredChildren = children.filter(
    (row) =>
      matches(row, childSearch) && (status === "all" || row.status === status),
  );
  const filteredSections = sections.filter((row) =>
    matches(row, sectionSearch),
  );

  const openModal = (value: Modal) => {
    setError("");
    setModal(value);
  };
  const remove = (kind: Modal["kind"], row: SettingRow) => {
    if (
      !window.confirm(
        `ยืนยันลบ${kind === "sections" ? "ส่วนงาน" : "หน่วยงานย่อย"} “${sectionName(row)}”?`,
      )
    )
      return;
    try {
      dispatch(deleteSectionSetting(kind, row.id));
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "ลบไม่สำเร็จ");
    }
  };
  const selectSection = (row: SettingRow) => {
    setSelectedId(row.id);
    setShowUnassigned(false);
    setChildSearch("");
    setError("");
  };
  const canCreateChild = Boolean(
    selected && selected.status === "active" && !showUnassigned,
  );

  return (
    <section className="space-y-5" aria-label="จัดการส่วนงานและหน่วยงานย่อย">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-brand-50 p-3 text-brand-600">
            <FolderTree size={23} />
          </span>
          <div>
            <h1 className="text-xl font-bold text-heading">
              ส่วนงานและหน่วยงานย่อย
            </h1>
            <p className="mt-1 text-sm leading-6 text-muted">
              เลือกส่วนงานเพื่อดูและจัดการหน่วยงานย่อยที่สังกัด
            </p>
          </div>
        </div>
        <div className="flex gap-2 text-xs font-semibold">
          <span className="rounded-full bg-brand-50 px-3 py-2 text-brand-700">
            {sections.length} ส่วนงาน
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-600">
            {subsections.length} หน่วยงานย่อย
          </span>
        </div>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {unassigned.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="flex items-center gap-2 text-sm text-amber-900">
            <TriangleAlert size={18} className="shrink-0" />
            มีหน่วยงานย่อย {unassigned.length}{" "}
            รายการที่ยังไม่ผูกกับส่วนงานที่มีอยู่
          </p>
          <button
            type="button"
            onClick={() => {
              setShowUnassigned(true);
              setChildSearch("");
              setError("");
            }}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100"
          >
            จัดการรายการที่ยังไม่ผูกส่วนงาน
          </button>
        </div>
      )}
      <div className="grid items-start gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-bold text-heading">
                <Building2 size={18} />
                ส่วนงาน
              </h2>
              <Button
                type="button"
                onClick={() => openModal({ kind: "sections" })}
                className="!gap-1 !px-3 !py-2 !text-xs"
              >
                <Plus size={15} />
                เพิ่มส่วนงาน
              </Button>
            </div>
            <label className="relative mt-4 block">
              <span className="sr-only">ค้นหาส่วนงาน</span>
              <Search
                size={16}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                type="search"
                value={sectionSearch}
                onChange={(event) => setSectionSearch(event.target.value)}
                placeholder="ค้นหารหัสหรือชื่อส่วนงาน..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-brand-500"
              />
            </label>
          </div>
          <div className="max-h-[560px] space-y-2 overflow-y-auto p-3">
            {filteredSections.length === 0 && (
              <p className="px-3 py-10 text-center text-sm text-muted">
                {sections.length
                  ? "ไม่พบส่วนงานที่ค้นหา"
                  : "ยังไม่มีส่วนงาน กดเพิ่มส่วนงานเพื่อเริ่มต้น"}
              </p>
            )}
            {filteredSections.map((row) => {
              const active = !showUnassigned && sameId(row.id, selected?.id);
              const count = subsections.filter((child) =>
                sameId(child.sectionId, row.id),
              ).length;
              return (
                <div
                  key={row.id}
                  className={`rounded-xl border p-3 transition ${active ? "border-brand-300 bg-brand-50" : "border-slate-200 hover:border-slate-300"}`}
                >
                  <button
                    type="button"
                    aria-label={`เลือกส่วนงาน ${sectionName(row)}`}
                    aria-pressed={active}
                    onClick={() => selectSection(row)}
                    className="flex w-full items-center gap-2 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block break-words text-sm font-bold text-heading">
                        {sectionName(row)}
                      </span>
                      <span className="mt-1 block text-xs text-muted">
                        {String(row.code ?? "")} · {count} หน่วยงานย่อย
                      </span>
                    </span>
                    <ChevronRight
                      size={17}
                      className={active ? "text-brand-600" : "text-slate-400"}
                    />
                  </button>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <StatusBadge row={row} />
                    <div className="flex gap-1">
                      <button
                        type="button"
                        aria-label={`แก้ไขส่วนงาน ${sectionName(row)}`}
                        onClick={() => openModal({ kind: "sections", row })}
                        className="rounded-lg p-2 text-brand-600 hover:bg-white"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label={`ลบส่วนงาน ${sectionName(row)}`}
                        onClick={() => remove("sections", row)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="border-b border-border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-heading">
                  {showUnassigned
                    ? "หน่วยงานย่อยที่ยังไม่ผูกส่วนงาน"
                    : selected
                      ? `หน่วยงานย่อย: ${sectionName(selected)}`
                      : "หน่วยงานย่อย"}
                </h2>
                <p className="mt-1 text-xs leading-6 text-muted">
                  {showUnassigned
                    ? "กดแก้ไขเพื่อเลือกส่วนงานให้รายการเดิม"
                    : selected
                      ? `${String(selected.code ?? "")} · ${children.length} รายการ${selected.status !== "active" ? " · ส่วนงานนี้ปิดใช้งาน จึงเพิ่มหน่วยงานย่อยไม่ได้" : ""}`
                      : "กรุณาเพิ่มหรือเลือกส่วนงานก่อน"}
                </p>
              </div>
              <Button
                type="button"
                disabled={!canCreateChild}
                onClick={() => {
                  if (selected)
                    openModal({ kind: "subsections", parentId: selected.id });
                }}
              >
                <Plus size={17} />
                เพิ่มหน่วยงานย่อย
              </Button>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <label className="relative block flex-1">
                <span className="sr-only">ค้นหาหน่วยงานย่อย</span>
                <Search
                  size={17}
                  className="absolute left-3 top-3 text-slate-400"
                />
                <input
                  type="search"
                  value={childSearch}
                  onChange={(event) => setChildSearch(event.target.value)}
                  placeholder="ค้นหารหัสหรือชื่อหน่วยงานย่อย..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-brand-500"
                />
              </label>
              <label>
                <span className="sr-only">กรองสถานะหน่วยงานย่อย</span>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-body"
                >
                  <option value="all">ทุกสถานะ</option>
                  <option value="active">ใช้งาน</option>
                  <option value="inactive">ปิดใช้งาน</option>
                </select>
              </label>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-slate-50 text-xs font-semibold text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3">
                    รหัส
                  </th>
                  <th scope="col" className="px-5 py-3">
                    ชื่อหน่วยงานย่อย
                  </th>
                  <th scope="col" className="px-5 py-3">
                    สถานะ
                  </th>
                  <th scope="col" className="px-5 py-3 text-right">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredChildren.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60">
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-semibold text-brand-700">
                      {String(row.code ?? "")}
                    </td>
                    <td className="min-w-48 px-5 py-4">
                      <p className="font-semibold text-heading">
                        {sectionName(row)}
                      </p>
                      {Boolean(row.description) && (
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
                          {String(row.description)}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge row={row} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <button
                        type="button"
                        aria-label={`แก้ไขหน่วยงานย่อย ${sectionName(row)}`}
                        onClick={() => openModal({ kind: "subsections", row })}
                        className="rounded-lg p-2 text-brand-600 hover:bg-brand-50"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        aria-label={`ลบหน่วยงานย่อย ${sectionName(row)}`}
                        onClick={() => remove("subsections", row)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredChildren.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-14 text-center text-sm text-muted"
                    >
                      {!selected && !showUnassigned
                        ? "กรุณาเพิ่มหรือเลือกส่วนงาน"
                        : children.length
                          ? "ไม่พบรายการที่ตรงกับตัวกรอง"
                          : "ยังไม่มีหน่วยงานย่อยในส่วนงานนี้"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <footer className="border-t border-border bg-slate-50 px-5 py-3 text-xs text-muted">
            แสดง {filteredChildren.length} จาก {children.length} รายการ
          </footer>
        </div>
      </div>
      {modal && (
        <SectionSettingModal {...modal} onClose={() => setModal(null)} />
      )}
    </section>
  );
}
