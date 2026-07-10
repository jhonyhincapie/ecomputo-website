import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'

function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)
}

export async function HeroSection() {
  const [{ data: settings }, { data: featured }] = await Promise.all([
    supabase
      .from('settings')
      .select('key, value')
      .in('key', ['hero_title', 'hero_subtitle', 'whatsapp_number']),
    supabase
      .from('products')
      .select('id, name, slug, price, image_url')
      .eq('is_featured', true)
      .eq('is_active', true)
      .not('image_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(2),
  ])

  const s = Object.fromEntries((settings || []).map(r => [r.key, r.value || '']))
  const title = s.hero_title || 'Tecnología para tu negocio y hogar'
  const subtitle = s.hero_subtitle || 'Los mejores equipos al mejor precio en Medellín'
  const waNumber = s.whatsapp_number || ''
  const waMsg = encodeURIComponent('Hola! Quiero información sobre sus productos.')
  const products = (featured || []) as Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'image_url'>[]

  return (
    <section className="relative bg-navy text-white overflow-hidden">
      <div className="absolute inset-0 hero-spotlight pointer-events-none" aria-hidden />
      <div className="absolute inset-0 circuit-grid pointer-events-none" aria-hidden />

      {/* Oversized ghost type: editorial depth layer, off-canvas right */}
      <div
        className="ghost-type absolute -right-16 top-8 font-heading font-extrabold text-[11rem] leading-none tracking-tighter hidden lg:block"
        aria-hidden
      >
        ECOMPUTO
      </div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center px-4 pt-14 pb-20 md:pt-20 md:pb-28">
        {/* Copy block: intentionally off-center, takes 7/12 */}
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 bg-navy-light/60 border border-accent/30 text-accent-light text-xs font-semibold px-3.5 py-1.5 rounded-full mb-7 backdrop-blur-sm animate-fade-in-up">
            Tecnología con garantía en Medellín
          </span>
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[1.02] tracking-tighter animate-fade-in-up delay-100 max-w-[13ch]">
            <span className="text-chrome">{title}</span>
          </h1>
          <p className="text-[#9fb1d1] mt-6 text-lg leading-relaxed max-w-[38ch] animate-fade-in-up delay-200">
            {subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-9 animate-fade-in-up delay-300">
            <Link
              href="/productos"
              className="btn-electric text-white font-bold px-8 py-3.5 rounded-lg text-base"
            >
              Ver catálogo
            </Link>
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-tech text-white font-bold px-8 py-3.5 rounded-lg text-base"
              >
                Hablar con un asesor
              </a>
            )}
          </div>
        </div>

        {/* Visual block 5/12: brand art with floating product cards overlapping it */}
        <div className="relative lg:col-span-5 hidden md:block animate-fade-in-up delay-200">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-accent/20 shadow-[0_0_80px_-20px_rgba(30,136,255,0.45)] rotate-[1.5deg]">
            <Image
              src="/logo.png"
              alt="ECOMPUTO - Tecnología, Confianza, Soluciones"
              fill
              sizes="(min-width: 1024px) 40vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          {products[0] && (
            <Link
              href={`/producto/${products[0].slug}`}
              className="card-tech animate-float absolute -left-10 -bottom-8 flex items-center gap-3 rounded-xl p-3.5 pr-6 backdrop-blur-md -rotate-2 max-w-[260px]"
            >
              <div className="relative w-14 h-14 shrink-0 bg-navy-deep rounded-lg overflow-hidden border border-border-subtle">
                <Image src={products[0].image_url!} alt={products[0].name} fill sizes="56px" className="object-contain p-1.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-100 truncate">{products[0].name}</p>
                <p className="text-accent-light font-bold text-sm mt-0.5">{formatCOP(products[0].price)}</p>
              </div>
            </Link>
          )}

          {products[1] && (
            <Link
              href={`/producto/${products[1].slug}`}
              className="card-tech animate-float-2 absolute -right-4 -top-8 flex items-center gap-3 rounded-xl p-3.5 pr-6 backdrop-blur-md rotate-2 max-w-[240px]"
            >
              <div className="relative w-12 h-12 shrink-0 bg-navy-deep rounded-lg overflow-hidden border border-border-subtle">
                <Image src={products[1].image_url!} alt={products[1].name} fill sizes="48px" className="object-contain p-1.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-100 truncate">{products[1].name}</p>
                <p className="text-accent-light font-bold text-sm mt-0.5">{formatCOP(products[1].price)}</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Trust stats: full-width strip under the hero grid, mono numbers */}
      <div className="relative border-t border-accent/10 bg-navy-deep/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap gap-x-14 gap-y-4">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-accent-glow tracking-tight">500+</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Clientes atendidos</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-accent-glow tracking-tight">12</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Meses de garantía</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-accent-glow tracking-tight">24h</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Soporte técnico</span>
          </div>
        </div>
      </div>
    </section>
  )
}
