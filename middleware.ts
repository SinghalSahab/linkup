import { clerkMiddleware } from "@clerk/nextjs/server";
export default clerkMiddleware(async (auth, req) => {
    const publicRoutes = ["/","/api/webhook/clerk"];
    const ignoredRoutes = ["/api/webhook/clerk"];
  
    const pathname = req.nextUrl.pathname;
  
    // If the route is ignored, skip Clerk authentication
    if (ignoredRoutes.some((route) => pathname.startsWith(route))) {
      return;
    }
  
    // If the route is public, do not enforce authentication
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
      return;
    }
  
    // Protect all other routes
    const authObject = await auth();
    return authObject.redirectToSignIn();
  });

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};