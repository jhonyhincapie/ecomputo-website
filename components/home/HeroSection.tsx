import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export async function HeroSection() {
  const { data: settings } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['hero_title', 'hero_subtitle', 'whatsapp_number'])

  const s = Object.fromEntries((settings || []).map(r => [r.key, r.value || '']))
  const title = s.hero_title || 'Tecnología para tu negocio y hogar'
  const subtitle = s.hero_subtitle || 'Los mejores equipos al mejor precio en Medellín'
  const waNumber = s.whatsapp_number || ''
  const waMsg = encodeURIComponent('Hola! Quiero información sobre sus productos.')

  return (
    <section className="bg-navy text-white py-20 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 bg-navy-light border border-border-subtle text-accent-light text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
            ● Tecnología · Confianza · Soluciones
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            {title}
          </h1>
          <p className="text-gray-400 mt-5 text-lg leading-relaxed max-w-md">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href="/productos"
              className="bg-accent hover:bg-accent-dark text-white font-bold px-7 py-3 rounded-lg transition-colors text-base"
            >
              Ver catálogo
            </Link>
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border-subtle hover:border-accent text-white font-bold px-7 py-3 rounded-lg transition-colors text-base"
              >
                Hablar con un asesor
              </a>
            )}
          </div>

          <div className="flex gap-8 mt-10 pt-8 border-t border-navy-light">
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

        <div className="hidden md:flex justify-center items-center">
          <div className="w-full aspect-[4/3] bg-navy-light border border-border-subtle rounded-xl flex items-center justify-center text-muted-foreground text-sm">
            Foto de equipos / catálogo
          </div>
        </div>
      </div>
    </section>
  )
}
