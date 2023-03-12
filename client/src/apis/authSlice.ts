import baseApi from ".";
import { queryTagTypes } from ".";

const BASE_PATH = "/auth";

const authSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    logIn: builder.mutation<any, any>({
      query: (payload) => ({
        method: "POST",
        url: `${BASE_PATH}/login`,
        body: payload,
      }),
      invalidatesTags: [queryTagTypes.POST],
    }),

    signUp: builder.mutation<void, any>({
      query: (payload) => ({
        method: "POST",
        url: `${BASE_PATH}/signup`,
        body: payload,
      }),
    }),
  }),
});

export default authSlice;

export const { useLogInMutation, useSignUpMutation } = authSlice;
