import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { ROLE_HOME, getRoleFromPath } from "@/lib/roles";

const PUBLIC_ROUTES = ["/login", "/forgot-password", "/reset-password"];

/**
 * Optimistic, edge-fast auth check. This does NOT hit the database - it only
 * verifies the signed session cookie and redirects obviously-unauthorized
 * requests. Real authorization happens in the Data Access Layer
 * (see src/lib/auth/dal.ts) close to the data itself.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isRootRoute = pathname === "/";

  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decrypt(cookie);

  if (!session && !isPublicRoute && !isRootRoute) {
    const loginUrl = new URL("/login", request.nextUrl);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL(ROLE_HOME[session.role], request.nextUrl));
    }

    const routeRole = getRoleFromPath(pathname);
    if (routeRole && routeRole !== session.role) {
      // Allow admins to access student print/read-only views
      if (
        session.role === "ADMIN" &&
        (pathname.match(/^\/student\/weekly-reports\/[^/]+\/print$/) ||
         pathname.match(/^\/student\/weekly-reports\/demo$/))
      ) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/unauthorized", request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|.*\\.(?:png|jpg|jpeg|svg|ico)$).*)"],
};
