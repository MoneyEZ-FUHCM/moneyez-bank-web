import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";

const { HTTP_METHOD } = COMMON_CONSTANT;
const webHookManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWebHookConfigList: builder.query({
      query: ({ PageIndex, PageSize, accountId }) => ({
        url: `/webhooks/account/${accountId}?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      providesTags: ["Webhook"],
    }),
  }),
});

export const { useGetWebHookConfigListQuery } = webHookManagementApi;

export default webHookManagementApi;
