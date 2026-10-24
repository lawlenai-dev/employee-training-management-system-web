import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "../../app/store";
import { requirePermission } from "../rbac/rbacSelectors";
import type {
  PersonalForm,
  PersonalRow,
  SettingKey,
} from "./personalSettings.types";
import { initialPersonalData } from "./personalSettingsSeed";

const slice = createSlice({
  name: "personalSettings",
  initialState: initialPersonalData,
  reducers: {
    rowSaved: (
      state,
      { payload }: PayloadAction<{ key: SettingKey; row: PersonalRow }>,
    ) => {
      const index = state[payload.key].findIndex(
        (row) => row.id === payload.row.id,
      );
      if (index === -1) state[payload.key].push(payload.row);
      else state[payload.key][index] = payload.row;
    },
  },
});
export default slice.reducer;
export const savePersonalSetting =
  (key: SettingKey, form: PersonalForm, id?: number): AppThunk =>
  (dispatch, getState) => {
    requirePermission(getState(), "settings.view");
    const rows = getState().personalSettings[key];
    if (!form.code.trim() || !form.nameTh.trim())
      throw new Error("กรุณากรอกรหัสและชื่อภาษาไทย");
    if (id !== undefined && !rows.some((row) => row.id === id))
      throw new Error("ไม่พบรายการนี้แล้ว");
    if (
      rows.some(
        (row) =>
          row.id !== id &&
          row.code.toLowerCase() === form.code.trim().toLowerCase(),
      )
    )
      throw new Error("รหัสนี้มีอยู่แล้ว");
    const row: PersonalRow = {
      ...form,
      code: form.code.trim().toUpperCase(),
      nameTh: form.nameTh.trim(),
      nameEn: form.nameEn.trim(),
      id: id ?? Math.max(0, ...rows.map((row) => row.id)) + 1,
    };
    dispatch(slice.actions.rowSaved({ key, row }));
  };
