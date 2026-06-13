import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/admin", "/staff"];

// Routes that are only for unauthenticated users
const authRoutes = ["/login", "/register"];

// Role-based route access
const roleRoutes: Record<string, string[]> = {
  admin: ["/admin", "/dashboard", "/staff"],
  staff: ["/staff", "/dashboard"],
  customer: ["/dashboard"],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const userRole = request.cookies.get("user_role")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If visiting a protected route without a token → redirect to login
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and visiting auth pages (login/register) → redirect to dashboard
  if (isAuthRoute && accessToken) {
    const role = userRole as keyof typeof roleRoutes;
    if (role === "admin") return NextResponse.redirect(new URL("/admin", request.url));
    if (role === "staff") return NextResponse.redirect(new URL("/staff", request.url));
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Role-based access: prevent accessing routes you shouldn't
  if (isProtectedRoute && accessToken && userRole) {
    const role = userRole as keyof typeof roleRoutes;
    const allowedRoutes = roleRoutes[role] || [];
    const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!isAllowed) {
      // Redirect to user's own home based on role
      if (role === "admin") return NextResponse.redirect(new URL("/admin", request.url));
      if (role === "staff") return NextResponse.redirect(new URL("/staff", request.url));
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
