/**
 * Global middleware for authentication and security
 * Runs on every request
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/auth/callback',
  '/api/auth',
  '/_next',
  '/favicon.ico',
]

const PROTECTED_ROUTES = [
  '/explore',
  '/events',
  '/bookings',
  '/messages',
  '/profile',
]

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route))
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const requestId = crypto.getRandomValues(new Uint8Array(16)).toString()

  // Add request ID to response headers
  const response = NextResponse.next()
  response.headers.set('x-request-id', requestId)

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Check authentication for protected routes
  if (isProtectedRoute(pathname)) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Verify token
    const user = await verifyAuth(token)
    if (!user) {
      // Token invalid, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Add user info to request headers
    response.headers.set('x-user-id', user.userId)
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === '/login' || pathname === '/signup') && request.cookies.get('auth-token')) {
    return NextResponse.redirect(new URL('/explore', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
