import { combineReducers, Reducer } from "redux";
import baseApi, { EDT_BASE_API_REDUCER_KEY } from "../apis";
import appReducer from "../App/App.reducer";

const reducers = {
  app: appReducer,
  [EDT_BASE_API_REDUCER_KEY]: baseApi.reducer,
};

const combinedReducers = combineReducers<typeof reducers>(reducers);
export type RootState = ReturnType<typeof combinedReducers>;

const rootReducer: Reducer<RootState> = (state, action) => {
  return combinedReducers(state, action);
};

export default rootReducer;
