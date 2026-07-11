import Link from 'next/link'
import { PackageOpen, ArrowRight } from 'lucide-react'
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
    <section className="bg-navy-deep py-10 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <Reveal className="flex items-center justify-between mb-7">
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
          <Reveal>
            <div className="card-tech relative rounded-2xl overflow-hidden px-8 py-10 md:py-12 flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="absolute inset-0 circuit-grid pointer-events-none" aria-hidden />
              <div className="relative w-16 h-16 shrink-0 rounded-2xl bg-navy-deep border border-accent/25 flex items-center justify-center shadow-[0_0_24px_-8px_rgba(125,184,232,0.4)]">
                <PackageOpen size={30} className="text-accent-light" strokeWidth={1.5} />
              </div>
              <div className="relative flex-1 text-center md:text-left">
                <h3 className="text-white font-bold text-xl md:text-2xl">
                  Estamos seleccionando lo mejor para ti
                </h3>
                <p className="text-[#9fb1d1] mt-1.5 max-w-[52ch]">
                  Muy pronto verás aquí los equipos más populares de la tienda, con precios y cotización inmediata.
                </p>
              </div>
              <Link
                href="/productos"
                className="btn-ghost-tech relative inline-flex items-center gap-2 text-white font-semibold px-6 py-3 text-sm shrink-0"
              >
                Explorar el catálogo <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
