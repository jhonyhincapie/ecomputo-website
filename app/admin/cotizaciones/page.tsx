import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import type { Quotation } from '@/types'

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  replied: 'Respondida',
  closed: 'Cerrada',
}

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  replied: 'bg-blue-100 text-blue-800',
  closed: 'bg-gray-100 text-gray-600',
}

export default async function CotizacionesPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin')

  const { data: quotations } = await supabaseAdmin
    .from('quotations')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy">Cotizaciones</h1>
          <p className="text-gray-500 text-sm mt-1">{quotations?.length || 0} en total</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">Canal</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {(quotations as Quotation[] || []).map(q => (
                <tr key={q.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {formatDate(q.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{q.customer_name}</p>
                    <p className="text-xs text-gray-400">{q.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">
                    {q.product_name}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://wa.me/${q.customer_phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline text-xs"
                    >
                      {q.customer_phone}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {q.channel === 'email' ? '📧 Email' : '💬 WhatsApp'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[q.status]}`}>
                      {statusLabel[q.status]}
                    </span>
                  </td>
                </tr>
              ))}
              {(!quotations || quotations.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
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
