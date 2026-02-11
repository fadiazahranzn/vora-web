import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { auth } from '@/auth'
import SessionProvider from '@/components/auth/SessionProvider'
import '../styles/globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Vora Web App',
  description: 'Track your goals and habits',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
