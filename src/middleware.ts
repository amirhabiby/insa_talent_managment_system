import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routeAccessMap } from "./lib/setting";

const isProtectedRoute = createRouteMatcher("/admin");

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default clerkMiddleware(async (auth, req) => {
  // if (isProtectedRoute(req)) {
  //   // const { userId } = await auth(); // Await the promise to get userId
  //   // console.log("Clerk userId in middleware:", userId);
  //   // if (!userId) {
  //   //   console.log("User is NOT authenticated. Redirecting to /sign_up");
  //   //   const signUpUrl = new URL("/sign_up", req.url);
  //   //   signUpUrl.searchParams.set("redirect_url", req.url);
  //   //   console.log("Redirect URL:", signUpUrl.toString());
  //   //   return NextResponse.redirect(signUpUrl);
  //   // } else {
  //   //   console.log("User IS authenticated. Allowing access.");
  //   // }
  // }

  // // If not a protected route or authenticated, continue to the next middleware/route
  // return NextResponse.next();

  const { sessionClaims } = await auth();

  // console.log("Session Claims:", sessionClaims);

  const role = (sessionClaims?.metadata as { role?: string })?.role;

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && !allowedRoles.includes(role!)) {
      return NextResponse.redirect(new URL(`${role}`, req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
