import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (request.cookies.get('session') === undefined) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Home
  if (request.nextUrl.pathname === '/') {
    if (request.cookies.get('session') !== undefined) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
}
 
export const config = {
  matcher: '/:path*',
}