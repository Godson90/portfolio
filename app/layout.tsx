import type { Metadata } from 'next'
import { SiteNav } from '@/components/ui/SiteNav'
import { SiteFooter } from '@/components/ui/SiteFooter'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://godsonadeola.dev'),
  title: { default: 'godsonadeola.dev', template: '%s · godsonadeola.dev' },
  description: 'Security engineer in Columbus, Ohio. I build production-grade tooling that real teams actually use.',
  openGraph: {
    type: 'website',
    siteName: 'godsonadeola.dev',
    title: 'godsonadeola.dev',
    description: 'Security engineer in Columbus, Ohio.',
  },
  twitter: { card: 'summary' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SiteNav />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  )
}
