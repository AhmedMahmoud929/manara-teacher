import { USER_COOKIE, TOKEN_COOKIE } from "@/constants/index";
import { IAuthState } from "@/types/(waraqah)/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setCookie, getCookie, deleteCookie, hasCookie } from "cookies-next";

const initialState: IAuthState = {
  user: getCookie(USER_COOKIE)
    ? JSON.parse(getCookie(USER_COOKIE) as string)
    : null,
  token: (getCookie(TOKEN_COOKIE) as string) || null,
};

const cookieConfig = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  secure: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<NonNullable<IAuthState>>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      setCookie(USER_COOKIE, action.payload.user, cookieConfig);
      setCookie(TOKEN_COOKIE, action.payload.token, cookieConfig);
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      deleteCookie(USER_COOKIE);
      deleteCookie(TOKEN_COOKIE);
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice;
