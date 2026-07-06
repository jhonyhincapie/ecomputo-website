import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { ProductForm } from '@/components/admin/ProductForm'
import type { Category } from '@/types'

export default async function NuevoProductoPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin')

  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('order_index')

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Link href="/admin/productos" className="hover:text-navy">Productos</Link>
            <span>›</span>
            <span className="text-gray-600">Nuevo</span>
          </div>
          <h1 className="text-2xl font-bold text-navy">Nuevo Producto</h1>
        </div>
        <ProductForm categories={(categories as Category[]) || []} />
      </main>
    </div>
  )
}
