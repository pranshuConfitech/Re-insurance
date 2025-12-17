import { NextResponse } from 'next/server'
import { auth } from '../../../../libs/auth'
import { getToken } from 'next-auth/jwt'

export async function GET(req: Request) {
  try {
    const session: any = await auth()
    console.log('Session:', session)
    if (!session?.accessToken) {
      return NextResponse.json({ message: 'User is already logged out' }, { status: 200 })
    }

    const keycloakLogoutUrl = `${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/logout?id_token_hint=${session.idToken}&post_logout_redirect_uri=${encodeURIComponent(process.env.NEXTAUTH_URL as string)}/api/auth/afterlogout`

    const response = NextResponse.redirect(keycloakLogoutUrl)

    // Clear all session cookies (replace with your actual cookie names if different)
    response.headers.append(
      'Set-Cookie',
      'next-auth.session-token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
    )
    response.headers.append(
      'Set-Cookie',
      '__Secure-next-auth.session-token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
    )
    response.headers.append(
      'Set-Cookie',
      '__Host-next-auth.session-token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
    )

    return response
  } catch (error) {
    console.error('❌ Server-side logout error:', error)

    return NextResponse.json({ error: 'Failed to log out user' }, { status: 500 })
  }
}
