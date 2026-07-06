import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types'

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
        {(categories as Category[] || []).map(cat => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className="cat-card rounded-xl p-6 text-center cursor-pointer text-white"
          >
            <div className="text-5xl mb-3">{cat.icon}</div>
            <h3 className="font-semibold text-base">{cat.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
