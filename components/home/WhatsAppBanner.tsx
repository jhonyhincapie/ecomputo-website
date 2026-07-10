import { supabase } from '@/lib/supabase'

export async function WhatsAppBanner() {
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'whatsapp_number')
    .single()

  const number = data?.value || ''
  const msg = encodeURIComponent('Hola! Quiero información sobre sus productos.')

  return (
    <section className="bg-navy-deep py-16 px-4 text-center text-white border-t border-navy-light">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">¿Necesitas asesoría personalizada?</h2>
        <p className="text-gray-400 mb-8 text-lg">
          Chatea con nosotros por WhatsApp y te ayudamos a elegir el mejor equipo para tus necesidades
        </p>
        {number ? (
          <a
            href={`https://wa.me/${number}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-accent hover:bg-accent-dark text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors"
          >
            Chatear por WhatsApp
          </a>
        ) : (
          <p className="text-gray-500 text-sm">Configura el número de WhatsApp en el panel admin.</p>
        )}
      </div>
    </section>
  )
}
