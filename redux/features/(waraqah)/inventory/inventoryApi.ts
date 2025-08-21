import { baseApi } from "@/redux/app/baseApi";
import { PaginatedData, PaginationOptions, SuccessResponse } from "@/types/(waraqah)";
import { IInventory } from "@/types/(waraqah)/inventory";

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInventory: builder.query<
      SuccessResponse<PaginatedData<IInventory[]>>,
      PaginationOptions
    >({
      query: ({ page = 1, per_page = 10, search = "" }) => ({
        url: "/admin/inventory-movements",
        method: "GET",
        params: { page, per_page, search },
      }),
      providesTags: ["Inventory"],
    }),

    deleteInventory: builder.mutation<SuccessResponse<string>, number>({
      query: (id) => ({
        url: `/admin/inventory-movements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inventory"],
    }),

    createInventory: builder.mutation<
      SuccessResponse<IInventory>,
      Partial<IInventory>
    >({
      query: (inventory) => ({
        url: "/admin/inventory-movements",
        method: "POST",
        body: inventory,
      }),
      invalidatesTags: ["Inventory"],
    }),

    updateInventory: builder.mutation<
      SuccessResponse<IInventory>,
      Partial<IInventory>
    >({
      query: (inventory) => ({
        url: `/admin/inventory-movements/${inventory.id}`,
        method: "POST",
        body: { ...inventory, _method: "PUT" },
      }),
      invalidatesTags: ["Inventory"],
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} = inventoryApi;
