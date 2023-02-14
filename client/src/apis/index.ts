import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
// import { getToken } from "../utils/auth"

export const EDT_BASE_API_REDUCER_KEY = "baseApi";

export const queryTagTypes = { POST: "POST" };

const customBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_APP_API_URL,
  prepareHeaders: (headers) => {
    // const accessToken = getToken()
    // if (accessToken) {
    //   headers.set("Authorization", `Bearer ${accessToken}`)
    // }
    return headers;
  },
});

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  return await customBaseQuery(args, api, extraOptions);
};

const baseApi = createApi({
  reducerPath: EDT_BASE_API_REDUCER_KEY,
  baseQuery,
  tagTypes: Object.values(queryTagTypes),
  endpoints: () => ({}),
});

export default baseApi;
