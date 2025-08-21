import { baseApi } from "@/redux/app/baseApi";
import { PaginatedData, PaginationOptions, SuccessResponse } from "@/types/(waraqah)";
import {
  CreateCategoryDto,
  ICategory,
  UpdateCategoryDto,
} from "@/types/(waraqah)/category";

const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET : all categories
    getAllCategories: builder.query<
      SuccessResponse<PaginatedData<ICategory[]>>,
      PaginationOptions
    >({
      query: ({ page = 1, per_page = 10, search = "" }) => ({
        url: `/admin/categories`,
        params: { page, per_page, search },
      }),
      providesTags: ["Category"],
    }),

    // GET : all categories (public)
    getAllPublicCategories: builder.query<
      SuccessResponse<ICategory[]>,
      PaginationOptions
    >({
      query: ({ page = 1, per_page = 10, search = "" }) => ({
        url: `/categories`,
        params: { page, per_page, search },
      }),
      providesTags: ["Category"],
    }),

    // GET : single category
    getSingleCategory: builder.query<SuccessResponse<ICategory>, number>({
      query: (id) => `/admin/categories/${id}`,
    }),

    // POST : create category
    createCategory: builder.mutation<SuccessResponse<any>, CreateCategoryDto>({
      query: (body) => ({
        url: "/admin/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    // PUT : update category
    updateCategory: builder.mutation<SuccessResponse<any>, UpdateCategoryDto>({
      query: (body) => ({
        url: `/admin/categories/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    // DELETE : delete category
    deleteCategory: builder.mutation<SuccessResponse<any>, number>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  // Queries
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
  useGetAllPublicCategoriesQuery,

  // Mutations
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = categoriesApi;
