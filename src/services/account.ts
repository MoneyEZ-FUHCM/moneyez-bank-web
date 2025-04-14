import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { BankAccount } from "@/types/bankAccount.types";
import { transformCommonResponse } from "@/types/common.type";

const { HTTP_METHOD } = COMMON_CONSTANT;
const accountManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAccountList: builder.query({
      query: ({ PageIndex, PageSize, search }) => ({
        url: `/accounts?PageIndex=${PageIndex}&PageSize=${PageSize}&search=${search}&sort_by=date&dir=desc&is_deleted=false`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<BankAccount>(response),
      providesTags: ["Account"],
    }),
    getAccountListAll: builder.query({
      query: () => ({
        url: `/accounts/all`,
        method: HTTP_METHOD.GET,
      }),
    }),
    createAccount: builder.mutation({
      query: (payload) => ({
        url: "/accounts/admin",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["Account"],
    }),
    deleteAccount: builder.mutation({
      query: (payload) => ({
        url: `/accounts/admin?id=${payload}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["Account"],
    }),
    getDetailBankAccount: builder.query({
      query: (payload) => ({
        url: `/accounts/${payload}`,
        method: HTTP_METHOD.GET,
      }),
      providesTags: ["Transaction"],
    }),
  }),
});

export const {
  useGetAccountListQuery,
  useCreateAccountMutation,
  useDeleteAccountMutation,
  useGetDetailBankAccountQuery,
  useGetAccountListAllQuery,
} = accountManagementApi;

export default accountManagementApi;
