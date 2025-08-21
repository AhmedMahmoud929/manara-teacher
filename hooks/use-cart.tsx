"use client";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { isNotFoundError } from "@/lib/is-not-found-error";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  useAddToCartMutation,
  useGetCartListQuery,
} from "@/redux/features/(waraqah)/cart/cartApi";
import { addToCart } from "@/redux/features/(waraqah)/cart/cartSlice";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

function useCart() {
  // States and Hooks
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products: cartProducts } = useAppSelector((state) => state.cart);

  // Hooks
  const { data: cart, error: cartError } = useGetCartListQuery();

  // Mutations
  const [addToCartViaApi, { isLoading }] = useAddToCartMutation();

  const handleAddToCart = (productId: number) => {
    if (!user) return router.push("/auth/login?redirect=/cart");
    if (user.role === "admin")
      return toast.error("لا يمكنك إضافة منتجات إلى العربة كمسؤول");

    handleReqWithToaster("جاري اضافة المنتج إلى العربة", async () => {
      await addToCartViaApi(productId).unwrap();
      dispatch(addToCart(productId));
    });
  };

  return {
    cartProducts,
    cartProductsCount: isNotFoundError(cartError)
      ? 0
      : cart?.data.cart_items.length,
    handleAddToCart,
  };
}

export default useCart;
