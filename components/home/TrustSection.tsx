import { ShieldCheck, Headphones, ReceiptText, Truck } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

const items = [
  {
    icon: ShieldCheck,
    title: 'Garantía extendida',
    desc: '12 meses en todos los equipos, sin letra pequeña.',
  },
  {
    icon: Headphones,
    title: 'Soporte técnico real',
    desc: 'Asesoría antes y después de la compra, por WhatsApp o teléfono.',
  },
  {
    icon: ReceiptText,
    title: 'Facturación empresarial',
    desc: 'Compras a nombre de tu empresa, con factura electrónica.',
  },
  {
    icon: Truck,
    title: 'Envíos a toda Colombia',
    desc: 'Entrega asegurada y rastreable desde Medellín.',
  },
]

export function TrustSection() {
  return (
    <section className="bg-navy-deep py-10 md:py-14 px-4">
      <div className="divider-glow mb-10 -mt-10 md:mb-14 md:-mt-14" />
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06}>
            <div className="w-10 h-10 rounded-lg bg-navy-light border border-accent/25 mb-3 flex items-center justify-center shadow-[0_0_16px_-6px_rgba(125,184,232,0.3)]">
              <item.icon size={20} className="text-accent-light" strokeWidth={1.75} />
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
            <p className="text-[#7c8db0] text-xs leading-relaxed">{item.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
