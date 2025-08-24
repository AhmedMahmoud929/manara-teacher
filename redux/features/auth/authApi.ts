import { baseApi } from "@/redux/app/baseApi";
import { setUser } from "./authSlice";
import { IUser, LoginUserDto, RegisterUserDto } from "@/types/user";
import { SuccessResponse } from "@/types";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST : login
    login: builder.mutation<
      SuccessResponse<{ token: string; user: IUser }>,
      LoginUserDto
    >({
      query: (body) => ({
        url: `/login`,
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data.data);
          dispatch(setUser(data.data));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    // POST : register
    register: builder.mutation<
      SuccessResponse<{ token: string; user: IUser }>,
      RegisterUserDto
    >({
      query: (body) => ({
        url: "/user/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data));
        } catch (error) {
          console.error("Register failed:", error);
        }
      },
    }),
  }),
});

export const {
  // Queries
  // ...
  // Mutations
  useLoginMutation,
  useRegisterMutation,
} = authApi;
