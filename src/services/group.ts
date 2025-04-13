import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";

const { HTTP_METHOD } = COMMON_CONSTANT;
const groupApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    acceptInvitation: builder.mutation({
      query: (token) => ({
        url: `/groups/invite-member/email/accept?token=${token}`,
        method: HTTP_METHOD.GET,
      }),
    }),
  }),
});

export const { useAcceptInvitationMutation } = groupApi;

export default groupApi;
