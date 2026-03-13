import { NextRequest, NextResponse } from "next/server";



export function authMiddleware (req:NextRequest){
      const token = req.cookies.get("access_token")?.value;

        const { pathname } = req.nextUrl;

        const isProtected =
    pathname.startsWith("/BugTracker") ||
    pathname.startsWith("/Project") ||
    pathname.startsWith("/Admin");

    
      if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/Login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();

}

export const config = {
  matcher: ["/BugTracker/:path*", "/Dashboard/:path*", "/admin/:path*"],
};