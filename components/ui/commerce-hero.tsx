'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ProductImage } from '@/components/ui/ProductImage'
import { motion } from 'framer-motion'
import { iconForSlug } from '@/lib/categoryIcons'

export interface CommerceHeroCategory {
  title: string
  href: string
  /** Real product photo for the category; falls back to a lucide icon */
  image: string | null
  slug: string
}

interface CommerceHeroProps {
  title: string
  subtitle: string
  /** Full wa.me URL; hides the secondary CTA when null */
  waHref: string | null
  categories: CommerceHeroCategory[]
}

export function CommerceHero({ title, subtitle, waHref, categories }: CommerceHeroProps) {
  return (
    <div className="w-full relative container px-4 mx-auto max-w-7xl">
      {/* Hero panel: recessed navy surface with the brand circuit motifs */}
      <div className="mt-6 relative rounded-2xl overflow-hidden bg-navy-deep/60 border border-accent/15">
        <div className="absolute inset-0 hero-spotlight pointer-events-none" aria-hidden />
        <div className="absolute inset-0 circuit-grid pointer-events-none" aria-hidden />

        <motion.section
          className="relative w-full px-4 py-20 md:py-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="mx-auto text-center max-w-4xl">
            <motion.span
              className="inline-flex items-center gap-2 bg-navy-light/60 border border-accent/30 text-accent-light text-xs font-semibold px-3.5 py-1.5 rounded-full mb-7 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            >
              Tecnología con garantía en toda Colombia
            </motion.span>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6 leading-[1.05]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            >
              <span className="text-chrome">{title}</span>
            </motion.h1>
            <motion.p
              className="text-base md:text-lg text-[#9fb1d1] max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            >
              {subtitle}
            </motion.p>
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 mt-9"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
            >
              <Link
                href="/productos"
                className="btn-electric text-white font-bold px-8 py-3.5 rounded-lg text-base"
              >
                Ver catálogo
              </Link>
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-tech text-white font-bold px-8 py-3.5 rounded-lg text-base"
                >
                  Hablar con un asesor
                </a>
              )}
            </motion.div>

            {/* Glass stats cards */}
            <motion.div
              className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
            >
              {[
                { value: '500+', label: 'Clientes atendidos' },
                { value: '12', label: 'Meses de garantía' },
                { value: '24h', label: 'Soporte técnico' },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-navy-light/30 backdrop-blur-md border border-accent/20 px-3 py-4 sm:px-5"
                >
                  <p className="text-2xl sm:text-3xl font-extrabold text-accent-glow tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </div>

      {/* Category showcase: oversized title + floating product photo + corner arrow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mt-10">
        {categories.map((category, index) => {
          const Icon = iconForSlug(category.slug)
          return (
            <motion.div
              key={category.slug}
              className="card-tech group relative rounded-3xl p-4 sm:p-6 min-h-[250px] sm:min-h-[300px] w-full overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
            >
              <Link href={category.href} className="absolute inset-0 z-20">
                <h2 className="text-center text-2xl sm:text-3xl font-bold relative z-10 text-chrome my-2 sm:my-4 px-4 group-hover:text-accent-light transition-colors duration-300">
                  {category.title}
                </h2>
                <div className="absolute inset-0 flex items-center justify-center p-6 pt-16">
                  {/* White plate: product photos usually ship on white, so
                      frame them instead of letting the box float on navy.
                      El marco solo se dibuja si la foto carga: si el origen
                      falla, cae al ícono en vez de dejar una placa vacía. */}
                  <ProductImage
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 60vw"
                    className="object-contain p-3"
                    frameClassName="relative w-full max-w-[190px] aspect-square bg-white rounded-2xl overflow-hidden border border-accent/25 shadow-[0_18px_40px_-18px_rgba(10,20,40,0.8)] group-hover:scale-105 transition-transform duration-500"
                    fallback={
                      <Icon
                        size={72}
                        strokeWidth={1.1}
                        className="text-accent-light/70 group-hover:text-accent-light group-hover:scale-110 transition-all duration-500"
                      />
                    }
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-navy-deep/95 backdrop-blur-sm rounded-tl-xl flex items-center justify-center z-10 border-l border-t border-accent/15">
                  <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-10 h-10 md:w-12 md:h-12 bg-navy-light rounded-full flex items-center justify-center text-accent-light group-hover:bg-accent group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
