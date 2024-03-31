import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './middleware_is_bullshit'

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session')

  // Dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const session = await getSession(sessionToken?.value)
    if (!session || new Date(session.expires) < new Date()) {
      console.log('deleting', session)
      cookies().delete('session')
      cookies().delete('user')
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Home
  if (request.nextUrl.pathname === '/') {
    if (sessionToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
}
 
export const config = {
  matcher: '/:path*',
}