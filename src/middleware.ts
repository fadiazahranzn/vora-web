import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const isAuthenticated = !!req.auth

  const isAuthRoute = ['/login', '/register'].includes(nextUrl.pathname)
  const isApiRoute = nextUrl.pathname.startsWith('/api')
  // const isPublicRoute = ["/"].includes(nextUrl.pathname); // Example public route

  // Protected routes: everything NOT auth, NOT api, NOT static.
  // Actually, usually app routes are protected.
  // Assuming all non-auth pages are potentially protected except landing page if any?
  // The story says: "redirect unauthenticated users from (app) routes".
  // If (app) group is `src/app/(app)/...` then URLs don't have (app).
  // Usually this means *everything* except /login, /register, and public assets is protected.

  // Handling logic:
  if (isApiRoute) return NextResponse.next()

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  if (!isAuthenticated && !isAuthRoute) {
    // Redirect to login if accessing protected route
    // Allow "/" (dashboard) only if authenticated? The story says redirect unauth to /login.
    // So root "/" is protected.
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
