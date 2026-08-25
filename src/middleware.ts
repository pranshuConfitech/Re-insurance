import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

const SKIP_PATHS = ['/api/auth/afterlogout']

const ROOT_PATH = '/dashboards'

export async function middleware(req:any) {
  console.log('middleware invoked: ', req.nextUrl.pathname)

  if (SKIP_PATHS.some(path => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next() // Skip middleware
  }

  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  console.log("Req URL = ",req.url);
  console.log(token?.error);
  

  if (token?.error === 'RefreshAccessTokenError') {
    console.log('refresh token expired')

    const response = NextResponse.redirect(new URL('/api/auth/afterlogout', process.env.NEXTAUTH_URL))

    
return response
  }

  return NextResponse.next()
}
