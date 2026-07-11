import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { iconForSlug } from '@/lib/categoryIcons'
import { supabase } from '@/lib/supabase'
import { Reveal } from '@/components/ui/Reveal'
import type { Category } from '@/types'

export async function CategoriesGrid() {
  const [{ data: categories }, { data: withImages }] = await Promise.all([
    supabase.from('categories').select('*').order('order_index'),
    supabase
      .from('products')
      .select('category_id, image_url')
      .eq('is_active', true)
      .not('image_url', 'is', null)
      .order('created_at', { ascending: false }),
  ])

  const cats = (categories as Category[]) || []

  /* First (newest) product photo per category = its reference image */
  const coverByCategory = new Map<string, string>()
  for (const p of withImages || []) {
    if (p.category_id && p.image_url && !coverByCategory.has(p.category_id)) {
      coverByCategory.set(p.category_id, p.image_url)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 md:py-16 bg-navy">
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="text-chrome">Nuestras Categorías</span>
        </h2>
        <p className="text-[#9fb1d1] mb-7 max-w-[42ch]">Encuentra exactamente lo que necesitas</p>
      </Reveal>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cats.map((cat, i) => {
          const Icon = iconForSlug(cat.slug)
          const cover = coverByCategory.get(cat.id)
          return (
            <Reveal key={cat.id} delay={i * 0.07}>
              <Link
                href={`/categoria/${cat.slug}`}
                className="card-tech rounded-2xl text-white group block overflow-hidden h-full"
              >
                {/* Reference image band: real product photo when the catalog
                    has one, otherwise a soft brand field with the icon */}
                <div className="relative aspect-[16/10] bg-navy-deep overflow-hidden">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={cat.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(74,143,212,0.22),transparent_65%)]">
                      <Icon
                        size={44}
                        className="text-accent-light/80 group-hover:text-accent-light group-hover:scale-110 transition-all duration-300"
                        strokeWidth={1.25}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 px-4 py-3.5">
                  <h3 className="font-bold text-sm md:text-base truncate">{cat.name}</h3>
                  <ArrowRight
                    size={16}
                    strokeWidth={2}
                    className="shrink-0 text-accent-light opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  />
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
