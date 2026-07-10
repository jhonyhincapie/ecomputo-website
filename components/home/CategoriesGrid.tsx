import Link from 'next/link'
import { Monitor, Laptop, Smartphone, Headphones, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types'

const slugIcons: Record<string, typeof Monitor> = {
  computadores: Monitor,
  portatiles: Laptop,
  celulares: Smartphone,
  accesorios: Headphones,
}

export async function CategoriesGrid() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('order_index')

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 bg-navy">
      <h2 className="text-3xl font-bold text-white text-center mb-3">Nuestras Categorías</h2>
      <p className="text-gray-400 text-center mb-10">Encuentra exactamente lo que necesitas</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {(categories as Category[] || []).map(cat => {
          const Icon = slugIcons[cat.slug] || Package
          return (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="cat-card rounded-xl p-6 text-center cursor-pointer text-white group"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-navy border border-border-subtle flex items-center justify-center group-hover:border-accent transition-colors">
                <Icon size={26} className="text-accent-light" strokeWidth={1.75} />
              </div>
              <h3 className="font-semibold text-base">{cat.name}</h3>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
