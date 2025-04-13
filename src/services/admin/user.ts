import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { transformCommonResponse } from "@/types/common.type";
import { User } from "@/types/user.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const userManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserList: builder.query({
      query: ({ PageIndex, PageSize, search }) => ({
        url: `/users?PageIndex=${PageIndex}&PageSize=${PageSize}&search=${search}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse<User>(response),
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: "/users",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (payload) => ({
        url: `/users/${payload}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserListQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
} = userManagementApi;

export default userManagementApi;
