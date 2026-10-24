import type {
  PreRegistration,
  PreRegistrationInput,
  PreRegistrationLog,
} from "./preRegistration.types";
export const getRequestHistory = (
  request: PreRegistration,
): PreRegistrationLog[] => {
  if (request.history?.length) return request.history;
  // Legacy records: reconstruct only events with stored timestamps.
  const logs: PreRegistrationLog[] = [
    {
      id: `${request.id}-submitted`,
      action:
        request.requestType ??
        (request.employee_code?.trim() ? "update" : "register"),
      at: request.submittedAt,
      by: request.submittedBy,
    },
  ];
  if (request.reviewedAt && request.requestStatus !== "pending")
    logs.push({
      id: `${request.id}-reviewed`,
      action: request.requestStatus,
      at: request.reviewedAt,
      by: request.reviewedBy,
      note: request.rejectionReason,
    });
  return logs;
};

const changeFields: (keyof PreRegistrationInput)[] = [
  "employee_code",
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
export const getChanges = (
  previous: PreRegistrationInput,
  next: PreRegistrationInput,
) =>
  changeFields
    .filter((field) => previous[field] !== next[field])
    .map((field) => ({ field, before: previous[field], after: next[field] }));
