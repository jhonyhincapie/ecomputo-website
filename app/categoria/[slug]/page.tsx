import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/products/ProductCard'
import type { Category, Product } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(id, name, slug, icon, order_index)')
    .eq('is_active', true)
    .eq('category_id', (category as Category).id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-navy min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-5xl">{(category as Category).icon}</span>
        <div>
          <h1 className="text-3xl font-bold text-white">{(category as Category).name}</h1>
          <p className="text-gray-400 mt-1">
            {products?.length || 0} productos disponibles
          </p>
        </div>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(products as Product[]).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <div className="text-6xl mb-4">{(category as Category).icon}</div>
          <p className="text-lg">No hay productos en esta categoría aún.</p>
          <p className="text-sm mt-1">Vuelve pronto, estamos actualizando el catálogo.</p>
        </div>
      )}
    </div>
  )
}
