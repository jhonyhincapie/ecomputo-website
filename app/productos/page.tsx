import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductFilters } from '@/components/products/ProductFilters'
import type { Category, Product } from '@/types'

interface Props {
  searchParams: Promise<{ q?: string; cat?: string; sort?: string }>
}

export default async function ProductosPage({ searchParams }: Props) {
  const { q, cat, sort } = await searchParams

  const [{ data: categories }, { data: allProducts }] = await Promise.all([
    supabase.from('categories').select('*').order('order_index'),
    supabase
      .from('products')
      .select('*, category:categories(id, name, slug, icon, order_index)')
      .eq('is_active', true),
  ])

  let products = (allProducts as Product[]) || []

  if (q) {
    products = products.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase())
    )
  }
  if (cat) {
    products = products.filter(p => p.category?.slug === cat)
  }

  if (sort === 'price_asc') products.sort((a, b) => a.price - b.price)
  else if (sort === 'price_desc') products.sort((a, b) => b.price - a.price)
  else products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-navy min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Catálogo de Productos</h1>
        <p className="text-gray-400 mt-1">Encuentra el equipo perfecto para ti</p>
      </div>

      <div className="flex gap-8">
        <div className="w-64 shrink-0 hidden md:block">
          <Suspense>
            <ProductFilters categories={(categories as Category[]) || []} />
          </Suspense>
        </div>

        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-5">
            {products.length} {products.length === 1 ? 'producto' : 'productos'} encontrados
          </p>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-lg">No hay productos en esta categoría.</p>
              <p className="text-sm mt-1">Intenta con otra búsqueda o categoría.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
