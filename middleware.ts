import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;

  const { pathname } = req.nextUrl;

  // 🔒 Routes that require login
  const protectedRoutes = ["/upload", "/watch"];

  // 🔓 Auth صفحات (should NOT be accessible when logged in)
  const authRoutes = ["/login", "/register"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthPage = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 🚫 Not logged in → block protected routes
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // // 🚫 Logged in → block login/register pages
  // if (isAuthPage && session) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  // return NextResponse.next();
}

export const config = {
  matcher: [
    "/upload/:path*",
    "/watch/:path*",
    "/login",
    "/register",
  ],
};