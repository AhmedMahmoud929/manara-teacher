import { baseApi } from "@/redux/app/baseApi";
import {
  PaginatedData,
  PaginationOptions,
  QueryParams,
  SuccessResponse,
} from "@/types/(waraqah)";
import { IProduct, ProductFilterOptions } from "@/types/(waraqah)/product";

const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET : all products
    getAllProducts: builder.query<
      SuccessResponse<PaginatedData<IProduct[]>>,
      PaginationOptions
    >({
      query: ({ page = 1, per_page = 10, search = "" }) => ({
        url: `/admin/products`,
        params: { page, per_page, search },
      }),
      providesTags: ["Product"],
    }),

    getAllPublicProducts: builder.query<
      SuccessResponse<PaginatedData<IProduct[]>>,
      ProductFilterOptions
    >({
      query: ({
        page = 1,
        per_page = 10,
        search = "",
        category_id = "",
        year = "",
        price = "",
      }) => ({
        url: `/products`,
        params: { page, per_page, search, category_id, year, price },
      }),
      providesTags: ["Product"],
    }),

    // GET : single product
    getSingleProduct: builder.query<SuccessResponse<IProduct>, number>({
      query: (id) => `/admin/products/${id}`,
      providesTags: ["Product"],
    }),

    // GET : single public product
    getSinglePublicProduct: builder.query<
      SuccessResponse<IProduct>,
      string | number
    >({
      query: (id) => `/products/${id}`,
      providesTags: ["Product"],
    }),

    // GET : best selling products
    getBestSellingProducts: builder.query<
      SuccessResponse<PaginatedData<IProduct[]>>,
      ProductFilterOptions
    >({
      query: ({
        page = 1,
        per_page = 10,
        search = "",
        category_id = "",
        year = "",
        price = "",
      }) => ({
        url: "/best-selling-products",
        params: { page, per_page, search, category_id, year, price },
      }),
      providesTags: ["Product"],
    }),

    // GET : top best selling products
    getTopBestSellingProducts: builder.query<
      SuccessResponse<IProduct[]>,
      QueryParams
    >({ query: () => "/top-best-selling" }),

    // GET : other public products
    getOtherPublicProducts: builder.query<
      SuccessResponse<IProduct[]>,
      QueryParams
    >({ query: () => "/other-products" }),

    // GET : top best selling products
    getLatest10Products: builder.query<
      SuccessResponse<IProduct[]>,
      { level: number }
    >({
      query: ({ level }) => ({ url: "/latest-products", params: { level } }),
    }),

    // POST : create product
    createNewProduct: builder.mutation<SuccessResponse<string>, FormData>({
      query: (body) => ({
        url: "/admin/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    // GET : all fav products
    getFavProducts: builder.query<SuccessResponse<IProduct[]>, void>({
      query: () => "/user/favorites",
      providesTags: ["Favorite-Products"],
    }),

    // POST : toggle fav product
    toggleFavProduct: builder.mutation<SuccessResponse<string>, number>({
      query: (product_id) => ({
        url: `/user/favorites`,
        method: "POST",
        body: { product_id },
      }),
      invalidatesTags: ["Favorite-Products"],
    }),

    // PUT : update product
    updateProduct: builder.mutation<
      SuccessResponse<string>,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    // DELETE : delete product
    deleteProduct: builder.mutation<SuccessResponse<string>, number>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  // Queries
  useGetAllProductsQuery,
  useGetBestSellingProductsQuery,
  useGetLatest10ProductsQuery,
  useGetTopBestSellingProductsQuery,
  useGetOtherPublicProductsQuery,
  useGetSingleProductQuery,
  useGetSinglePublicProductQuery,
  useGetAllPublicProductsQuery,
  useGetFavProductsQuery,

  // Mutations
  useCreateNewProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useToggleFavProductMutation,
} = productsApi;
