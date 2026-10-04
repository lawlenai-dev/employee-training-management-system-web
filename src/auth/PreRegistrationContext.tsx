import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

export type PreRegistrationStatus = "pending" | "approved" | "rejected";

export type PreRegistrationInput = {
  employee_code?: string;
  blood_group?: string;
  active?: boolean | number | string;
  requestType?: "register" | "update";
  prefix: string;
  first_name: string;
  last_name: string;
  department: string;
  position: string;
  birth_date: string;
  nationality: string;
  company: string;
  gender: string;
  note: string;
  photo_url: string;
  status: string;
};

export type PreRegistrationChange = {
  field: keyof PreRegistrationInput;
  before?: string | number | boolean;
  after?: string | number | boolean;
};
export type PreRegistrationLog = {
  id: string;
  action: "register" | "update" | "approved" | "rejected";
  at: string;
  by?: string;
  note?: string;
  changes?: PreRegistrationChange[];
};

export type PreRegistration = PreRegistrationInput & {
  id: string;
  supplierId: number;
  supplierName: string;
  requestStatus: PreRegistrationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  submittedBy?: string;
  history?: PreRegistrationLog[];
  blood_group?: string;
  active: boolean | number | string;
};

type PreRegistrationContextValue = {
  requests: PreRegistration[];
  submitRequest: (input: PreRegistrationInput, previous?: PreRegistrationInput) => void;
  updateRequest: (id: string, input: Partial<PreRegistrationInput>) => void;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string, reason: string) => void;
};

const makeId = () => globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const STORAGE_KEY = "demo_pre_registrations";

const initialRequests: PreRegistration[] = [
  {
    id: "PRE-DEMO-001",
    requestType: "register",
    prefix: "นาย",
    first_name: "สมชาย",
    last_name: "ทดลองงาน",
    department: "Construction",
    position: "Worker",
    birth_date: "1995-05-12",
    nationality: "TH",
    company: "Supplier A",
    gender: "male",
    note: "",
    photo_url: "",
    status: "active",
    supplierId: 101,
    supplierName: "Supplier A",
    requestStatus: "pending",
    submittedAt: new Date().toISOString(),
    blood_group: "A",
    active: 1,
  },
];

const PreRegistrationContext =
  createContext<PreRegistrationContextValue | null>(null);

export const getRequestHistory = (request: PreRegistration): PreRegistrationLog[] => {
  if (request.history?.length) return request.history;
  // Legacy records: reconstruct only events with stored timestamps.
  const logs: PreRegistrationLog[] = [{
    id: `${request.id}-submitted`,
    action: request.requestType ?? (request.employee_code?.trim() ? "update" : "register"),
    at: request.submittedAt,
    by: request.submittedBy,
  }];
  if (request.reviewedAt && request.requestStatus !== "pending") logs.push({
    id: `${request.id}-reviewed`, action: request.requestStatus,
    at: request.reviewedAt, by: request.reviewedBy, note: request.rejectionReason,
  });
  return logs;
};

const changeFields: (keyof PreRegistrationInput)[] = [
  "employee_code", "prefix", "first_name", "last_name", "department", "position",
  "birth_date", "nationality", "company", "gender", "note", "photo_url", "status",
  "blood_group", "active",
];
const getChanges = (previous: PreRegistrationInput, next: PreRegistrationInput) =>
  changeFields.filter((field) => previous[field] !== next[field])
    .map((field) => ({ field, before: previous[field], after: next[field] }));

const loadRequests = (): PreRegistration[] => {
  if (typeof window === "undefined") return initialRequests;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialRequests;
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return initialRequests;
    return (parsed as PreRegistration[]).map((request) => ({
      ...request,
      requestType: request.requestType ?? (request.employee_code?.trim() ? "update" : "register"),
      active: request.active ?? 1,
      history: getRequestHistory(request),
    }));
  } catch { return initialRequests; }
};

export function PreRegistrationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<PreRegistration[]>(loadRequests);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  const value = useMemo<PreRegistrationContextValue>(
    () => ({
      requests,
      submitRequest: (input, previous) => {
        if (!user?.supplierId) return;

        const at = new Date().toISOString();
        const id = `PRE-${makeId()}`;
        const requestType = input.requestType ?? (input.employee_code?.trim() ? "update" : "register");
        if (requestType === "update" && !input.employee_code?.trim()) {
          throw new Error("คำขอแก้ไขข้อมูลต้องมีรหัสพนักงาน");
        }
        const newRequest: PreRegistration = {
          ...input,
          id,
          requestType,
          employee_code: requestType === "register" ? undefined : input.employee_code?.trim(),
          supplierId: user.supplierId,
          supplierName: user.name,
          requestStatus: "pending",
          submittedAt: at,
          submittedBy: user.name,
          active: input.active ?? 1,
          history: [{ id: makeId(), action: requestType, at, by: user.name,
            changes: requestType === "update" && previous ? getChanges(previous, input) : undefined }],
        };

        setRequests((current) => [newRequest, ...current]);
      },
      updateRequest: (id, input) => {
        const at = new Date().toISOString();
        const logId = makeId();
        setRequests((current) => current.map<PreRegistration>((request) => {
          if (request.id !== id || request.requestStatus !== "pending") return request;
          const next = { ...request, ...input, requestType: request.requestType,
            employee_code: request.employee_code, active: input.active ?? request.active };
          const changes = getChanges(request, next);
          if (!changes.length) return request;
          return { ...next, history: [...getRequestHistory(request), {
            id: logId, action: "update", at, by: user?.name, changes,
          }] };
        }));
      },
      approveRequest: (id) => {
        const at = new Date().toISOString();
        const logId = makeId();
        setRequests((current) =>
          current.map<PreRegistration>((request) =>
            request.id === id && request.requestStatus === "pending"
              ? {
                  ...request,
                  requestStatus: "approved",
                  reviewedAt: at,
                  reviewedBy: user?.name ?? "Admin",
                  rejectionReason: undefined,
                  history: [...getRequestHistory(request), { id: logId, action: "approved", at, by: user?.name ?? "Admin" }],
                }
              : request,
          ),
        );
      },
      rejectRequest: (id, reason) => {
        if (!reason.trim()) throw new Error("กรุณาระบุเหตุผลที่ไม่อนุมัติ");
        const at = new Date().toISOString();
        const logId = makeId();
        setRequests((current) =>
          current.map<PreRegistration>((request) =>
            request.id === id && request.requestStatus === "pending"
              ? {
                  ...request,
                  requestStatus: "rejected",
                  reviewedAt: at,
                  reviewedBy: user?.name ?? "Admin",
                  rejectionReason: reason.trim(),
                  history: [...getRequestHistory(request), { id: logId, action: "rejected", at, by: user?.name ?? "Admin", note: reason.trim() }],
                }
              : request,
          ),
        );
      },
    }),
    [requests, user],
  );

  return (
    <PreRegistrationContext.Provider value={value}>
      {children}
    </PreRegistrationContext.Provider>
  );
}

export function usePreRegistrations(): PreRegistrationContextValue {
  const context = useContext(PreRegistrationContext);

  if (!context) {
    throw new Error(
      "usePreRegistrations ต้องใช้งานภายใน PreRegistrationProvider",
    );
  }

  return context;
}
