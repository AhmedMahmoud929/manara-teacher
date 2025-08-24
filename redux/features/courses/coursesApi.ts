import { baseApi } from "@/redux/app/baseApi";
import {
  PaginatedData,
  PaginationOptions,
  SuccessResponse,
} from "@/types";
import {
  CreateLectureDto,
  CreateUnitDto,
  ICourse,
  IDetailedCourse,
  ILesson,
  IUnit,
  UpdateLectureDto,
  UpdateUnitDto,
} from "@/types/course";

export const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =================== [ COURSES ] ===================
    // GET: all courses
    getAllCourses: builder.query<
      SuccessResponse<PaginatedData<ICourse[]>>,
      PaginationOptions
    >({
      query: ({ page = 1, per_page = 10, search = "" }) => ({
        url: `/instructor/courses`,
        params: { page, per_page, search },
      }),
      providesTags: ["Course"],
    }),

    // GET: single course
    getSingleCourse: builder.query<SuccessResponse<IDetailedCourse>, number>({
      query: (id) => `/instructor/courses/${id}`,
      providesTags: ["Course"],
    }),

    // POST: create course
    createCourse: builder.mutation<SuccessResponse<ICourse>, FormData>({
      query: (body) => ({
        url: "/instructor/courses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Course"],
    }),

    // PUT: update course
    updateCourse: builder.mutation<
      SuccessResponse<ICourse>,
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/instructor/courses/${id}`,
        method: "POST",
        body: { ...data, _method: "PUT" },
      }),
      invalidatesTags: ["Course"],
    }),

    // DELETE: delete course
    deleteCourse: builder.mutation<SuccessResponse<string>, number>({
      query: (id) => ({
        url: `/instructor/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    // =================== [ UNIT ] ===================
    // GET: all units for a course
    getCourseUnits: builder.query<SuccessResponse<IUnit[]>, number>({
      query: (courseId) => `/instructor/courses/${courseId}/units`,
      providesTags: ["Unit"],
    }),

    // GET: single unit
    getSingleUnit: builder.query<
      SuccessResponse<IUnit>,
      { courseId: number; unitId: number }
    >({
      query: ({ courseId, unitId }) =>
        `/instructor/courses/${courseId}/units/${unitId}`,
      providesTags: ["Unit"],
    }),

    // POST: create unit
    createUnit: builder.mutation<SuccessResponse<IUnit>, CreateUnitDto>({
      query: (body) => ({
        url: `/instructor/courses/${body.course_id}/chapters`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Course"],
    }),

    // PUT: update unit
    updateUnit: builder.mutation<
      SuccessResponse<IUnit>,
      { courseId: number; unitId: number; data: UpdateUnitDto }
    >({
      query: ({ courseId, unitId, data }) => ({
        url: `/instructor/courses/${courseId}/chapters/${unitId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),

    // DELETE: delete unit
    deleteUnit: builder.mutation<
      SuccessResponse<string>,
      { courseId: number; unitId: number }
    >({
      query: ({ courseId, unitId }) => ({
        url: `/instructor/courses/${courseId}/chapters/${unitId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    // =================== [ LECTURES ] ===================
    // GET: all lectures for a chapter
    getChapterLectures: builder.query<
      SuccessResponse<ILesson[]>,
      { courseId: number; chapterId: number }
    >({
      query: ({ courseId, chapterId }) =>
        `/instructor/courses/${courseId}/chapters/${chapterId}/lectures`,
      providesTags: ["Course"],
    }),

    // GET: single lecture
    getSingleLecture: builder.query<
      SuccessResponse<ILesson>,
      { courseId: number; chapterId: number; lectureId: number }
    >({
      query: ({ courseId, chapterId, lectureId }) =>
        `/instructor/courses/${courseId}/chapters/${chapterId}/lectures/${lectureId}`,
      providesTags: ["Course"],
    }),

    // POST: create lecture
    createLecture: builder.mutation<SuccessResponse<ILesson>, CreateLectureDto>(
      {
        query: (body) => ({
          url: `/instructor/courses/${body.course_id}/chapters/${body.chapter_id}/lectures`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Course"],
      }
    ),

    // PUT: update lecture
    updateLecture: builder.mutation<
      SuccessResponse<ILesson>,
      {
        courseId: number;
        chapterId: number;
        lectureId: number;
        data: UpdateLectureDto;
      }
    >({
      query: ({ courseId, chapterId, lectureId, data }) => ({
        url: `/instructor/courses/${courseId}/chapters/${chapterId}/lectures/${lectureId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),

    // DELETE: delete lecture
    deleteLecture: builder.mutation<
      SuccessResponse<string>,
      { courseId: number; chapterId: number; lectureId: number }
    >({
      query: ({ courseId, chapterId, lectureId }) => ({
        url: `/instructor/courses/${courseId}/chapters/${chapterId}/lectures/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const {
  // Courses hooks
  useGetAllCoursesQuery,
  useGetSingleCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  // Unit hooks
  useGetCourseUnitsQuery,
  useGetSingleUnitQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
  // Lecture hooks
  useGetChapterLecturesQuery,
  useGetSingleLectureQuery,
  useCreateLectureMutation,
  useUpdateLectureMutation,
  useDeleteLectureMutation,
} = coursesApi;
