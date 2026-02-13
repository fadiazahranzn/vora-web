import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { auth } from '@/auth'
import SessionProvider from '@/components/auth/SessionProvider'
import QueryProvider from '@/components/providers/QueryProvider'
import { ToastProvider } from '@/components/ui/Toast'
import { ThemeProvider } from '@/contexts/ThemeContext'
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                var theme = localStorage.getItem('vora-theme') || 'system';
                var resolvedTheme = theme;
                if (theme === 'system') {
                  resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                document.documentElement.setAttribute('data-theme', resolvedTheme);
              } catch (e) {}
            })()
          `,
          }}
        />
      </head>
      <body className={inter.variable}>
        <SessionProvider session={session}>
          <QueryProvider>
            <ThemeProvider>
              <ToastProvider>{children}</ToastProvider>
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
