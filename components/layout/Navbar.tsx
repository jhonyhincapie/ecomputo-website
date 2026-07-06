'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/categoria/computadores', label: 'Computadores' },
  { href: '/categoria/portatiles', label: 'Portátiles' },
  { href: '/categoria/celulares', label: 'Celulares' },
  { href: '/categoria/accesorios', label: 'Accesorios' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="bg-navy sticky top-0 z-50 border-b border-navy-light">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="ECOMPUTO" width={40} height={40} className="object-contain" />
          <span className="text-white font-bold text-lg hidden sm:block font-heading">ECOMPUTO</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-gray-300 hover:text-accent-light transition-colors text-sm font-medium"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/productos"
            className="bg-accent hover:bg-accent-dark text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors hidden sm:block"
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
        <div className="md:hidden bg-navy-light border-t border-navy">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-4 py-3 text-gray-300 hover:text-accent-light border-b border-navy"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="px-4 py-3">
            <Link
              href="/productos"
              className="block w-full text-center bg-accent hover:bg-accent-dark text-white font-bold py-2 rounded-lg text-sm"
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
