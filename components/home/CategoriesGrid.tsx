import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { iconForSlug } from '@/lib/categoryIcons'
import { supabase } from '@/lib/supabase'
import { Reveal } from '@/components/ui/Reveal'
import type { Category } from '@/types'

const taglines: Record<string, string> = {
  computadores: 'Torres y todo-en-uno para oficina, diseño y gaming.',
  portatiles: 'Trabajo, estudio y juego donde lo necesites.',
  celulares: 'Los últimos modelos con garantía local.',
  accesorios: 'Todo lo que complementa tu equipo.',
}

/* Bento spans for exactly 4 cells: A(2)+B / C+D(2). Uniform fallback otherwise. */
const bentoSpans = ['md:col-span-2', '', '', 'md:col-span-2']

export async function CategoriesGrid() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('order_index')

  const cats = (categories as Category[]) || []
  const isBento = cats.length === 4

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 bg-navy">
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="text-chrome">Nuestras Categorías</span>
        </h2>
        <p className="text-[#9fb1d1] mb-10 max-w-[42ch]">Encuentra exactamente lo que necesitas</p>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cats.map((cat, i) => {
          const Icon = iconForSlug(cat.slug)
          const wide = isBento && (i === 0 || i === 3)
          return (
            <Reveal key={cat.id} delay={i * 0.07} className={isBento ? bentoSpans[i] : ''}>
              <Link
                href={`/categoria/${cat.slug}`}
                className={`card-tech relative rounded-2xl text-white group block overflow-hidden h-full ${
                  wide ? 'p-8 min-h-[190px]' : 'p-6 min-h-[190px]'
                }`}
              >
                {/* Wide cells get an extra glow field so the grid isn't uniform */}
                {wide && (
                  <div
                    className="absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_85%_15%,rgba(30,136,255,0.18),transparent_60%)] pointer-events-none"
                    aria-hidden
                  />
                )}
                <div className="relative flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-navy-deep border border-accent/25 flex items-center justify-center group-hover:border-accent-light/60 group-hover:shadow-[0_0_20px_-4px_rgba(56,189,248,0.5)] transition-all">
                    <Icon size={24} className="text-accent-light" strokeWidth={1.75} />
                  </div>
                  <h3 className={`font-bold mt-auto pt-6 ${wide ? 'text-2xl' : 'text-lg'}`}>{cat.name}</h3>
                  {wide && taglines[cat.slug] && (
                    <p className="text-[#9fb1d1] text-sm mt-1.5 max-w-[36ch]">{taglines[cat.slug]}</p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-accent-light text-sm font-semibold mt-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all">
                    Explorar <ArrowRight size={15} strokeWidth={2} />
                  </span>
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
