import { baseApi } from "@/redux/app/baseApi";
import { PaginatedData, PaginationOptions, SuccessResponse } from "@/types/(waraqah)";
import { ICity, IGovernateAdmin } from "@/types/(waraqah)/governates";
import { IPopup } from "@/types/(waraqah)/offer";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminGovernates: builder.query<
      SuccessResponse<PaginatedData<IGovernateAdmin[]>>,
      PaginationOptions
    >({
      query: ({ page = 1, per_page = 10, search = "" }) => ({
        url: "/admin/governorates",
        params: { page, per_page, search },
      }),
      providesTags: ["Country"],
    }),

    updateAdminGovernate: builder.mutation<
      SuccessResponse<IGovernateAdmin>,
      {
        id: number;
        data: { price: number; is_active: number; breakable_price: number };
      }
    >({
      query: ({ id, data }) => ({
        url: `/admin/governorates/${id}`,
        method: "POST",
        body: { ...data, _method: "PUT" },
      }),
      invalidatesTags: ["Country"],
    }),

    getAdminCities: builder.query<
      SuccessResponse<PaginatedData<ICity[]>>,
      PaginationOptions & { governateId: number | null }
    >({
      query: ({ page = 1, per_page = 10, search = "", governateId }) => ({
        url: `/admin/cities${governateId ? `/${governateId}` : ""}`,
        params: { page, per_page, search },
      }),
      providesTags: ["Country"],
    }),

    getPopupInfo: builder.query<SuccessResponse<IPopup>, void>({
      query: () => "/admin/settings/popup",
    }),

    updatePopupInfo: builder.mutation<SuccessResponse<string>, FormData>({
      query: (body) => ({ url: "/admin/settings/popup", method: "POST", body }),
    }),
  }),
});

export const {
  useGetAdminGovernatesQuery,
  useGetAdminCitiesQuery,
  useUpdateAdminGovernateMutation,
  useGetPopupInfoQuery,
  useUpdatePopupInfoMutation,
} = settingsApi;
