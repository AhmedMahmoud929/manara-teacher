import { baseApi } from "@/redux/app/baseApi";
import { PaginatedData, PaginationOptions, SuccessResponse } from "@/types/(waraqah)";
import { ICity, IGovernorate } from "@/types/(waraqah)/governates";
import { IOrder, IUserOrder } from "@/types/(waraqah)/order";
import {
  IUser,
  RegisterUserDto,
  UpdateDeliveryDto,
  UpdateUserProfileDto,
} from "@/types/(waraqah)/user";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET : governorates
    getGovernorates: builder.query<
      SuccessResponse<PaginatedData<IGovernorate[]>>,
      void
    >({
      query: () => "/governorates",
    }),

    // GET : cities
    getCities: builder.query<SuccessResponse<PaginatedData<ICity[]>>, number>({
      query: (governorateId) => `/governorates/${governorateId}/cities`,
    }),

    // GET : all users
    getAllUsers: builder.query<
      SuccessResponse<PaginatedData<IUser[]>>,
      PaginationOptions & { phone: string }
    >({
      query: ({ page = 1, per_page = 10, search = "", phone = "" }) => ({
        url: `/admin/users`,
        params: { page, per_page, search, phone },
      }),
      providesTags: ["User"],
    }),

    // GET: user own orders
    getUserOrders: builder.query<SuccessResponse<IUserOrder[]>, void>({
      query: () => `/user/orders`,
      providesTags: ["Orders"],
    }),

    // POST: create new user (admin)
    createUser: builder.mutation<SuccessResponse<IUser>, RegisterUserDto>({
      query: (userData) => ({
        url: "/admin/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // PUT: update user (client)
    updateUser: builder.mutation<
      SuccessResponse<IUser>,
      Partial<RegisterUserDto & { id: number }>
    >({
      query: (userData) => ({
        url: `/admin/users/${userData.id}`,
        method: "POST",
        body: { ...userData, _method: "PUT" },
      }),
      invalidatesTags: ["User"],
    }),

    // PUT: update user (client)
    updateUserProfile: builder.mutation<
      SuccessResponse<IUser>,
      Partial<UpdateUserProfileDto>
    >({
      query: (body) => ({
        url: `/user/update-profile`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // PUT : update delivery data
    deleteUser: builder.mutation<SuccessResponse<any>, number>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // PUT : update delivery data
    updateDeliveryData: builder.mutation<
      SuccessResponse<UpdateDeliveryDto>,
      Partial<UpdateDeliveryDto>
    >({
      query: (body) => ({
        url: "/user/update-delivery-data",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  // Queries
  useGetCitiesQuery,
  useGetGovernoratesQuery,
  useGetAllUsersQuery,
  useGetUserOrdersQuery,
  // Mutations
  useUpdateDeliveryDataMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserProfileMutation,
} = userApi;
