import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE, USER_COOKIE } from "@/constants/index";
import { IUser } from "./types/(waraqah)/user";

// Define protected routes
const protectedRoutes = ["/profile", "/cart"];
const authRoutes = ["/auth/login", "/auth/register"];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(path);
  const isAuthorized = Boolean(req.cookies.get(TOKEN_COOKIE)?.value);
  const user = req.cookies.get(USER_COOKIE)?.value;
  const isAdmin = user ? (JSON.parse(user!) as IUser).role === "admin" : false;
  const isDashboard = path.startsWith("/dashboard") && !isAdmin;

  if ((isProtectedRoute && !isAuthorized) || (isDashboard && !isAdmin))
    return NextResponse.redirect(
      new URL(`/auth/login?redirect=${path}`, req.url)
    );

  if (isProtectedRoute && isAdmin)
    return NextResponse.redirect(new URL(`/dashboard`, req.url));
  // If AuthRoute but there is a token
  else if (isAuthRoute && isAuthorized)
    return NextResponse.redirect(
      new URL(isAdmin ? `/dashboard` : `/profile`, req.url)
    );

  // Otherwise continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
