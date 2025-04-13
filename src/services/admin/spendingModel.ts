import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import {
  transformBaseResponse,
  transformCommonResponse,
} from "@/types/common.type";
import { SpendingModel } from "@/types/spendingModel.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const spendingModelManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSpendingModelList: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `/spending-models?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<SpendingModel>(response),
      providesTags: ["SpendingModel"],
    }),
    createSpendingModel: builder.mutation({
      query: (payload) => ({
        url: "/spending-models",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["SpendingModel"],
    }),
    deleteSpendingModel: builder.mutation({
      query: (payload) => ({
        url: `/spending-models/${payload}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["SpendingModel"],
    }),
    getSpendingModelId: builder.query({
      query: (id) => ({
        url: `/spending-models/${id}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformBaseResponse<SpendingModel>(response),
      providesTags: ["SpendingModel"],
    }),
    addCategoryModalToSpendingModel: builder.mutation({
      query: (payload) => ({
        url: `/spending-models/categories/`,
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["SpendingModel"],
    }),
    removecategoryFromSpendingModel: builder.mutation({
      query: (payload) => ({
        url: `/spending-models/categories/`,
        method: HTTP_METHOD.DELETE,
        body: payload,
      }),
      invalidatesTags: ["SpendingModel"],
    }),
    updateSpendingModel: builder.mutation({
      query: (payload) => ({
        url: `/spending-models/categories`,
        method: HTTP_METHOD.PUT,
        body: payload,
      }),
      invalidatesTags: ["SpendingModel"],
    }),
    updateSpendingModelContent: builder.mutation({
      query: (payload) => ({
        url: `/spending-models`,
        method: HTTP_METHOD.PUT,
        body: payload,
      }),
      invalidatesTags: ["SpendingModel"],
    }),
  }),
});

export const {
  useGetSpendingModelListQuery,
  useCreateSpendingModelMutation,
  useDeleteSpendingModelMutation,
  useGetSpendingModelIdQuery,
  useAddCategoryModalToSpendingModelMutation,
  useRemovecategoryFromSpendingModelMutation,
  useUpdateSpendingModelMutation,
  useUpdateSpendingModelContentMutation,
} = spendingModelManagementApi;

export default spendingModelManagementApi;
