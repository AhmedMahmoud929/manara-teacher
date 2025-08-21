import { baseApi } from "@/redux/app/baseApi";
import { PaginatedData, PaginationOptions, SuccessResponse } from "@/types/(waraqah)";
import { IOffer } from "@/types/(waraqah)/offer";

export const offersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET : all offers (admin)
    getAllOffers: builder.query<
      SuccessResponse<PaginatedData<IOffer[]>>,
      PaginationOptions
    >({
      query: ({ page = 1, per_page = 10, search = "" }) => ({
        url: "/admin/offers",
        method: "GET",
        params: { page, per_page, search },
      }),
      providesTags: ["Offer"],
    }),

    // GET : all offers (public)
    getAllPublicOffers: builder.query<SuccessResponse<IOffer[]>, void>({
      query: () => ({
        url: "/offers/featured",
        method: "GET",
      }),
    }),

    // GET : single offers (admin)
    getSingleOffer: builder.query<SuccessResponse<IOffer>, number>({
      query: (id) => ({
        url: `/admin/offers/${id}`,
        method: "GET",
      }),
      providesTags: ["Offer"],
    }),

    // POST : new offer
    createNewOffer: builder.mutation<SuccessResponse<string>, FormData>({
      query: (body) => ({
        url: "/admin/offers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Offer"],
    }),

    // PUT : put offer
    updateOffer: builder.mutation<SuccessResponse<string>, FormData>({
      query: (body) => ({
        url: `/admin/offers/${body.get("id")}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Offer"],
    }),

    // DELETE : an exist offer
    deleteOffer: builder.mutation<SuccessResponse<string>, number>({
      query: (id) => ({
        url: `/admin/offers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Offer"],
    }),
  }),
});

export const {
  // Queries
  useGetAllOffersQuery,
  useGetSingleOfferQuery,
  useGetAllPublicOffersQuery,
  // Mutations
  useCreateNewOfferMutation,
  useDeleteOfferMutation,
  useUpdateOfferMutation,
} = offersApi;
