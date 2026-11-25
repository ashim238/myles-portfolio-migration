import { NextRequest, NextResponse } from "next/server";
import { hasJuliusAccess, isJuliusAsset, JULIUS_COOKIE, JULIUS_UNLOCK_PATH } from "@/lib/julius-access";

export function proxy(request: NextRequest) {
  // Never let the shared image optimizer cache private case-study assets.
  if (request.nextUrl.pathname === "/_next/image") {
    const source = request.nextUrl.searchParams.get("url");
    if (!source) return NextResponse.next();
    try {
      if (!isJuliusAsset(decodeURIComponent(new URL(source, request.url).pathname))) return NextResponse.next();
    } catch { return new NextResponse(null, { status: 400 }); }
    return new NextResponse(null, { status: 403, headers: { "Cache-Control": "private, no-store" } });
  }

  let response: NextResponse;
  if (hasJuliusAccess(request.cookies.get(JULIUS_COOKIE)?.value)) {
    response = NextResponse.next();
  } else if (isJuliusAsset(request.nextUrl.pathname)) {
    response = new NextResponse("Password required", { status: 401 });
  } else {
    response = NextResponse.redirect(new URL(JULIUS_UNLOCK_PATH, request.url));
  }
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, noarchive");
  return response;
}

export const config = {
  matcher: ["/work/julius-design-system/:path*", "/projects/julius-design-system/:path*", "/_next/image"],
};
