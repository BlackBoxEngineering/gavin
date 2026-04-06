import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host") || "";
  const hostHeader = request.headers.get("host") || "";
  const nextUrlHost = request.nextUrl.hostname || "";

  const hostCandidate = forwardedHost || hostHeader || nextUrlHost;
  const firstHost = hostCandidate.split(",")[0]?.trim() || "";
  const host = firstHost.split(":")[0].toLowerCase();

  if (host === "www.gavinwoodhouse.com") {
    const url = request.nextUrl.clone();
    url.host = "gavinwoodhouse.com";
    url.protocol = "https";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
