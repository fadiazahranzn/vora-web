import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { auth } from '@/auth'
import SessionProvider from '@/components/auth/SessionProvider'
import QueryProvider from '@/components/providers/QueryProvider'
import { ToastProvider } from '@/components/ui/Toast'
import { ThemeProvider } from '@/contexts/ThemeContext'
import '../styles/globals.css'
import ServiceWorkerRegister from '@/components/pwa/ServiceWorkerRegister'
import PWAInstallPrompt from '@/components/pwa/PWAInstallPrompt'
import { headers } from 'next/headers'

export const viewport: Viewport = {
  themeColor: '#7C5CFC',
  width: 'device-width',
  initialScale: 1,
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Vora Web App',
  description: 'Track your goals and habits',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Vora',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: '/icons/apple-icon-180.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const nonce = (await headers()).get('x-nonce') || ''

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          nonce={nonce}
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
              <ToastProvider>
                {children}
                <ServiceWorkerRegister />
                <PWAInstallPrompt />
              </ToastProvider>
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
