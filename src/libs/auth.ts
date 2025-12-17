import NextAuth from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import Keycloak from 'next-auth/providers/keycloak'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Keycloak],
  callbacks: {
    async jwt({ token, account }: { token: any, account?: any }) {
      if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = account.expires_at * 1000
      }

      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      return await refreshAccessToken(token)
    },
    async session({ session, token }: { session: any, token: any }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.idToken = token.idToken

      return session
    }
  }
})

async function refreshAccessToken(token: any) {
  try {
    const url = `${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.AUTH_KEYCLOAK_ID ?? '',
        client_secret: process.env.AUTH_KEYCLOAK_SECRET ?? '',
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken
      })
    })

    const refreshedTokens = await response.json()

    if (!response.ok) throw refreshedTokens

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      idToken: refreshedTokens.id_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Use new one if available
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000 // Expiry in ms
    }
  } catch (error) {
    console.log('❌ Refresh token failed', error)

    return { ...token, error: 'RefreshAccessTokenError' }
  }
}
