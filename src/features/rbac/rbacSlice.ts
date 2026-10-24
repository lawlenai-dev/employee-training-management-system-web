import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "../../app/store";
import type { AccessState } from "./rbac.types";
import {
  createInitialRbacState,
  saveRoleState,
  saveUserState,
  deleteItemState,
  assertManagerRemains,
} from "./rbacModel";
import { requirePermission } from "./rbacSelectors";
import { signedOut } from "../auth/authSlice";

const slice = createSlice({
  name: "rbac",
  initialState: createInitialRbacState,
  reducers: {
    replaced: (_state, action: PayloadAction<AccessState>) => action.payload,
  },
});
export default slice.reducer;

const changeRbac =
  (transform: (state: AccessState) => AccessState): AppThunk =>
  (dispatch, getState) => {
    requirePermission(getState(), "settings.view");
    const previous = getState().rbac;
    const next = transform(previous);
    assertManagerRemains(previous, next);
    dispatch(slice.actions.replaced(next));
    const account = next.users.find(
      (user) => user.accountId === getState().auth.accountId,
    );
    if (!account || account.status !== "active") dispatch(signedOut());
  };
export const saveAccessRole = (
  input: Parameters<typeof saveRoleState>[1],
): AppThunk => changeRbac((state) => saveRoleState(state, input));
export const saveAccessUser = (
  input: Parameters<typeof saveUserState>[1],
): AppThunk => changeRbac((state) => saveUserState(state, input));
export const deleteAccessItem = (
  kind: "roles" | "users",
  id: string,
): AppThunk => changeRbac((state) => deleteItemState(state, kind, id));
export const assignUserRoles =
  (userId: string, roleIds: string[]): AppThunk =>
  (dispatch, getState) => {
    const user = getState().rbac.users.find((item) => item.id === userId);
    if (!user) throw new Error("ไม่พบผู้ใช้งาน");
    dispatch(
      changeRbac((state) => {
        if (roleIds.some((id) => !state.roles.some((role) => role.id === id)))
          throw new Error("บทบาทถูกลบแล้ว กรุณาเลือกใหม่");
        return {
          ...state,
          users: state.users.map((item) =>
            item.id === userId
              ? { ...item, roleIds: [...new Set(roleIds)] }
              : item,
          ),
        };
      }),
    );
  };
