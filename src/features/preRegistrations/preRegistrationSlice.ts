import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "../../app/store";
import type { RootState } from "../../app/rootReducer";
import type {
  PreRegistration,
  PreRegistrationInput,
} from "./preRegistration.types";
import { createInitialRequests } from "./preRegistrationSeed";
import { getChanges, getRequestHistory } from "./preRegistrationModel";
import { requirePermission, selectCurrentUser } from "../rbac/rbacSelectors";

const slice = createSlice({
  name: "preRegistrations",
  initialState: () => ({ requests: createInitialRequests() }),
  reducers: {
    requestAdded: (state, action: PayloadAction<PreRegistration>) => {
      state.requests.unshift(action.payload);
    },
    requestReplaced: (state, action: PayloadAction<PreRegistration>) => {
      const index = state.requests.findIndex(
        (request) => request.id === action.payload.id,
      );
      if (index !== -1) state.requests[index] = action.payload;
    },
  },
});
export default slice.reducer;

export const submitRequest =
  (input: PreRegistrationInput, previous?: PreRegistrationInput): AppThunk =>
  (dispatch, getState) => {
    requirePermission(getState(), "preregistration.create");
    const user = selectCurrentUser(getState());
    if (!user?.supplierId)
      throw new Error("กรุณากำหนดบริษัทให้ผู้ใช้ก่อนส่งคำขอ");
    const requestType =
      input.requestType ??
      (input.employee_code?.trim() ? "update" : "register");
    if (requestType === "update" && !input.employee_code?.trim())
      throw new Error("คำขอแก้ไขข้อมูลต้องมีรหัสพนักงาน");
    const at = new Date().toISOString();
    const request: PreRegistration = {
      ...input,
      id: `PRE-${nanoid()}`,
      requestType,
      employee_code:
        requestType === "register" ? undefined : input.employee_code?.trim(),
      supplierId: user.supplierId,
      supplierName: user.name,
      requestStatus: "pending",
      submittedAt: at,
      submittedBy: user.name,
      active: input.active ?? 1,
      history: [
        {
          id: nanoid(),
          action: requestType,
          at,
          by: user.name,
          changes:
            requestType === "update" && previous
              ? getChanges(previous, input)
              : undefined,
        },
      ],
    };
    dispatch(slice.actions.requestAdded(request));
  };

function findPending(state: RootState, id: string) {
  const request = state.preRegistrations.requests.find(
    (item) => item.id === id,
  );
  if (!request) throw new Error("ไม่พบคำขอ");
  if (request.requestStatus !== "pending")
    throw new Error("คำขอนี้ได้รับการพิจารณาแล้ว");
  return request;
}
export const updateRequest =
  (id: string, input: Partial<PreRegistrationInput>): AppThunk =>
  (dispatch, getState) => {
    const state = getState();
    const user = selectCurrentUser(state);
    const request = findPending(state, id);
    const canEdit =
      user?.permissions.includes("preregistration.review") ||
      (user?.permissions.includes("preregistration.create") &&
        user.supplierId === request.supplierId);
    if (!canEdit) throw new Error("คุณไม่มีสิทธิ์แก้ไขคำขอนี้");
    const allowedKeys = [
      "prefix",
      "first_name",
      "last_name",
      "department",
      "position",
      "birth_date",
      "nationality",
      "company",
      "gender",
      "note",
      "photo_url",
      "status",
      "blood_group",
      "active",
    ];
    const changesInput = Object.fromEntries(
      Object.entries(input).filter(([key]) => allowedKeys.includes(key)),
    );
    const next: PreRegistration = {
      ...request,
      ...changesInput,
      active: input.active ?? request.active,
    };
    const changes = getChanges(request, next);
    if (!changes.length) return;
    dispatch(
      slice.actions.requestReplaced({
        ...next,
        history: [
          ...getRequestHistory(request),
          {
            id: nanoid(),
            action: "update",
            at: new Date().toISOString(),
            by: user?.name,
            changes,
          },
        ],
      }),
    );
  };
export const approveRequest =
  (id: string): AppThunk =>
  (dispatch, getState) => {
    requirePermission(getState(), "preregistration.review");
    const request = findPending(getState(), id);
    const user = selectCurrentUser(getState());
    const at = new Date().toISOString();
    dispatch(
      slice.actions.requestReplaced({
        ...request,
        requestStatus: "approved",
        reviewedAt: at,
        reviewedBy: user?.name,
        rejectionReason: undefined,
        history: [
          ...getRequestHistory(request),
          { id: nanoid(), action: "approved", at, by: user?.name },
        ],
      }),
    );
  };
export const rejectRequest =
  (id: string, reason: string): AppThunk =>
  (dispatch, getState) => {
    requirePermission(getState(), "preregistration.review");
    if (!reason.trim()) throw new Error("กรุณาระบุเหตุผลที่ไม่อนุมัติ");
    const request = findPending(getState(), id);
    const user = selectCurrentUser(getState());
    const at = new Date().toISOString();
    dispatch(
      slice.actions.requestReplaced({
        ...request,
        requestStatus: "rejected",
        reviewedAt: at,
        reviewedBy: user?.name,
        rejectionReason: reason.trim(),
        history: [
          ...getRequestHistory(request),
          {
            id: nanoid(),
            action: "rejected",
            at,
            by: user?.name,
            note: reason.trim(),
          },
        ],
      }),
    );
  };
