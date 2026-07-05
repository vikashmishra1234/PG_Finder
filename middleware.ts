import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pageUrl = request.nextUrl.pathname
 
  if (token&&pageUrl.startsWith("/sign")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if(token&&pageUrl==='/'){
    return NextResponse.redirect(new URL("/dashboard"))
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in","/sign-up"],
};