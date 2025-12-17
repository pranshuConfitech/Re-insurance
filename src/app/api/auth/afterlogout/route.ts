import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    console.log('after logout')
    const redirectUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = NextResponse.redirect(redirectUrl)
    const cookieHeader = req.headers.get('cookie') || ''

    // 🔥 Parse and clear all cookies
    const cookiesToClear = cookieHeader.split(';').map(cookie => {
      const [name] = cookie.split('=')

      return `${name.trim()}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
    })

    // 🔥 Set all cookies in the response headers to expire them
    cookiesToClear.forEach(cookie => response.headers.append('Set-Cookie', cookie))

    return response
  } catch (error) {
    console.error('❌ Server-side logout error:', error)

    return NextResponse.json({ error: 'Failed to log out user' }, { status: 500 })
  }
}
