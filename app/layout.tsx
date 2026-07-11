import type { Metadata } from 'next'
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFab } from '@/components/layout/WhatsAppFab'

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-heading' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-body' })

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Comercializadora ECOMPUTO'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description:
    'Computadores, portátiles, celulares y accesorios con garantía y envíos a toda Colombia. Cotiza por WhatsApp.',
  openGraph: {
    type: 'website',
    siteName,
    title: siteName,
    description:
      'Tecnología con garantía y envíos a toda Colombia: computadores, portátiles, celulares y accesorios. Cotiza por WhatsApp.',
    locale: 'es_CO',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${bricolage.variable} ${jakarta.variable}`}>
      <body className="bg-navy min-h-screen flex flex-col font-body">
        <div className="grain-overlay" aria-hidden />
        <div className="electric-ambient" aria-hidden>
          <em />
          <b />
          <span />
          <span />
          <i />
          <i />
        </div>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  )
}
