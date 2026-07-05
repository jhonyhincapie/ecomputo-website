import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/types'

export async function FeaturedProducts() {
  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(id, name, slug, icon, order_index)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-navy">Productos Destacados</h2>
            <p className="text-gray-500 mt-1">Los más populares de nuestra tienda</p>
          </div>
          <Link href="/productos" className="text-gold hover:underline font-semibold hidden sm:block">
            Ver todos →
          </Link>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(products as Product[]).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">🖥️</div>
            <p>Pronto agregaremos productos destacados.</p>
            <Link href="/productos" className="mt-4 inline-block text-gold hover:underline">
              Ver catálogo completo →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
