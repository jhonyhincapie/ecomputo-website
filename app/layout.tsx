import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFab } from '@/components/layout/WhatsAppFab'

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-heading' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-body' })

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Comercializadora ECOMPUTO'
/* metadataBase decide el dominio de canonical y og:image. Si solo se mira
   NEXT_PUBLIC_SITE_URL y esa variable no está puesta en Vercel, las URLs
   absolutas salen apuntando a localhost y la vista previa de WhatsApp no
   carga. VERCEL_PROJECT_PRODUCTION_URL la inyecta Vercel en cada build. */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description:
    'Computadores, portátiles, celulares y accesorios con garantía y envíos a toda Colombia. Cotiza por WhatsApp.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName,
    title: siteName,
    description:
      'Tecnología con garantía y envíos a toda Colombia: computadores, portátiles, celulares y accesorios. Cotiza por WhatsApp.',
    locale: 'es_CO',
    url: '/',
  },
  /* Sin esto, un enlace compartido por WhatsApp llega sin vista previa.
     La imagen la genera app/opengraph-image.tsx. */
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description:
      'Tecnología con garantía y envíos a toda Colombia. Cotiza por WhatsApp.',
  },
}

export const viewport: Viewport = {
  /* Pinta la barra del navegador móvil con el navy de la marca.
     Va aquí y no en `metadata`: themeColor quedó obsoleto ahí en Next 14. */
  themeColor: '#1e3459',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${bricolage.variable} ${jakarta.variable}`}>
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
