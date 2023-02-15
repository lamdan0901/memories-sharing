import { createSlice } from "@reduxjs/toolkit";

export interface AppState {
  currentPost: PostPayload | null;
  user: any;
}

const initialState: AppState = {
  currentPost: {
    creator: "",
    title: "",
    message: "",
    tags: [],
    selectedFile: "",
  },
  user: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCurrentPost(state, action) {
      state.currentPost = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const appReducer = appSlice.reducer;

export const { setCurrentPost, setUser } = appSlice.actions;

export default appSlice.reducer;
