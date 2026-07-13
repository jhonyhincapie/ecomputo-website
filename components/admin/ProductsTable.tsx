'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ImageOff, Pencil, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { Product } from '@/types'

function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)
}

export function ProductsTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q)
    )
  }, [products, query])

  return (
    <>
      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por nombre o categoría..."
          className="pl-9"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3 font-medium w-16">Imagen</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Destacado</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-2">
                  {p.image_url ? (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      <Image src={p.image_url} alt={p.name} fill sizes="40px" className="object-contain p-0.5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                      <ImageOff size={14} className="text-gray-300" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-navy max-w-[200px] truncate">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">
                  {p.category ? `${p.category.icon} ${p.category.name}` : '—'}
                </td>
                <td className="px-4 py-3 text-accent font-semibold">{formatCOP(p.price)}</td>
                <td className="px-4 py-3">{p.is_featured ? '⭐' : '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      p.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {p.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/productos/${p.id}/editar`}
                    className="inline-flex items-center gap-1 text-navy hover:bg-gray-100 text-xs font-medium px-2 py-1.5 rounded-md transition-colors"
                  >
                    <Pencil size={13} strokeWidth={1.75} />
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  {query ? (
                    <>No hay resultados para &ldquo;{query}&rdquo;.</>
                  ) : (
                    <>
                      No hay productos aún.{' '}
                      <Link href="/admin/productos/nuevo" className="text-navy hover:underline">
                        Agregar el primero
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
