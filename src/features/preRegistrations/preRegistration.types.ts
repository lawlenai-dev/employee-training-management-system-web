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
