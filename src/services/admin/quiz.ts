import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { transformCommonResponse } from "@/types/common.type";

const { HTTP_METHOD } = COMMON_CONSTANT;
const quizManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizList: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `/quiz?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse(response),
      providesTags: ["Quiz"],
    }),
    createQuiz: builder.mutation({
      query: (payload) => ({
        url: "/quiz",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["Quiz"],
    }),
    activeQuestion: builder.mutation({
      query: (id) => ({
        url: `/quiz/${id}/activate`,
        method: HTTP_METHOD.POST,
      }),
      invalidatesTags: ["Quiz"],
    }),
    deleteQuestions: builder.mutation({
      query: (id) => ({
        url: `/quiz/${id}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["Quiz"],
    }),
    updateQuiz: builder.mutation({
      query: (payload) => ({
        url: "/quiz",
        method: HTTP_METHOD.PUT,
        body: payload,
      }),
      invalidatesTags: ["Quiz"],
    }),
  }),
});

export const {
  useGetQuizListQuery,
  useCreateQuizMutation,
  useActiveQuestionMutation,
  useDeleteQuestionsMutation,
  useUpdateQuizMutation,
} = quizManagementApi;

export default quizManagementApi;
