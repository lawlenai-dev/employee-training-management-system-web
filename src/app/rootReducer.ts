import { combineReducers } from "@reduxjs/toolkit";
import auth from "../features/auth/authSlice";
import rbac from "../features/rbac/rbacSlice";
import settings from "../features/settings/settingsSlice";
import personalSettings from "../features/settings/personalSettingsSlice";
import preRegistrations from "../features/preRegistrations/preRegistrationSlice";
import persistence from "./persistenceSlice";

export const rootReducer = combineReducers({
  auth,
  rbac,
  settings,
  personalSettings,
  preRegistrations,
  persistence,
});
export type RootState = ReturnType<typeof rootReducer>;
