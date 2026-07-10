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
      .limit(3),
  ])

  const s = Object.fromEntries((settings || []).map(r => [r.key, r.value || '']))
  const title = s.hero_title || 'Tecnología para tu negocio y hogar'
  const subtitle = s.hero_subtitle || 'Los mejores equipos al mejor precio en Medellín'
  const waNumber = s.whatsapp_number || ''
  const waMsg = encodeURIComponent('Hola! Quiero información sobre sus productos.')
  const products = (featured || []) as Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'image_url'>[]

  return (
    <section className="relative bg-navy text-white overflow-hidden">
      {/* Layered backdrop: spotlight + circuit dot grid (decorative only) */}
      <div className="absolute inset-0 hero-spotlight pointer-events-none" aria-hidden />
      <div className="absolute inset-0 circuit-grid pointer-events-none" aria-hidden />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 py-16 md:py-24">
        <div>
          <span className="inline-flex items-center gap-2 bg-navy-light/60 border border-accent/30 text-accent-light text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 animate-fade-in-up backdrop-blur-sm">
            Tecnología con garantía en Medellín
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight animate-fade-in-up delay-100">
            <span className="text-chrome">{title}</span>
          </h1>
          <p className="text-[#9fb1d1] mt-5 text-lg leading-relaxed max-w-md animate-fade-in-up delay-200">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-4 mt-8 animate-fade-in-up delay-300">
            <Link
              href="/productos"
              className="btn-electric text-white font-bold px-7 py-3 rounded-lg text-base"
            >
              Ver catálogo
            </Link>
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-tech text-white font-bold px-7 py-3 rounded-lg text-base"
              >
                Hablar con un asesor
              </a>
            )}
          </div>

          <div className="mt-10 animate-fade-in-up delay-400">
            <div className="divider-glow mb-8" />
            <div className="flex gap-10">
              <div>
                <div className="text-2xl font-extrabold text-accent-glow">500+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Clientes atendidos</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-accent-glow">12</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Meses de garantía</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-accent-glow">24h</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Soporte técnico</div>
              </div>
            </div>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="hidden md:flex flex-col gap-4 animate-fade-in-up delay-200">
            {products.map((p, i) => (
              <Link
                key={p.id}
                href={`/producto/${p.slug}`}
                className={`card-tech flex items-center gap-4 rounded-xl p-4 ${
                  i === 1 ? 'ml-10' : i === 2 ? 'ml-20' : ''
                }`}
              >
                <div className="relative w-20 h-20 shrink-0 bg-navy-deep rounded-lg overflow-hidden border border-border-subtle">
                  <Image
                    src={p.image_url!}
                    alt={p.name}
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-100 truncate">{p.name}</p>
                  <p className="text-accent-light font-bold mt-1">{formatCOP(p.price)}</p>
                </div>
              </Link>
            ))}
            <Link
              href="/productos"
              className="text-sm text-[#9fb1d1] hover:text-accent-light transition-colors self-end mr-2"
            >
              Explorar todo el catálogo
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex justify-center items-center animate-fade-in-up delay-200">
            <div className="card-tech relative w-full aspect-[16/10] rounded-2xl overflow-hidden">
              <Image
                src="/logo.png"
                alt="ECOMPUTO - Tecnología, Confianza, Soluciones"
                fill
                sizes="(min-width: 768px) 50vw, 0px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
