import { baseApi } from "@/redux/app/baseApi";
import { SuccessResponse } from "@/types/(waraqah)";
import { ISale } from "@/types/(waraqah)/sale";

export const salesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSales: builder.query<
      SuccessResponse<{ total_sales: number; sales: ISale[] }>,
      { type: string; from: string; to: string; product_id: string }
    >({
      query: (params) => ({
        url: "admin/sales-report",
        method: "GET",
        params,
      }),
    }),

    exportSalesCSV: builder.query<SuccessResponse<any>, { type: string }>({
      query: (params) => ({
        url: "admin/sales/export",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetSalesQuery, useExportSalesCSVQuery } = salesApi;
