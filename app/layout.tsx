import type { Metadata } from 'next'
import { Lexend, Source_Sans_3 } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFab } from '@/components/layout/WhatsAppFab'

const lexend = Lexend({ subsets: ['latin'], variable: '--font-heading' })
const sourceSans = Source_Sans_3({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || 'Comercializadora ECOMPUTO',
  description: 'Computadores, portátiles, celulares y accesorios en Medellín, Colombia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${lexend.variable} ${sourceSans.variable}`}>
      <body className="bg-navy min-h-screen flex flex-col font-body">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  )
}
