import { createSlice } from "@reduxjs/toolkit";

export interface AppState {
  user: User | null;
  snackMsg: string;
}

const initialState: AppState = {
  snackMsg: "",
  user: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setSnackMsg(state, action) {
      state.snackMsg = action.payload;
    },
  },
});

export const appReducer = appSlice.reducer;

export const { setUser, setSnackMsg } = appSlice.actions;

export default appSlice.reducer;
