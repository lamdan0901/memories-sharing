import { createSlice } from "@reduxjs/toolkit";

export interface AppState {
  currentPost: PostPayload | null;
}

const initialState: AppState = {
  currentPost: {
    creator: "",
    title: "",
    message: "",
    tags: [],
    selectedFile: "",
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCurrentPost(state, action) {
      state.currentPost = action.payload;
    },
  },
});

export const appReducer = appSlice.reducer;

export const { setCurrentPost } = appSlice.actions;

export default appSlice.reducer;
