import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  afterAuth(auth, req) {
    if (auth.userId) {
      const response = NextResponse.next();
      response.headers.set('x-user-id', auth.userId);
      return response;
    }
  },
  publicRoutes: ["/", "/sign-in", "/sign-up"]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};