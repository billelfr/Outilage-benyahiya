import { NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE, isDevOnlyAuthBypassEnabled } from "@/lib/auth";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (isDevOnlyAuthBypassEnabled()) { // DEV ONLY
    return NextResponse.next(); // DEV ONLY
  }

  const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
