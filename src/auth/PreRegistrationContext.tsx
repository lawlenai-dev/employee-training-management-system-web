import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import * as actions from "../features/preRegistrations/preRegistrationSlice";
import type {
  PreRegistration,
  PreRegistrationInput,
} from "../features/preRegistrations/preRegistration.types";
export type {
  PreRegistration,
  PreRegistrationInput,
  PreRegistrationStatus,
  PreRegistrationLog,
  PreRegistrationChange,
} from "../features/preRegistrations/preRegistration.types";
export { getRequestHistory } from "../features/preRegistrations/preRegistrationModel";
type PreRegistrationContextValue = {
  requests: PreRegistration[];
  submitRequest: (
    input: PreRegistrationInput,
    previous?: PreRegistrationInput,
  ) => void;
  updateRequest: (id: string, input: Partial<PreRegistrationInput>) => void;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string, reason: string) => void;
};

const PreRegistrationContext =
  createContext<PreRegistrationContextValue | null>(null);
export function PreRegistrationProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const requests = useAppSelector((state) => state.preRegistrations.requests);
  const value = useMemo<PreRegistrationContextValue>(
    () => ({
      requests,
      submitRequest: (input, previous) => {
        dispatch(actions.submitRequest(input, previous));
      },
      updateRequest: (id, input) => {
        dispatch(actions.updateRequest(id, input));
      },
      approveRequest: (id) => {
        dispatch(actions.approveRequest(id));
      },
      rejectRequest: (id, reason) => {
        dispatch(actions.rejectRequest(id, reason));
      },
    }),
    [dispatch, requests],
  );
  return (
    <PreRegistrationContext.Provider value={value}>
      {children}
    </PreRegistrationContext.Provider>
  );
}
export function usePreRegistrations(): PreRegistrationContextValue {
  const context = useContext(PreRegistrationContext);
  if (!context)
    throw new Error(
      "usePreRegistrations ต้องใช้งานภายใน PreRegistrationProvider",
    );
  return context;
}
