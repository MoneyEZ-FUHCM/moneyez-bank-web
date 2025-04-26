import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { transformCommonResponse } from "@/helpers/types/common.type";
import { Transaction } from "@/helpers/types/transaction.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const transactionManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactionList: builder.query({
      query: ({ PageIndex, PageSize, accountId }) => ({
        url: `/transactions/account/${accountId}?PageIndex=${PageIndex}&PageSize=${PageSize}&sort_by=date&dir=desc&is_deleted=false`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<Transaction>(response),
      providesTags: ["Transaction"],
    }),
    createTransactionDeposit: builder.mutation({
      query: (payload) => ({
        url: "/transactions/deposit",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["Transaction"],
    }),
    createTransactionWithDraw: builder.mutation({
      query: (payload) => ({
        url: "/transactions/withdraw",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["Transaction"],
    }),
    createTransactionTransfer: builder.mutation({
      query: (payload) => ({
        url: "/transactions/transfer",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["Transaction"],
    }),
  }),
});

export const {
  useGetTransactionListQuery,
  useCreateTransactionDepositMutation,
  useCreateTransactionTransferMutation,
  useCreateTransactionWithDrawMutation,
} = transactionManagementApi;

export default transactionManagementApi;
