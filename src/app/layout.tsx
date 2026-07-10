import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Kepton',
  description: 'May these lights guide you on your path.',
  icons: {
    icon: [
      { url: '/assets/brand/kepton-icon.svg', type: 'image/svg+xml' },
      { url: '/assets/brand/kepton-logo.png', type: 'image/png' },
    ],
    apple: '/assets/brand/kepton-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} h-full`}>
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  )
}
