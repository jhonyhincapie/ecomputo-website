import { MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Reveal } from '@/components/ui/Reveal'

export async function WhatsAppBanner() {
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'whatsapp_number')
    .single()

  const number = data?.value || ''
  const msg = encodeURIComponent('Hola! Quiero información sobre sus productos.')

  return (
    <section className="relative bg-navy-deep py-12 md:py-16 px-4 text-white overflow-hidden">
      <div className="absolute inset-0 hero-spotlight pointer-events-none" aria-hidden />
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <Reveal className="md:col-span-7">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight max-w-[18ch]">
            <span className="text-chrome">¿No sabes cuál equipo elegir?</span>
          </h2>
          <p className="text-[#9fb1d1] mt-4 text-lg max-w-[44ch]">
            Cuéntanos qué necesitas y un asesor real te recomienda el equipo exacto para tu presupuesto.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-5 md:justify-self-end">
          {number ? (
            <a
              href={`https://wa.me/${number}?text=${msg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-electric inline-flex items-center gap-3 text-white font-bold px-8 py-4 rounded-lg text-lg"
            >
              <MessageCircle size={22} strokeWidth={1.75} />
              Hablar con un asesor
            </a>
          ) : (
            <p className="text-[#7c8db0] text-sm">Configura el número de WhatsApp en el panel admin.</p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
