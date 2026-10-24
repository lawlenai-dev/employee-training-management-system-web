import type { RootState } from "./rootReducer";
import { isRbacState } from "../features/rbac/rbacModel";
import { getRequestHistory } from "../features/preRegistrations/preRegistrationModel";
import type { PreRegistration } from "../features/preRegistrations/preRegistration.types";

export const STORAGE_KEY = "training_app_rtk_v1";
export type StorageLike = Pick<Storage, "getItem" | "setItem">;
const object = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));
const row = (value: unknown) =>
  object(value) &&
  (typeof value.id === "string" || typeof value.id === "number");
const personalKeys = [
  "nationalities",
  "bloodTypes",
  "genders",
  "prefixes",
] as const;
const masterKeys = ["positions", "subcontractors", "categories", "types"] as const;

function isPersistedState(value: unknown): value is RootState {
  if (!object(value) || !object(value.auth) || !isRbacState(value.rbac))
    return false;
  if (value.auth.accountId !== null && typeof value.auth.accountId !== "number")
    return false;
  if (
    !object(value.settings) ||
    !object(value.settings.rowsByMenu) ||
    !object(value.personalSettings) ||
    !object(value.preRegistrations)
  )
    return false;
  const rows = value.settings.rowsByMenu;
  const personal = value.personalSettings;
  return (
    masterKeys.every(
      (key) => Array.isArray(rows[key]) && rows[key].every(row),
    ) &&
    personalKeys.every(
      (key) =>
        Array.isArray(personal[key]) &&
        personal[key].every(
          (item) =>
            row(item) &&
            object(item) &&
            typeof item.code === "string" &&
            typeof item.nameTh === "string" &&
            typeof item.nameEn === "string" &&
            ["active", "inactive"].includes(String(item.status)),
        ),
    ) &&
    Array.isArray(value.preRegistrations.requests) &&
    value.preRegistrations.requests.every(isRequest)
  );
}
function isRequest(value: unknown): value is PreRegistration {
  return (
    object(value) &&
    typeof value.id === "string" &&
    typeof value.supplierId === "number" &&
    typeof value.first_name === "string" &&
    typeof value.last_name === "string" &&
    typeof value.submittedAt === "string" &&
    ["pending", "approved", "rejected"].includes(String(value.requestStatus))
  );
}
function normalizeRequests(requests: PreRegistration[]) {
  return requests.map((request) => ({
    ...request,
    requestType:
      request.requestType ??
      (request.employee_code?.trim()
        ? ("update" as const)
        : ("register" as const)),
    active: request.active ?? 1,
    history: getRequestHistory(request),
  }));
}

// Legacy keys are read once when the new snapshot is absent. They are never deleted.
export function loadPersistedState(
  fallback: RootState,
  storage?: StorageLike,
): RootState {
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw);
      if (
        !object(parsed) ||
        parsed.version !== 1 ||
        !isPersistedState(parsed.state)
      )
        throw new Error("รูปแบบข้อมูล Redux ที่บันทึกไว้ไม่ถูกต้อง");
      return { ...parsed.state, persistence: { error: "" } };
    }
    const state: RootState = structuredClone(fallback);
    const rbac = storage.getItem("demo_rbac_v1");
    if (rbac !== null) {
      const parsed: unknown = JSON.parse(rbac);
      if (!isRbacState(parsed))
        throw new Error("รูปแบบข้อมูล Role เดิมไม่ถูกต้อง");
      state.rbac = parsed;
    }
    const requests = storage.getItem("demo_pre_registrations");
    if (requests !== null) {
      const parsed: unknown = JSON.parse(requests);
      if (!Array.isArray(parsed) || !parsed.every(isRequest))
        throw new Error("รูปแบบข้อมูลคำขอเดิมไม่ถูกต้อง");
      state.preRegistrations.requests = normalizeRequests(parsed);
    }
    const identity = storage.getItem("demo_auth_user");
    if (identity !== null) {
      const parsed: unknown = JSON.parse(identity);
      if (
        object(parsed) &&
        typeof parsed.id === "number" &&
        state.rbac.users.some(
          (user) => user.accountId === parsed.id && user.status === "active",
        )
      )
        state.auth.accountId = parsed.id;
    }
    return state;
  } catch (cause) {
    // Fail closed, retain the original bytes, and show the error instead of overwriting.
    return {
      ...fallback,
      auth: { accountId: null },
      rbac: { version: 1, nextAccountId: 1, roles: [], users: [] },
      persistence: {
        error: `อ่านข้อมูลเดิมไม่สำเร็จ: ${cause instanceof Error ? cause.message : "ข้อมูลไม่ถูกต้อง"} กรุณาสำรองและตรวจสอบข้อมูลก่อนเริ่มใหม่`,
      },
    };
  }
}

export function savePersistedState(state: RootState, storage: StorageLike) {
  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 1,
      state: { ...state, persistence: { error: "" } },
    }),
  );
}
