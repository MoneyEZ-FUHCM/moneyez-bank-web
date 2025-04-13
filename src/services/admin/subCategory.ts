import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { SubCategory } from "@/types/category.types";
import { transformCommonResponse } from "@/types/common.type";

const { HTTP_METHOD } = COMMON_CONSTANT;
const subSubCategoryManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubCategoryList: builder.query({
      query: ({ PageIndex, PageSize, search }) => ({
        url: `/subcategories?PageIndex=${PageIndex}&PageSize=${PageSize}&search=${search}&is_deleted=false`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<SubCategory>(response),
      providesTags: ["SubCategory"],
    }),
    createSubCategory: builder.mutation({
      query: (payload) => ({
        url: "/subcategories/create",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["SubCategory"],
    }),
    deleteSubCategory: builder.mutation({
      query: (payload) => ({
        url: `/subcategories/${payload}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["SubCategory"],
    }),
    assignSubcategories: builder.mutation({
      query: (payload) => ({
        url: `/subcategories/assign`,
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["SubCategory"],
    }),
    unAssignSubcategories: builder.mutation({
      query: (payload) => ({
        url: `/subcategories/remove`,
        method: HTTP_METHOD.DELETE,
        body: payload,
      }),
      invalidatesTags: ["SubCategory"],
    }),
    updateSubcategory: builder.mutation({
      query: (payload) => ({
        url: `/subcategories/update`,
        method: HTTP_METHOD.PUT,
        body: payload,
      }),
      invalidatesTags: ["SubCategory"],
    }),
  }),
});

export const {
  useGetSubCategoryListQuery,
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useAssignSubcategoriesMutation,
  useUnAssignSubcategoriesMutation,
  useUpdateSubcategoryMutation,
} = subSubCategoryManagementApi;

export default subSubCategoryManagementApi;
