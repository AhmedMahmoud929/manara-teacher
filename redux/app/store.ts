import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import { dashboardSlice } from "../features/(waraqah)/dashboard/dashboardSlice";
import authSlice from "../features/auth/authSlice";
import categorySlice from "../features/(waraqah)/categories/categorySlice";
import { cartSlice } from "../features/(waraqah)/cart/cartSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [dashboardSlice.reducerPath]: dashboardSlice.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
    [cartSlice.reducerPath]: cartSlice.reducer,
    [categorySlice.reducerPath]: categorySlice.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(baseApi.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
