import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  if (request.cookies.get('session') === undefined) {
    return NextResponse.redirect(new URL('/', request.url))
  } else {
    return NextResponse.next()
  }
}
 
export const config = {
  matcher: '/dashboard/:path*',
}