'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Package,
  Tag,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react'

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/categorias', label: 'Categorías', icon: Tag },
  { href: '/admin/cotizaciones', label: 'Cotizaciones', icon: MessageSquare },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
]

export function AdminSidebar() {
  const path = usePathname()

  return (
    <aside className="w-64 bg-navy min-h-screen flex flex-col shrink-0">
      <div className="p-6 border-b border-navy-light flex items-center gap-3">
        <Image src="/logo.png" alt="ECOMPUTO" width={32} height={32} className="object-contain" />
        <div>
          <h2 className="text-white font-bold text-sm">ECOMPUTO</h2>
          <p className="text-gray-400 text-xs">Panel admin</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== '/admin/dashboard' && path.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-gold text-navy font-semibold'
                  : 'text-gray-300 hover:bg-navy-light hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-navy-light">
        <button
          onClick={() => signOut({ callbackUrl: '/admin' })}
          className="flex items-center gap-3 text-gray-400 hover:text-white text-sm w-full transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
