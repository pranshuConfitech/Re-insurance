'use client'

// Next Imports
// Type Imports
import { useEffect, useRef } from 'react'

import { signIn } from 'next-auth/react'

const AuthRedirect = () => {
  const btnRf = useRef<any>()

  useEffect(() => {
    btnRf.current?.click()
  }, [])

  return <button ref={btnRf} onClick={() => signIn('keycloak')}></button>
}

export default AuthRedirect
