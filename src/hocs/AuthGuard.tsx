// Third-party Imports
// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

// Type Imports
import type { ChildrenType } from '@core/types'
import { auth } from '../libs/auth'

export default async function AuthGuard({ children }: ChildrenType) {
  const session = await auth()

  
return <>{session ? children : <AuthRedirect  />}</>
}
