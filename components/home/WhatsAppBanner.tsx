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
    <section className="relative bg-navy-deep py-16 px-4 text-center text-white overflow-hidden">
      <div className="absolute inset-0 hero-spotlight pointer-events-none" aria-hidden />
      <Reveal className="relative max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-chrome">¿Necesitas asesoría personalizada?</span>
        </h2>
        <p className="text-[#9fb1d1] mb-8 text-lg">
          Chatea con nosotros por WhatsApp y te ayudamos a elegir el mejor equipo para tus necesidades
        </p>
        {number ? (
          <a
            href={`https://wa.me/${number}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-electric inline-block text-white font-bold px-8 py-4 rounded-lg text-lg"
          >
            Chatear por WhatsApp
          </a>
        ) : (
          <p className="text-[#7c8db0] text-sm">Configura el número de WhatsApp en el panel admin.</p>
        )}
      </Reveal>
    </section>
  )
}
