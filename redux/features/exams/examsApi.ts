import { baseApi } from "@/redux/app/baseApi";
import {
  SuccessResponse,
} from "@/types";
import {
  CreateExamDto,
  IExam,
  UpdateExamDto,
  IQuestion,
  IAnswer,
  CreateQuestionDto,
  UpdateQuestionDto,
} from "@/types/course";

export const examsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =================== [ EXAMS ] ===================
    // GET: all exams for a chapter
    getChapterExams: builder.query<
      SuccessResponse<IExam[]>,
      { courseId: number; chapterId: number }
    >({
      query: ({ courseId, chapterId }) => 
        `/instructor/courses/${courseId}/chapters/${chapterId}/exams`,
      providesTags: ["Exam"],
    }),

    // GET: single exam
    getSingleExam: builder.query<
      SuccessResponse<IExam>,
      { courseId: number; chapterId: number; examId: number }
    >({
      query: ({ courseId, chapterId, examId }) => 
        `/instructor/courses/${courseId}/chapters/${chapterId}/exams/${examId}`,
      providesTags: ["Exam"],
    }),

    // POST: create exam
    createExam: builder.mutation<SuccessResponse<IExam>, CreateExamDto>({
      query: (body) => ({
        url: `/instructor/courses/${body.course_id}/chapters/${body.chapter_id}/exams`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Exam", "Course"],
    }),

    // PUT: update exam
    updateExam: builder.mutation<
      SuccessResponse<IExam>,
      { courseId: number; chapterId: number; examId: number; data: UpdateExamDto }
    >({
      query: ({ courseId, chapterId, examId, data }) => ({
        url: `/instructor/courses/${courseId}/chapters/${chapterId}/exams/${examId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Exam", "Course"],
    }),

    // DELETE: delete exam
    deleteExam: builder.mutation<
      SuccessResponse<string>,
      { courseId: number; chapterId: number; examId: number }
    >({
      query: ({ courseId, chapterId, examId }) => ({
        url: `/instructor/courses/${courseId}/chapters/${chapterId}/exams/${examId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Exam", "Course"],
    }),

    // =================== [ QUESTIONS ] ===================
    // GET: all questions for an exam
    getExamQuestions: builder.query<
      SuccessResponse<(IQuestion & { answers: IAnswer[] })[]>,
      { courseId: number; chapterId: number; examId: number }
    >({
      query: ({ courseId, chapterId, examId }) => 
        `/instructor/courses/${courseId}/chapters/${chapterId}/exams/${examId}/questions`,
      providesTags: ["Question"],
    }),

    // GET: single question
    getSingleQuestion: builder.query<
      SuccessResponse<IQuestion & { answers: IAnswer[] }>,
      { courseId: number; chapterId: number; examId: number; questionId: number }
    >({
      query: ({ courseId, chapterId, examId, questionId }) => 
        `/instructor/courses/${courseId}/chapters/${chapterId}/exams/${examId}/questions/${questionId}`,
      providesTags: ["Question"],
    }),

    // POST: create question
    createQuestion: builder.mutation<
      SuccessResponse<IQuestion & { answers: IAnswer[] }>,
      { courseId: number; chapterId: number; examId: number; data: FormData }
    >({
      query: ({ courseId, chapterId, examId, data }) => ({
        url: `/instructor/courses/${courseId}/chapters/${chapterId}/exams/${examId}/questions`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Question", "Exam"],
    }),

    // PUT: update question
    updateQuestion: builder.mutation<
      SuccessResponse<IQuestion & { answers: IAnswer[] }>,
      { courseId: number; chapterId: number; examId: number; questionId: number; data: FormData }
    >({
      query: ({ courseId, chapterId, examId, questionId, data }) => ({
        url: `/instructor/courses/${courseId}/chapters/${chapterId}/exams/${examId}/questions/${questionId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Question", "Exam"],
    }),

    // DELETE: delete question
    deleteQuestion: builder.mutation<
      SuccessResponse<string>,
      { courseId: number; chapterId: number; examId: number; questionId: number }
    >({
      query: ({ courseId, chapterId, examId, questionId }) => ({
        url: `/instructor/courses/${courseId}/chapters/${chapterId}/exams/${examId}/questions/${questionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Question", "Exam"],
    }),
  }),
});

export const {
  useGetChapterExamsQuery,
  useGetSingleExamQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
  useGetExamQuestionsQuery,
  useGetSingleQuestionQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = examsApi;