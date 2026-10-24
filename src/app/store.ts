import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import type { ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import type { RootState } from "./rootReducer";
import { loadPersistedState, savePersistedState } from "./persistence";
import type { StorageLike } from "./persistence";
import { errorChanged } from "./persistenceSlice";

function browserStorage(): StorageLike | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}
export function createAppStore(
  storage: StorageLike | undefined = browserStorage(),
) {
  const fallback = rootReducer(undefined, { type: "@@INIT" });
  const initialState = loadPersistedState(fallback, storage);
  const hydrationFailed = Boolean(initialState.persistence.error);
  const listener = createListenerMiddleware<RootState>();
  listener.startListening({
    predicate: (_action, current, previous) =>
      !hydrationFailed &&
      (current.auth !== previous.auth ||
        current.rbac !== previous.rbac ||
        current.settings !== previous.settings ||
        current.personalSettings !== previous.personalSettings ||
        current.preRegistrations !== previous.preRegistrations),
    effect: (_action, api) => {
      try {
        if (!storage) throw new Error("เบราว์เซอร์ไม่อนุญาตให้บันทึกข้อมูล");
        savePersistedState(api.getState(), storage);
        if (api.getState().persistence.error) api.dispatch(errorChanged(""));
      } catch {
        api.dispatch(
          errorChanged(
            "บันทึกลงเบราว์เซอร์ไม่สำเร็จ การเปลี่ยนแปลงล่าสุดยังอยู่ในหน่วยความจำ กรุณาแก้ปัญหาและกดบันทึกอีกครั้งก่อนปิดหน้า",
          ),
        );
      }
    },
  });
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listener.middleware),
  });
}
export const store = createAppStore();
export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore["dispatch"];
export type { RootState } from "./rootReducer";
export type AppThunk<Return = void> = ThunkAction<
  Return,
  RootState,
  unknown,
  UnknownAction
>;
