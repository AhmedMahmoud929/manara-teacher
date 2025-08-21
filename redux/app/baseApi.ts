import { API_URL } from "@/constants/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { toastErr } from "./toast-err";
import { RootState } from "./store";
import { ErrorResponse, SuccessResponse } from "@/types/(waraqah)";
import { deleteCookie, getCookie } from "cookies-next";
import { TOKEN_COOKIE, USER_COOKIE } from "@/constants";

// Define a custom fetchBaseQuery
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

// Define an interceptor
const baseQueryWithInterceptor: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);
  const method = typeof args === "string" ? "GET" : args.method || "GET";

  console.log(method, result);

  if (
    !!result.error &&
    result.error.status === 401 &&
    getCookie(TOKEN_COOKIE)
  ) {
    toast.error("انتهت صلاحية هذه الجلسة", {
      description: "من فضلك قم بتسجيل الدخول من جديد",
    });
    deleteCookie(USER_COOKIE);
    deleteCookie(TOKEN_COOKIE);
    if (location) location.reload();
  }

  if (!!result.error && method != "GET") {
    const errData = result.error?.data as ErrorResponse;
    toast(errData.message, {
      description:
        typeof errData.data === "string"
          ? errData.data
          : toastErr(errData.data),
    });
  }
  if (!!result.data && method != "GET")
    toast.success((result.data as SuccessResponse<any>).message);

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithInterceptor,
  tagTypes: [
    "Stats",
    "Cart",
    "Category",
    "Product",
    "Orders",
    "Customer",
    "User",
    "Offer",
    "Coupon",
    "Favorite-Products",
    "Inventory",
    "Country",
    "City",
    "Popup",
  ],
  endpoints: () => ({}),
});
