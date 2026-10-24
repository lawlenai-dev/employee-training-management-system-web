import type { AppThunk } from "../../app/store";
import type { SettingRow } from "../../pages/settings/settings.types";
import { saveSetting, deleteSetting } from "./settingsSlice";
import { requirePermission } from "../rbac/rbacSelectors";

export type SectionForm = {
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  sectionId?: string | number;
};
export const sameId = (a: unknown, b: unknown) =>
  a !== undefined &&
  a !== null &&
  b !== undefined &&
  b !== null &&
  String(a) === String(b);
export const sectionName = (row: SettingRow) => String(row.name ?? "");
export const isAssigned = (row: SettingRow, sections: SettingRow[]) =>
  sections.some((section) => sameId(section.id, row.sectionId));

export const saveSectionSetting =
  (
    kind: "sections" | "subsections",
    form: SectionForm,
    id?: string | number,
  ): AppThunk =>
  (dispatch, getState) => {
    const state = getState();
    requirePermission(state, "settings.view");
    const sections = state.settings.rowsByMenu.sections ?? [];
    const subsections = state.settings.rowsByMenu.subsections ?? [];
    const code = form.code.trim().toUpperCase();
    const name = form.name.trim();
    if (!/^[A-Za-z0-9_-]{2,30}$/.test(code))
      throw new Error("รหัสต้องมี 2–30 ตัวอักษร ใช้ภาษาอังกฤษ ตัวเลข - หรือ _");
    if (!name || name.length > 100)
      throw new Error("กรุณากรอกชื่อไม่เกิน 100 ตัวอักษร");
    if (form.description.length > 500)
      throw new Error("รายละเอียดต้องไม่เกิน 500 ตัวอักษร");
    if (!["active", "inactive"].includes(form.status))
      throw new Error("กรุณาเลือกสถานะ");
    const values: Record<string, unknown> = {
      code,
      name,
      description: form.description.trim(),
      status: form.status,
    };
    if (kind === "subsections") {
      const parent = sections.find((section) =>
        sameId(section.id, form.sectionId),
      );
      if (!parent) throw new Error("กรุณาเลือกส่วนงานที่มีอยู่ในระบบ");
      const existing = subsections.find((row) => sameId(row.id, id));
      if (
        parent.status !== "active" &&
        (!existing || !sameId(existing.sectionId, parent.id))
      )
        throw new Error(
          "ไม่สามารถเพิ่มหรือย้ายหน่วยงานย่อยไปยังส่วนงานที่ปิดใช้งาน",
        );
      values.sectionId = parent.id;
    }
    dispatch(saveSetting(kind, values, id));
  };

export const deleteSectionSetting =
  (kind: "sections" | "subsections", id: string | number): AppThunk =>
  (dispatch, getState) => {
    requirePermission(getState(), "settings.view");
    if (
      kind === "sections" &&
      (getState().settings.rowsByMenu.subsections ?? []).some((row) =>
        sameId(row.sectionId, id),
      )
    )
      throw new Error(
        "ส่วนงานนี้มีหน่วยงานย่อยอยู่ กรุณาย้ายหรือลบหน่วยงานย่อยก่อน",
      );
    dispatch(deleteSetting(kind, id));
  };
