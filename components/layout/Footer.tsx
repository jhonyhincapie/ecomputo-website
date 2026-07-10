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

  return (
    <footer className="bg-navy-deep text-[#7c8db0]">
      <div className="divider-glow" />
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <span className="font-heading font-extrabold text-xl tracking-tight select-none">
            <span className="text-accent-light">e</span>
            <span className="text-chrome">COMPUTO</span>
          </span>
          <p className="text-sm leading-relaxed max-w-[32ch] mt-4">
            Computadores, portátiles, celulares y accesorios con garantía y soporte técnico en Medellín.
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
          {city && <p className="text-sm mt-1">{city}</p>}
          <Link href="/admin" className="text-xs text-[#4d5c7c] hover:text-[#7c8db0] mt-6 block">
            Admin
          </Link>
        </div>
      </div>

      <div className="border-t border-border-subtle/50 text-center py-4 text-xs">
        © {new Date().getFullYear()} Comercializadora ECOMPUTO. Todos los derechos reservados.
      </div>
    </footer>
  )
}
