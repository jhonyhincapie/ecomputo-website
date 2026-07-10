import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/products/ProductCard'
import { Reveal } from '@/components/ui/Reveal'
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
    <section className="bg-navy-deep py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <Reveal className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-chrome">Productos Destacados</span>
            </h2>
            <p className="text-[#9fb1d1] mt-1">Los más populares de nuestra tienda</p>
          </div>
          <Link href="/productos" className="text-accent-light hover:underline font-semibold hidden sm:block">
            Ver todos →
          </Link>
        </Reveal>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(products as Product[]).map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.06} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p>Pronto agregaremos productos destacados.</p>
            <Link href="/productos" className="mt-4 inline-block text-accent-light hover:underline">
              Ver catálogo completo →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
