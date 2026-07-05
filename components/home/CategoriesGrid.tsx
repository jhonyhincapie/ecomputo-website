import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types'

const colorMap: Record<string, string> = {
  computadores: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-900',
  portatiles: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-900',
  celulares: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-900',
  accesorios: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-900',
}

export async function CategoriesGrid() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('order_index')

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-navy text-center mb-3">Nuestras Categorías</h2>
      <p className="text-gray-500 text-center mb-10">Encuentra exactamente lo que necesitas</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {(categories as Category[] || []).map(cat => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className={`border rounded-xl p-6 text-center transition-all duration-200 hover:shadow-md cursor-pointer ${colorMap[cat.slug] || 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'}`}
          >
            <div className="text-5xl mb-3">{cat.icon}</div>
            <h3 className="font-semibold text-base">{cat.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
