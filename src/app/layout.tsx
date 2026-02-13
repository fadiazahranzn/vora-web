import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { auth } from '@/auth'
import SessionProvider from '@/components/auth/SessionProvider'
import QueryProvider from '@/components/providers/QueryProvider'
import { ToastProvider } from '@/components/ui/Toast'
import '../styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
      <body className={inter.variable}>
        <SessionProvider session={session}>
          <QueryProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
