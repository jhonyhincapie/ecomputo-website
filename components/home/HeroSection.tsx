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
    <section className="bg-navy text-white py-16 md:py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 bg-navy-light border border-border-subtle text-accent-light text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 animate-fade-in-up">
            Tecnología con garantía en Medellín
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight animate-fade-in-up delay-100">
            {title}
          </h1>
          <p className="text-gray-400 mt-5 text-lg leading-relaxed max-w-md animate-fade-in-up delay-200">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-4 mt-8 animate-fade-in-up delay-300">
            <Link
              href="/productos"
              className="bg-accent hover:bg-accent-dark active:scale-[0.98] text-white font-bold px-7 py-3 rounded-lg transition-all text-base"
            >
              Ver catálogo
            </Link>
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border-subtle hover:border-accent active:scale-[0.98] text-white font-bold px-7 py-3 rounded-lg transition-all text-base"
              >
                Hablar con un asesor
              </a>
            )}
          </div>

          <div className="flex gap-8 mt-10 pt-8 border-t border-navy-light animate-fade-in-up delay-400">
            <div>
              <div className="text-2xl font-extrabold text-white">500+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Clientes atendidos</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">12</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Meses de garantía</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">24h</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Soporte técnico</div>
            </div>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="hidden md:flex flex-col gap-4 animate-fade-in-up delay-200">
            {products.map((p, i) => (
              <Link
                key={p.id}
                href={`/producto/${p.slug}`}
                className={`flex items-center gap-4 bg-navy-light/60 border border-border-subtle hover:border-accent rounded-xl p-4 transition-colors ${
                  i === 1 ? 'ml-10' : i === 2 ? 'ml-20' : ''
                }`}
              >
                <div className="relative w-20 h-20 shrink-0 bg-navy rounded-lg overflow-hidden">
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
              className="text-sm text-gray-400 hover:text-accent-light transition-colors self-end mr-2"
            >
              Explorar todo el catálogo
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-full aspect-[4/3] bg-navy-light/40 border border-border-subtle rounded-xl flex flex-col items-center justify-center gap-4">
              <Image src="/logo.png" alt="ECOMPUTO" width={96} height={96} className="object-contain opacity-90" />
              <p className="text-gray-400 text-sm max-w-[24ch] text-center leading-relaxed">
                Computadores, portátiles, celulares y accesorios con garantía.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
