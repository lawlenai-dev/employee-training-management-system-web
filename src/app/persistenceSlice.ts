import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "persistence",
  initialState: { error: "" },
  reducers: {
    errorChanged: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});
export const { errorChanged } = slice.actions;
export default slice.reducer;
