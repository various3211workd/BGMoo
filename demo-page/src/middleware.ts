import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const locales = ["en", "ja"]
const defaultLocale = "en"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ルートパス（"/"）の場合、言語を判定してリダイレクト
  if (pathname === "/") {
    const acceptLanguage = request.headers.get("accept-language") || "";
    const preferredLocale = locales.find((locale) =>
      acceptLanguage.includes(locale)
    ) || defaultLocale;

    return NextResponse.redirect(new URL(`/${preferredLocale}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

