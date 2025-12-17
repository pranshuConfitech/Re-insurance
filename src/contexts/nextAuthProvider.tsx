'use client'

// Third-party Imports
import type { SessionProviderProps } from 'next-auth/react'
import { SessionProvider } from 'next-auth/react'

import TokenWriter from './tokenWriter'

export const NextAuthProvider = ({ children, ...rest }: SessionProviderProps) => {
  return (
    <SessionProvider {...rest}>
      <TokenWriter>{children}</TokenWriter>
    </SessionProvider>
  )
}
