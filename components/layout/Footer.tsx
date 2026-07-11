import Link from 'next/link'

const categories = [
  { label: 'Computadores', slug: 'computadores' },
  { label: 'Portátiles', slug: 'portatiles' },
  { label: 'Celulares', slug: 'celulares' },
  { label: 'Accesorios', slug: 'accesorios' },
]

export function Footer() {
  const phone = process.env.NEXT_PUBLIC_SITE_PHONE || ''
  const city = process.env.NEXT_PUBLIC_SITE_CITY || ''
  /* Real store pin: Comercializadora Ecomputo, Medellín (Google Maps place) */
  const address = 'Calle 50 N° 65-50 Local 121, Centro Comercial Contemporáneo'
  const mapSrc =
    'https://maps.google.com/maps?ll=6.2565168,-75.5815556&q=Comercializadora+Ecomputo,+Medell%C3%ADn&z=16&output=embed'
  const mapLink =
    'https://www.google.com/maps/place/Comercializadora+Ecomputo/@6.2565168,-75.5815556,17z'

  return (
    <footer className="bg-navy-deep text-[#8b9cbd]">
      <div className="divider-glow" />
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <span className="font-heading font-extrabold text-xl tracking-tight select-none">
            <span className="text-accent-light">e</span>
            <span className="text-chrome">COMPUTO</span>
          </span>
          <p className="text-sm leading-relaxed max-w-[32ch] mt-4">
            Computadores, portátiles, celulares y accesorios con garantía y envíos a toda Colombia.
          </p>
          {city && <p className="text-sm mt-1">{city}</p>}
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Categorías</h3>
          <ul className="space-y-2 text-sm">
            {categories.map(c => (
              <li key={c.slug}>
                <Link href={`/categoria/${c.slug}`} className="hover:text-accent-light transition-colors">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Contacto</h3>
          {phone && <p className="text-sm">{phone}</p>}
          <p className="text-sm mt-1 leading-relaxed">{address}</p>
          {city && <p className="text-sm mt-1">{city}</p>}
          <Link href="/admin" className="text-xs text-[#4d5c7c] hover:text-[#8b9cbd] mt-6 block">
            Admin
          </Link>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Ubicación</h3>
          <div className="rounded-xl overflow-hidden border border-border-subtle/60">
            <iframe
              src={mapSrc}
              title="Mapa de ubicación: Comercializadora Ecomputo, Medellín"
              className="w-full h-44 block grayscale-[35%] contrast-[1.05] opacity-90"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <p className="text-xs leading-relaxed mt-2.5">{address}</p>
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-accent-light hover:text-white transition-colors mt-1.5"
          >
            Cómo llegar →
          </a>
        </div>
      </div>

      <div className="border-t border-border-subtle/50 text-center py-4 text-xs">
        © {new Date().getFullYear()} Comercializadora ECOMPUTO. Todos los derechos reservados.
      </div>
    </footer>
  )
}
