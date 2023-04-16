import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

export const EDT_BASE_API_REDUCER_KEY = "baseApi";

export const queryTagTypes = {
  ALL_POST: "ALL_POST",
  ONE_POST: "ONE_POST",
  POST_COMMENT: "POST_COMMENT",
  POST_LIKE: "POST_LIKE",
};

const customBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_APP_API_URL,
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      headers.set("Authorization", accessToken);
    }
    return headers;
  },
});

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) =>
  await customBaseQuery(args, api, extraOptions);

const baseApi = createApi({
  reducerPath: EDT_BASE_API_REDUCER_KEY,
  baseQuery,
  tagTypes: Object.values(queryTagTypes),
  endpoints: () => ({}),
});

export default baseApi;
