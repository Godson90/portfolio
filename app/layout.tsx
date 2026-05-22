import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'godsonadeola.dev', template: '%s · godsonadeola.dev' },
  description: 'Security engineer in Columbus, Ohio. I build production-grade tooling that real teams actually use.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
