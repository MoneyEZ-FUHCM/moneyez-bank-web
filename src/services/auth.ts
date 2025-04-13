import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { UserInfo } from "@/types/user.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({
        url: "/auth/login",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
    }),
    loginGoogle: builder.mutation({
      query: (payload) => ({
        url: "/auth/login/google",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
    }),
    register: builder.mutation({
      query: (payload) => ({
        url: "/auth/register",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
    }),
    verify: builder.mutation({
      query: (payload) => ({
        url: "/auth/verify-email",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/reset-password/request",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
    }),
    confirmOtp: builder.mutation({
      query: (payload) => ({
        url: "/auth/reset-password/confirm",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
    }),
    confirmNewPassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/reset-password/new-password",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
    }),
    getInfoUser: builder.query<{ data: UserInfo }, void>({
      query: () => ({
        url: "/users/current",
        method: HTTP_METHOD.GET,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyMutation,
  useLoginGoogleMutation,
  useResetPasswordMutation,
  useConfirmOtpMutation,
  useConfirmNewPasswordMutation,
  useGetInfoUserQuery,
} = authApi;

export default authApi;
