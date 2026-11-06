// Next.js 16 : proxy.ts remplace middleware.ts. Garde de première ligne ; chaque page/action revérifie le rôle.
import { NextResponse, type NextRequest } from "next/server";
export function proxy(req: NextRequest) {
  if (!req.cookies.get("session")) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*", "/catalogue/:path*", "/stock/:path*", "/rapports/:path*", "/journal/:path*"] };
