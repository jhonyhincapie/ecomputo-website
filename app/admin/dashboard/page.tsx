import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import type { Quotation } from '@/types'

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function weekAgoISOString() {
  return new Date(Date.now() - 7 * 86400000).toISOString()
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekAgo = weekAgoISOString()

  const [{ count: totalProducts }, { count: todayCount }, { count: weekCount }, { data: recent }] =
    await Promise.all([
      supabaseAdmin
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true),
      supabaseAdmin
        .from('quotations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString()),
      supabaseAdmin
        .from('quotations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo),
      supabaseAdmin
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
    ])

  const statusColor = (s: string) =>
    s === 'pending'
      ? 'bg-yellow-100 text-yellow-800'
      : s === 'replied'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-gray-100 text-gray-600'

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-navy mb-2">Dashboard</h1>
        <p className="text-gray-500 text-sm mb-8">Bienvenido al panel de administración</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Productos activos', value: totalProducts || 0, icon: '📦' },
            { label: 'Cotizaciones hoy', value: todayCount || 0, icon: '📋' },
            { label: 'Esta semana', value: weekCount || 0, icon: '📅' },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-sm">{card.label}</p>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <p className="text-4xl font-bold text-navy">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex gap-3 mb-8">
          <Link
            href="/admin/productos/nuevo"
            className="bg-navy hover:bg-navy-light text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Agregar producto
          </Link>
          <Link
            href="/admin/cotizaciones"
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Ver cotizaciones
          </Link>
        </div>

        {/* Recent quotations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-navy">Últimas cotizaciones</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Canal</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {(recent as Quotation[] || []).map(q => (
                <tr key={q.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{q.customer_name}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">{q.product_name}</td>
                  <td className="px-4 py-3">{q.channel === 'email' ? '📧' : '💬'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(q.status)}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(q.created_at)}</td>
                </tr>
              ))}
              {(!recent || recent.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No hay cotizaciones aún.
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
