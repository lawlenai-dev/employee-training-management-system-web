import type { AppThunk } from "../../app/store";
import type { LoginResult } from "./auth.types";
import { signedIn, signedOut } from "./authSlice";
import { selectCurrentUser } from "../rbac/rbacSelectors";

export const login =
  (username: string, password: string): AppThunk<LoginResult> =>
  (dispatch, getState) => {
    const account = getState().rbac.users.find(
      (user) =>
        user.username.toLowerCase() === username.trim().toLowerCase() &&
        user.status === "active" &&
        user.password !== "" &&
        user.password === password,
    );
    if (!account)
      return {
        ok: false,
        message: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง หรือบัญชีถูกปิดใช้งาน",
      };
    dispatch(signedIn(account.accountId));
    const user = selectCurrentUser(getState());
    return user ? { ok: true, user } : { ok: false, message: "ไม่พบผู้ใช้งาน" };
  };
export const logout = (): AppThunk => (dispatch) => {
  dispatch(signedOut());
};
