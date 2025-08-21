import { baseApi } from "@/redux/app/baseApi";
import { PaginatedData, PaginationOptions, SuccessResponse } from "@/types/(waraqah)";
import { CreateCouponDto, ICoupon, UpdateCouponDto } from "@/types/(waraqah)/coupons";

export const couponsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET : all coupons
    getAllCoupons: builder.query<
      SuccessResponse<PaginatedData<ICoupon[]>>,
      PaginationOptions
    >({
      query: ({ page = 1, per_page = 10, search = "" }) => ({
        url: "/admin/coupons",
        method: "GET",
        params: { page, per_page, search },
      }),
      providesTags: ["Coupon"],
    }),

    // POST : create new coupon
    createNewCoupon: builder.mutation<SuccessResponse<string>, CreateCouponDto>(
      {
        query: (body) => ({
          url: "/admin/coupons",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Coupon"],
      }
    ),

    // PUT : create new coupon
    updateCoupon: builder.mutation<SuccessResponse<string>, UpdateCouponDto>({
      query: (body) => ({
        url: `/admin/coupons/${body.id}`,
        method: "POST",
        body: { ...body, _method: "PUT" },
      }),
      invalidatesTags: ["Coupon"],
    }),

    // DELETE : delete coupon
    deleteCoupon: builder.mutation<SuccessResponse<string>, number>({
      query: (id) => ({
        url: `/admin/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useCreateNewCouponMutation,
  useDeleteCouponMutation,
  useUpdateCouponMutation,
} = couponsApi;
