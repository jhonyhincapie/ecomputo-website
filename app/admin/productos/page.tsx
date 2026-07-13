import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { ProductsTable } from '@/components/admin/ProductsTable'
import type { Product } from '@/types'

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

        <ProductsTable products={(products as Product[]) || []} />
      </main>
    </div>
  )
}
