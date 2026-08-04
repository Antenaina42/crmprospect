import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Super Admin / Admin only routes
    if (path.startsWith("/parametres") && token?.role !== "SUPER_ADMIN" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/google-maps/:path*",
    "/prospects/:path*",
    "/agenda/:path*",
    "/devis/:path*",
    "/clients/:path*",
    "/statistiques/:path*",
    "/parametres/:path*",
  ],
};
