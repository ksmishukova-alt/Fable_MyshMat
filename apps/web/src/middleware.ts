import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE, roleHome } from "@/lib/auth";

/**
 * Разделение зон:
 *  - /login, /api/login — публичные
 *  - /parent/** — только parent
 *  - /methodist/** — только methodist
 *  - всё остальное (детский мир) — только child
 */
const PUBLIC = [
  "/login",
  "/api/login",
  "/api/health",
  "/api/telegram",
  "/api/yookassa",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/myshmat-assets") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const wantParent = pathname === "/parent" || pathname.startsWith("/parent/");
  const wantMethodist = pathname === "/methodist" || pathname.startsWith("/methodist/");

  if (wantParent && session.role !== "parent") {
    return NextResponse.redirect(new URL(roleHome(session.role), req.url));
  }
  if (wantMethodist && session.role !== "methodist") {
    return NextResponse.redirect(new URL(roleHome(session.role), req.url));
  }
  // детская зона: взрослых уводим в их кабинеты
  if (!wantParent && !wantMethodist && session.role !== "child" && !pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL(roleHome(session.role), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
