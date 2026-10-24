import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAppSelector } from "./hooks";

function PersistenceNotice() {
  const error = useAppSelector((state) => state.persistence.error);
  return error ? (
    <div
      role="alert"
      className="relative z-[200] border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-900"
    >
      {error}
    </div>
  ) : null;
}
export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistenceNotice />
      {children}
    </Provider>
  );
}
