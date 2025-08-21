import { baseApi } from "@/redux/app/baseApi";
import { PaginatedData, PaginationOptions, SuccessResponse } from "@/types/(waraqah)";
import { IOrder, UpdateOrderDto } from "@/types/(waraqah)/order";

const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: all orders
    getAllOrders: builder.query<
      SuccessResponse<PaginatedData<IOrder[]>>,
      PaginationOptions & {
        invoice_status: string;
        order_status: string;
      }
    >({
      query: ({
        page = 1,
        per_page = 10,
        search = "",
        invoice_status,
        order_status,
      }) => ({
        url: `/admin/orders`,
        params: { page, per_page, search, invoice_status, order_status },
      }),
      providesTags: ["Orders"],
    }),

    exportOrdersCSV: builder.query<
      any,
      { invoice_status: string; order_status: string }
    >({
      query: (params) => ({
        url: "admin/orders/export",
        method: "GET",
        params,
      }),
    }),

    getOrdersByUser: builder.query<
      SuccessResponse<PaginatedData<IOrder[]>>,
      PaginationOptions & {
        invoice_status: string;
        order_status: string;
        user_id: string;
      }
    >({
      query: ({
        page = 1,
        per_page = 10,
        search = "",
        invoice_status,
        order_status,
        user_id,
      }) => ({
        url: `/admin/users/${user_id}/orders`,
        params: { page, per_page, search, invoice_status, order_status },
      }),
      providesTags: ["Orders"],
    }),

    // GET: order by id
    getOrderById: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
      }),
      providesTags: ["Orders"],
    }),

    // PUT: update the order status
    updateOrderStatus: builder.mutation<SuccessResponse<any>, UpdateOrderDto>({
      query: (body) => ({
        url: `/admin/orders/${body.id}/update`,
        method: "POST",
        body: { ...body, _method: "PUT" },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrdersByUserQuery,
  useExportOrdersCSVQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
