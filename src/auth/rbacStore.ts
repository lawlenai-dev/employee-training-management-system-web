// Compatibility facade. Redux is the only source of state.
import { store } from "../app/store";
import * as actions from "../features/rbac/rbacSlice";
export { permissionGroups, permissionKeys } from "../features/rbac/rbac.types";
export type {
  Permission,
  AccessState,
  AccessRole,
  AccessUser,
} from "../features/rbac/rbac.types";
export { effectivePermissions } from "../features/rbac/rbacModel";
export const getAccessState = () => store.getState().rbac;
export const saveAccessRole = (
  input: Parameters<typeof actions.saveAccessRole>[0],
) => store.dispatch(actions.saveAccessRole(input));
export const saveAccessUser = (
  input: Parameters<typeof actions.saveAccessUser>[0],
) => store.dispatch(actions.saveAccessUser(input));
export const deleteAccessItem = (kind: "roles" | "users", id: string) =>
  store.dispatch(actions.deleteAccessItem(kind, id));
