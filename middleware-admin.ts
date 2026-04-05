import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const adminLoginCookie = req.cookies.get("admin-login");
  const authToken = req.cookies.get("next-auth.session-token");

  // Protect /admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // Allow /admin/login without authentication
    if (req.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    // For other /admin routes, require admin login cookie OR valid auth token
    if (!adminLoginCookie && !authToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Protect /jobs routes (existing middleware logic)
  if (req.nextUrl.pathname.startsWith("/jobs")) {
    const token = req.cookies.get("next-auth.session-token");
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/jobs"],
};
