import { baseApi } from "@/redux/app/baseApi";
import { SuccessResponse } from "@/types/(waraqah)";
import { ICart, ICartItem, ICouponeResponse } from "@/types/(waraqah)/cart";
import { setCartItems } from "./cartSlice";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET : all cart items
    getCartList: builder.query<
      SuccessResponse<{ total_price: number; cart_items: ICartItem[] }>,
      void
    >({
      query: () => "/user/cart",
      providesTags: ["Cart"],
    }),

    // GET : invoice
    getInvoice: builder.query<
      SuccessResponse<ICart>,
      { coupon_code: string } | void
    >({
      query: (data) =>
        `/user/cart/invoice?${
          data?.coupon_code ? `coupon_code=${data.coupon_code}` : ""
        }`,
      providesTags: ["Cart"],
    }),

    // POST : add product to cart
    addToCart: builder.mutation<SuccessResponse<any>, number>({
      query: (product_id) => ({
        url: `/user/cart`,
        method: "POST",
        body: { product_id },
      }),
      invalidatesTags: ["Cart"],
    }),

    // PUT : decrease product quantity
    decQuantity: builder.mutation<SuccessResponse<any>, number>({
      query: (product_id) => ({
        url: `/user/cart/decrease-quantity`,
        method: "PATCH",
        body: { product_id },
      }),
      invalidatesTags: ["Cart"],
    }),

    // DELETE : cart item
    removeFromCart: builder.mutation<SuccessResponse<any>, number>({
      query: (product_id) => ({
        url: `/user/cart/remove`,
        method: "DELETE",
        body: { product_id },
      }),
      invalidatesTags: ["Cart"],
    }),

    // POST : apply coupon
    applyCoupon: builder.mutation<SuccessResponse<ICouponeResponse>, string>({
      query: (coupon_code) => ({
        url: `/user/cart/apply-coupon`,
        method: "POST",
        body: { coupon_code },
      }),
      invalidatesTags: ["Cart"],
    }),

    // POST : checkout
    checkout: builder.mutation<SuccessResponse<any>, { coupon_code: string }>({
      query: ({ coupon_code }) => ({
        url: `/user/cart/checkout${
          coupon_code ? `?coupon_code=${coupon_code}` : ""
        }`,
        method: "POST",
      }),
      invalidatesTags: ["Cart", "Orders"],
    }),
  }),
});

export const {
  // Queries
  useGetCartListQuery,
  useGetInvoiceQuery,
  // Mutations
  useAddToCartMutation,
  useDecQuantityMutation,
  useRemoveFromCartMutation,
  useApplyCouponMutation,
  useCheckoutMutation,
} = cartApi;
