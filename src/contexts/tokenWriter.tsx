
// Third-party Imports
import { useSession } from 'next-auth/react'

const TokenWriter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Add any custom proxy logic here
  const { data: session }: any = useSession()
  if (session?.accessToken) {
    function parseJwt(token: any) {
      if (!token) {
        return null
      }

      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace('-', '+').replace('_', '/')

      return JSON.parse(window.atob(base64))
    }

    // console.log(session?.accessToken)

    const { preferred_username, resource_access, userType, realm_access } = parseJwt(session?.accessToken)

    const user_details = { preferred_username }
    const access_details: any = []

    for (const key in resource_access) {
      const filteredArray = resource_access[key].roles.filter((n: any) => {
        return access_details.indexOf(n) === -1
      })

      access_details.push(...filteredArray)
    }

    // TODO: Remove me
    access_details.push('CLAIM')
    localStorage.setItem('roles', JSON.stringify(realm_access.roles))
    localStorage.setItem('user_details', JSON.stringify(user_details))
    localStorage.setItem('access_details', JSON.stringify(access_details))
    localStorage.setItem('refresh_token', session.refreshToken)
    if (userType) {
      localStorage.setItem('userType', userType)
    } else {
      localStorage.removeItem('userType')
    }
  }

  return <>{children}</>
}

export default TokenWriter
