import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'FindYourKing - Premium Social Network',
  description: 'Location-based dating and social networking platform with AI companions',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://findyourking.app',
    siteName: 'FindYourKing',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
