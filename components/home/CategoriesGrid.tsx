import Link from 'next/link'
import { iconForSlug } from '@/lib/categoryIcons'
import { supabase } from '@/lib/supabase'
import { Reveal } from '@/components/ui/Reveal'
import type { Category } from '@/types'

export async function CategoriesGrid() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('order_index')

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 bg-navy">
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          <span className="text-chrome">Nuestras Categorías</span>
        </h2>
        <p className="text-[#9fb1d1] text-center mb-10">Encuentra exactamente lo que necesitas</p>
      </Reveal>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {(categories as Category[] || []).map((cat, i) => {
          const Icon = iconForSlug(cat.slug)
          return (
            <Reveal key={cat.id} delay={i * 0.06}>
              <Link
                href={`/categoria/${cat.slug}`}
                className="cat-card rounded-xl p-6 text-center cursor-pointer text-white group block h-full"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-navy-deep border border-accent/25 flex items-center justify-center group-hover:border-accent-light/60 group-hover:shadow-[0_0_20px_-4px_rgba(56,189,248,0.5)] transition-all">
                  <Icon size={26} className="text-accent-light" strokeWidth={1.75} />
                </div>
                <h3 className="font-semibold text-base">{cat.name}</h3>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
