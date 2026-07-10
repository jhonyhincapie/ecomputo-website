'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/categoria/computadores', label: 'Computadores' },
  { href: '/categoria/portatiles', label: 'Portátiles' },
  { href: '/categoria/celulares', label: 'Celulares' },
  { href: '/categoria/accesorios', label: 'Accesorios' },
]

/* Wordmark reproduces the logo type treatment: electric "e" + chrome "COMPUTO" */
function Wordmark() {
  return (
    <span className="font-heading font-extrabold text-xl tracking-tight leading-none select-none">
      <span className="text-accent-light">e</span>
      <span className="text-chrome">COMPUTO</span>
    </span>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 bg-navy/80 backdrop-blur-md border-b border-accent/15">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="ECOMPUTO - Inicio">
          <Wordmark />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[#9fb1d1] hover:text-accent-light transition-colors text-sm font-medium"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/productos"
            className="btn-electric text-white font-bold px-4 py-2 rounded-lg text-sm hidden sm:block"
          >
            Ver catálogo
          </Link>
          <button
            className="md:hidden text-white p-1"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-navy-deep/95 backdrop-blur-md border-t border-accent/15">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-4 py-3 text-[#9fb1d1] hover:text-accent-light border-b border-border-subtle/50"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="px-4 py-3">
            <Link
              href="/productos"
              className="btn-electric block w-full text-center text-white font-bold py-2 rounded-lg text-sm"
              onClick={() => setOpen(false)}
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
