import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type AuthState = { accountId: number | null };
const initialState: AuthState = { accountId: null };
const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signedIn: (state, action: PayloadAction<number>) => {
      state.accountId = action.payload;
    },
    signedOut: (state) => {
      state.accountId = null;
    },
  },
});
export const { signedIn, signedOut } = slice.actions;
export default slice.reducer;
