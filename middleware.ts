import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/constants/index";

// Define dashboard routes that require authentication
const dashboardRoutes = [
  "/courses",
  "/students",
  "/profile",
  "/subscriptions",
  "/coupons",
  "/offers",
];

// Auth routes
const authRoutes = ["/auth"];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isAuthRoute = authRoutes.some((r) => path.startsWith(r));
  const isDashboardRoute =
    dashboardRoutes.some((r) => path.startsWith(r)) || path === "/";
  const isAuthorized = Boolean(req.cookies.get(TOKEN_COOKIE)?.value);

  // Redirect unauthorized users to login for protected routes
  if (isDashboardRoute && !isAuthorized)
    return NextResponse.redirect(
      new URL(`/auth/login?redirect=${path}`, req.url)
    );

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthorized)
    return NextResponse.redirect(new URL("/", req.url));

  // Continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
