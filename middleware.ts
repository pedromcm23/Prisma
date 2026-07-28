import { NextResponse } from 'next/server'
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export default NextAuth(authConfig).auth((request) => {
  const path = request.nextUrl.pathname
  
  const isAuthenticated = !!request.auth;
  const role = request.auth?.user?.role || 'CUSTOMER';

  const isAdminRoute = path.startsWith('/admin')
  const isHostRoute = path.startsWith('/host')
  const isPublicHostRoute = path === '/host/onboarding' || path === '/host/builder'
  const isProtectedHostRoute = isHostRoute && !isPublicHostRoute
  const isCustomerRoute = path.startsWith('/customer')
  
  // Login redirection based on role
  if (path === '/login' && isAuthenticated) {
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/hosts', request.url))
    }
    if (role === 'HOST') {
      return NextResponse.redirect(new URL('/host/dashboard', request.url))
    }
    if (role === 'CUSTOMER') {
      return NextResponse.redirect(new URL('/search', request.url))
    }
  }

  // Protect Admin routes
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (role !== 'ADMIN') {
      // Redirect unauthorized users to their respective homes
      return NextResponse.redirect(new URL(role === 'HOST' ? '/host/dashboard' : '/search', request.url))
    }
  }

  // Protect Host routes
  if (isProtectedHostRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // We defer the strict role check to layout.tsx which can query the fresh DB state
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
    '/admin/:path*',
    '/host/:path*',
    '/customer/:path*',
  ],
}
