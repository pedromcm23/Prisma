import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // NOTE: This is a placeholder for the actual token extraction logic using NextAuth
  // e.g., const token = await getToken({ req: request })
  // const role = token?.role
  
  const isAuthenticated = false; // Replace with actual token check
  type UserRole = 'HOST' | 'CUSTOMER';
  const role: UserRole = 'CUSTOMER'; // Replace with actual role ('HOST' | 'CUSTOMER')

  const isHostRoute = path.startsWith('/host')
  const isCustomerRoute = path.startsWith('/customer')
  
  // Login redirection based on role
  if (path === '/login' && isAuthenticated) {
    if (role === 'HOST') {
      return NextResponse.redirect(new URL('/host/profile', request.url))
    }
    if (role === 'CUSTOMER') {
      return NextResponse.redirect(new URL('/search', request.url))
    }
  }

  // Protect Host routes
  if (isHostRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (role !== 'HOST') {
      return NextResponse.redirect(new URL('/search', request.url))
    }
  }

  // Protect Customer routes
  if (isCustomerRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (role !== 'CUSTOMER') {
      return NextResponse.redirect(new URL('/host/profile', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/host/:path*',
    '/customer/:path*',
  ],
}
