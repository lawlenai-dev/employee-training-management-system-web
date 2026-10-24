import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "../../app/store";
import type {
  MasterSettingKey,
  SettingRow,
} from "../../pages/settings/settings.types";
import { requirePermission } from "../rbac/rbacSelectors";
import { createInitialSettings } from "./settingsSeed";

const slice = createSlice({
  name: "settings",
  initialState: () => ({ rowsByMenu: createInitialSettings() }),
  reducers: {
    rowSaved: (
      state,
      { payload }: PayloadAction<{ menu: MasterSettingKey; row: SettingRow }>,
    ) => {
      const rows = (state.rowsByMenu[payload.menu] ??= []);
      const index = rows.findIndex((row) => row.id === payload.row.id);
      if (index === -1) rows.push(payload.row);
      else rows[index] = payload.row;
    },
    rowDeleted: (
      state,
      {
        payload,
      }: PayloadAction<{ menu: MasterSettingKey; id: string | number }>,
    ) => {
      state.rowsByMenu[payload.menu] = (
        state.rowsByMenu[payload.menu] ?? []
      ).filter((row) => row.id !== payload.id);
    },
  },
});
export default slice.reducer;
export const saveSetting =
  (
    menu: MasterSettingKey,
    values: Record<string, unknown>,
    id?: string | number,
  ): AppThunk =>
  (dispatch, getState) => {
    requirePermission(getState(), "settings.view");
    const rows = getState().settings.rowsByMenu[menu] ?? [];
    if (id !== undefined && !rows.some((row) => row.id === id))
      throw new Error("รายการนี้ถูกลบแล้ว กรุณาเปิดใหม่");
    const key = menu === "subcontractors" ? "supplierNameTH" : "code";
    const value = String(values[key] ?? "")
      .trim()
      .toLowerCase();
    if (!value)
      throw new Error(
        menu === "subcontractors" ? "กรุณากรอกชื่อบริษัท" : "กรุณากรอกรหัส",
      );
    if (
      rows.some(
        (row) =>
          row.id !== id &&
          String(row[key] ?? "")
            .trim()
            .toLowerCase() === value,
      )
    )
      throw new Error("รหัสหรือชื่อรายการนี้มีอยู่แล้ว");
    const row: SettingRow = { ...values, id: id ?? nanoid() };
    dispatch(slice.actions.rowSaved({ menu, row }));
  };
export const deleteSetting =
  (menu: MasterSettingKey, id: string | number): AppThunk =>
  (dispatch, getState) => {
    requirePermission(getState(), "settings.view");

    const hasSubsections =
      menu === "sections" &&
      (getState().settings.rowsByMenu.subsections ?? []).some(
        (row) =>
          row.sectionId !== undefined &&
          row.sectionId !== null &&
          String(row.sectionId) === String(id),
      );

    if (hasSubsections) {
      throw new Error(
        "ส่วนงานนี้มีหน่วยงานย่อยอยู่ กรุณาย้ายหรือลบหน่วยงานย่อยก่อน",
      );
    }

    dispatch(slice.actions.rowDeleted({ menu, id }));
  };
