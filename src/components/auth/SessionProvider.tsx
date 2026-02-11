'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

export interface SessionProviderProps extends React.PropsWithChildren {
  session?: any // Allow passing initial session (usually fetched server-side)
}

export default function SessionProvider({
  children,
  session,
}: SessionProviderProps) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  )
}
