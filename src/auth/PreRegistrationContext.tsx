import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

export type PreRegistrationStatus = "pending" | "approved" | "rejected";

export type PreRegistrationInput = {
  employee_code: string;
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

export type PreRegistration = PreRegistrationInput & {
  id: string;
  supplierId: number;
  supplierName: string;
  requestStatus: PreRegistrationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
};

type PreRegistrationContextValue = {
  requests: PreRegistration[];
  submitRequest: (input: PreRegistrationInput) => void;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string, reason: string) => void;
};

const STORAGE_KEY = "demo_pre_registrations";

const initialRequests: PreRegistration[] = [
  {
    id: "PRE-DEMO-001",
    employee_code: "PRE001",
    prefix: "mr",
    first_name: "สมชาย",
    last_name: "ทดลองงาน",
    department: "Construction",
    position: "Worker",
    birth_date: "1995-05-12",
    nationality: "TH",
    company: "Supplier A",
    gender: "male",
    note: "รายการตัวอย่างสำหรับให้ Admin ตรวจสอบ",
    photo_url: "",
    status: "active",
    supplierId: 101,
    supplierName: "Supplier A",
    requestStatus: "pending",
    submittedAt: new Date().toISOString(),
  },
];

const PreRegistrationContext =
  createContext<PreRegistrationContextValue | null>(null);

const loadRequests = (): PreRegistration[] => {
  if (typeof window === "undefined") return initialRequests;

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    return storedValue
      ? (JSON.parse(storedValue) as PreRegistration[])
      : initialRequests;
  } catch {
    return initialRequests;
  }
};

export function PreRegistrationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [requests, setRequests] =
    useState<PreRegistration[]>(loadRequests);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  const value = useMemo<PreRegistrationContextValue>(
    () => ({
      requests,
      submitRequest: (input) => {
        if (!user?.supplierId) return;

        const newRequest: PreRegistration = {
          ...input,
          id: `PRE-${Date.now()}`,
          supplierId: user.supplierId,
          supplierName: user.name,
          requestStatus: "pending",
          submittedAt: new Date().toISOString(),
        };

        setRequests((current) => [newRequest, ...current]);
      },
      approveRequest: (id) => {
        setRequests((current) =>
          current.map((request) =>
            request.id === id
              ? {
                  ...request,
                  requestStatus: "approved",
                  reviewedAt: new Date().toISOString(),
                  reviewedBy: user?.name ?? "Admin",
                  rejectionReason: undefined,
                }
              : request,
          ),
        );
      },
      rejectRequest: (id, reason) => {
        setRequests((current) =>
          current.map((request) =>
            request.id === id
              ? {
                  ...request,
                  requestStatus: "rejected",
                  reviewedAt: new Date().toISOString(),
                  reviewedBy: user?.name ?? "Admin",
                  rejectionReason: reason,
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
