import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublic = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/invoices/new',      
  '/invoices(.*)/payment',
  '/pricing(.*)',
])

const isOnboarding = createRouteMatcher(['/onboarding(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const onboarded = (sessionClaims?.publicMetadata as any)?.onboarded === true;

 

  // Authenticated + not onboarded + not already on /onboarding → force onboarding
  if (userId && !onboarded && !isOnboarding(req) && !isPublic(req)) {
    return Response.redirect(new URL('/onboarding', req.url));
  }

  // Authenticated + onboarded + trying to visit /onboarding → send to dashboard
  if (userId && onboarded && isOnboarding(req)) {
    return Response.redirect(new URL('/dashboard', req.url));
  }


  if (!isPublic(req)) await auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}