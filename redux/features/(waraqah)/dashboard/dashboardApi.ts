import { baseApi } from "@/redux/app/baseApi";
import { SuccessResponse } from "@/types/(waraqah)";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<
      SuccessResponse<string>,
      "products" | "orders" | "users" | "payments"
    >({
      query: (type) => {
        switch (type) {
          case "products":
            return {
              url: `/admin/number-of-products`,
            };
          case "orders":
            return {
              url: `/admin/number-of-orders`,
            };
          case "users":
            return {
              url: `/admin/number-of-users`,
            };
          case "payments":
            return { url: `/admin/total-orders-payment` };
        }
      },
      providesTags: ["Stats"],
    }),

    getOrdersChart: builder.query<
      SuccessResponse<{ date: string; total: number }[]>,
      "daily" | "monthly" | "quarterly" | void
    >({
      query: (type) => ({ url: "/admin/get-orders-payment", params: { type } }),
      providesTags: ["Stats"],
    }),

    getTopProductsStats: builder.query<
      SuccessResponse<{ product_name: string; percentage: number }[]>,
      void
    >({
      query: () => "/admin/get-top-products",
      providesTags: ["Stats"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetOrdersChartQuery,
  useGetTopProductsStatsQuery,
} = dashboardApi;
