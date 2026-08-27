// import NextAuth from 'next-auth'
// import Keycloak from 'next-auth/providers/keycloak'

// import { createTokenId, deleteTokens, getTokens, saveTokens, stripTokenSecrets } from './token-store'

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [Keycloak],
//   callbacks: {
//     async jwt({ token, account }: { token: any, account?: any }) {
//       if (account) {
//         const tokenId = token.tokenId ?? createTokenId()

//         await saveTokens(tokenId, {
//           accessToken: account.access_token,
//           refreshToken: account.refresh_token,
//           idToken: account.id_token,
//           accessTokenExpires: account.expires_at * 1000
//         })

//         token.tokenId = tokenId
//         token.accessTokenExpires = account.expires_at * 1000
//         delete token.error

//         return stripTokenSecrets(token)
//       }

//       // Existing sessions stored the full Keycloak JWT in the cookie — move it server-side.
//       if (token.accessToken && !token.tokenId) {
//         const tokenId = createTokenId()

//         await saveTokens(tokenId, {
//           accessToken: token.accessToken,
//           refreshToken: token.refreshToken,
//           idToken: token.idToken,
//           accessTokenExpires: token.accessTokenExpires
//         })

//         token.tokenId = tokenId
//       }

//       const stored = token.tokenId ? await getTokens(token.tokenId) : null

//       if (stored && Date.now() < stored.accessTokenExpires) {
//         token.accessTokenExpires = stored.accessTokenExpires

//         return stripTokenSecrets(token)
//       }

//       if (token.accessTokenExpires && Date.now() < token.accessTokenExpires && stored) {
//         return stripTokenSecrets(token)
//       }

//       return await refreshAccessToken(token)
//     },
//     async session({ session, token }: { session: any, token: any }) {
//       const stored = token.tokenId ? await getTokens(token.tokenId) : null

//       session.accessToken = stored?.accessToken
//       session.refreshToken = stored?.refreshToken
//       session.idToken = stored?.idToken
//       session.error = token.error

//       return session
//     }
//   }
// })

// async function refreshAccessToken(token: any) {
//   try {
//     const stored = token.tokenId ? await getTokens(token.tokenId) : null
//     const refreshToken = stored?.refreshToken ?? token.refreshToken

//     if (!refreshToken) {
//       throw new Error('No refresh token')
//     }

//     const url = `${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`

//     const response = await fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       body: new URLSearchParams({
//         client_id: process.env.AUTH_KEYCLOAK_ID ?? '',
//         client_secret: process.env.AUTH_KEYCLOAK_SECRET ?? '',
//         grant_type: 'refresh_token',
//         refresh_token: refreshToken
//       })
//     })

//     const refreshedTokens = await response.json()

//     if (!response.ok) throw refreshedTokens

//     const tokenId = token.tokenId ?? createTokenId()
//     const accessTokenExpires = Date.now() + refreshedTokens.expires_in * 1000

//     await saveTokens(tokenId, {
//       accessToken: refreshedTokens.access_token,
//       idToken: refreshedTokens.id_token,
//       refreshToken: refreshedTokens.refresh_token ?? refreshToken,
//       accessTokenExpires
//     })

//     token.tokenId = tokenId
//     token.accessTokenExpires = accessTokenExpires
//     delete token.error

//     return stripTokenSecrets(token)
//   } catch (error) {
//     console.log('❌ Refresh token failed', error)

//     if (token.tokenId) {
//       await deleteTokens(token.tokenId)
//     }

//     return stripTokenSecrets({ ...token, error: 'RefreshAccessTokenError' })
//   }
// }


import NextAuth from 'next-auth'
import Keycloak from 'next-auth/providers/keycloak'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Keycloak],
  callbacks: {
    async jwt({ token, account }: { token: any, account?: any }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.idToken = account.id_token
        token.accessTokenExpires = account.expires_at * 1000
        delete token.error

        return token
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }

      return await refreshAccessToken(token)
    },
    async session({ session, token }: { session: any, token: any }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.idToken = token.idToken
      session.error = token.error

      return session
    }
  }
})

async function refreshAccessToken(token: any) {
  try {
    if (!token.refreshToken) {
      throw new Error('No refresh token')
    }

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
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      error: undefined
    }
  } catch (error) {
    console.log('❌ Refresh token failed', error)

    return { ...token, error: 'RefreshAccessTokenError' }
  }
}
