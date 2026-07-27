import { NextResponse } from 'next/server'
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export default NextAuth(authConfig).auth((request) => {
  const path = request.nextUrl.pathname
  
  const isAuthenticated = !!request.auth;
  const role = request.auth?.user?.role || 'CUSTOMER';

  const isHostRoute = path.startsWith('/host')
  const isPublicHostRoute = path === '/host/onboarding' || path === '/host/builder'
  const isProtectedHostRoute = isHostRoute && !isPublicHostRoute
  const isCustomerRoute = path.startsWith('/customer')
  
  // Login redirection based on role
  if (path === '/login' && isAuthenticated) {
    if (role === 'HOST') {
      return NextResponse.redirect(new URL('/host/dashboard', request.url))
    }
    if (role === 'CUSTOMER') {
      return NextResponse.redirect(new URL('/search', request.url))
    }
  }

  // Protect Host routes
  if (isProtectedHostRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (role !== 'HOST') {
      return NextResponse.redirect(new URL('/host/onboarding', request.url))
    }
  }

  // Protect Customer routes
  if (isCustomerRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/login',
    '/host/:path*',
    '/customer/:path*',
  ],
}
