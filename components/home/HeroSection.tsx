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
    <section className="bg-linear-to-br from-navy to-navy-light text-white py-20 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-4">
            TECNOLOGÍA • SOLUCIONES • FUTURO
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            {title}
          </h1>
          <p className="text-gray-300 mt-5 text-lg leading-relaxed">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href="/productos"
              className="bg-gold hover:bg-gold-dark text-navy font-bold px-7 py-3 rounded-lg transition-colors text-base"
            >
              Ver catálogo
            </Link>
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-7 py-3 rounded-lg transition-colors text-base"
              >
                💬 WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="hidden md:flex justify-center items-center">
          <div className="text-[160px] select-none drop-shadow-2xl">💻</div>
        </div>
      </div>
    </section>
  )
}
