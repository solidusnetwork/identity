import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected app routes — require authentication
const protectedPaths = [
  '/dashboard',
  '/my-trust-score',
  '/my-credentials',
  '/inbox',
  '/marketplace',
  '/identity',
  '/sharing',
  '/activity',
  '/notifications',
  '/settings',
  '/qr-scanner',
  '/share',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // TODO: Replace with real session check via @solidus/jwt or cookie validation
  const isAuthenticated = request.cookies.has('solidus_session')

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image, favicon.ico
     * - /logos/ (public assets)
     * - /api/ routes
     */
    '/((?!_next/static|_next/image|favicon.ico|logos|api).*)',
  ],
}
