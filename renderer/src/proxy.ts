import { NextRequest, NextResponse } from "next/server";
import {
  API_AUTH_PREFIX,
  DEFAULT_LOGIN_REDIRECT,
  PRIVATE_ROUTE_PREFIXES,
  PUBLIC_ROUTES,
  SESSION_COOKIE_KEY,
} from "./constants";
import { roleRedirects } from "./utils";

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;

  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") return false;
    if (!pathname.startsWith(route)) return false;

    const nextChar = pathname[route.length];
    return !nextChar || nextChar === "/" || nextChar === "?";
  });
}

function isAuthPage(pathname: string): boolean {
  return [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
  ].includes(pathname);
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith(API_AUTH_PREFIX)) {
    return NextResponse.next();
  }

  const isAuthenticated = Boolean(
    req.cookies.get(SESSION_COOKIE_KEY)?.value
  );

  const isPublic = isPublicRoute(pathname);
  const isPrivate = PRIVATE_ROUTE_PREFIXES.some((p) =>
    pathname.startsWith(p)
  );

  if (isPublic) {
    if (isAuthenticated && isAuthPage(pathname)) {
      return NextResponse.redirect(
        new URL(roleRedirects["OWNER"], req.url)
      );
    }

    return NextResponse.next();
  }

  if (!isAuthenticated && isPrivate) {
    return NextResponse.redirect(
      new URL(DEFAULT_LOGIN_REDIRECT, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg|jpeg|gif|json)|\\.well-known|unauthorized).*)",
  ],
};
