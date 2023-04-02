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

    verifyEmail: builder.mutation<void, any>({
      query: (payload) => ({
        method: "POST",
        url: `${BASE_PATH}/verify-email`,
        body: payload,
      }),
    }),

    resendCode: builder.mutation<void, any>({
      query: (payload) => ({
        method: "POST",
        url: `${BASE_PATH}/resend-code`,
        body: payload,
      }),
    }),
  }),
});

export default authSlice;

export const {
  useLogInMutation,
  useSignUpMutation,
  useVerifyEmailMutation,
  useResendCodeMutation,
} = authSlice;
