import { NextRequest, NextResponse } from "next/server";
import { Store } from "./utils/data";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(Store.ACCESS_TOKEN)?.value;
  const { pathname } = req.nextUrl;

  const isProtected =
    pathname.startsWith("/BugTracker") ||
    pathname.startsWith("/Project") ||
    pathname.startsWith("/Dashboard") ||
    pathname.startsWith("/Admin");

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/Login", req.url));
  }

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/Login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/BugTracker/:path*",
    "/Project/:path*",
    "/Dashboard/:path*",
    "/Admin/:path*",
    "/Login",
    "/Signup",
  ],
};