// Next Imports
import { redirect } from 'next/navigation'


// Type Imports
import { useSession } from 'next-auth/react'

import type { ChildrenType } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Util Imports

const GuestOnlyRoute = ({ children }: ChildrenType) => {
  const session =  useSession()

  if (session) {
    redirect(themeConfig.homePageUrl)
  }

  return <>{children}</>
}

export default GuestOnlyRoute
