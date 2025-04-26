import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { transformCommonResponse } from "@/helpers/types/common.type";
import { WebhookConfig } from "@/helpers/types/webHook.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const webHookManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWebHookConfigList: builder.query({
      query: ({ PageIndex, PageSize, accountId }) => ({
        url: `/webhooks/account/${accountId}?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<WebhookConfig>(response),
      providesTags: ["Webhook"],
    }),
  }),
});

export const { useGetWebHookConfigListQuery } = webHookManagementApi;

export default webHookManagementApi;
