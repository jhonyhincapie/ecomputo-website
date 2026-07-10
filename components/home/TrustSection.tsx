import { ShieldCheck, Headphones, ReceiptText, Truck } from 'lucide-react'

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
    <section className="bg-navy-deep py-14 px-4 border-t border-navy-light">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map(item => (
          <div key={item.title}>
            <div className="w-10 h-10 rounded-lg bg-navy-light border border-border-subtle mb-3 flex items-center justify-center">
              <item.icon size={20} className="text-accent-light" strokeWidth={1.75} />
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
