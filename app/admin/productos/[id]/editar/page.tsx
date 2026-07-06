import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { ProductForm } from '@/components/admin/ProductForm'
import type { Category, Product } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarProductoPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin')

  const { id } = await params

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabaseAdmin
      .from('products')
      .select('*, category:categories(id, name, slug, icon, order_index)')
      .eq('id', id)
      .single(),
    supabaseAdmin.from('categories').select('*').order('order_index'),
  ])

  if (!product) notFound()

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Link href="/admin/productos" className="hover:text-navy">Productos</Link>
            <span>›</span>
            <span className="text-gray-600 max-w-[200px] truncate">{product.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-navy">Editar producto</h1>
        </div>
        <ProductForm
          categories={(categories as Category[]) || []}
          product={product as Product}
        />
      </main>
    </div>
  )
}
