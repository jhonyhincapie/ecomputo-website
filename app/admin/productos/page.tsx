import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import type { Product } from '@/types'

function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)
}

export default async function AdminProductosPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin')

  const { data: products } = await supabaseAdmin
    .from('products')
    .select('*, category:categories(id, name, slug, icon, order_index)')
    .order('created_at', { ascending: false })

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy">Productos</h1>
            <p className="text-gray-500 text-sm mt-1">{products?.length || 0} productos en total</p>
          </div>
          <Link
            href="/admin/productos/nuevo"
            className="bg-navy hover:bg-navy-light text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            + Agregar producto
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Destacado</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {(products as Product[] || []).map(p => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-navy max-w-[200px] truncate">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {p.category ? `${p.category.icon} ${p.category.name}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gold font-semibold">{formatCOP(p.price)}</td>
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
                      className="text-navy hover:underline text-xs font-medium"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
              {(!products || products.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    No hay productos aún.{' '}
                    <Link href="/admin/productos/nuevo" className="text-navy hover:underline">
                      Agregar el primero
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
