'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Product } from '@/types'

interface Props {
  product: Product
  open: boolean
  onClose: () => void
}

export function QuotationModal({ product, open, onClose }: Props) {
  const [channel, setChannel] = useState<'email' | 'whatsapp'>('email')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        product_id: product.id,
        product_name: product.name,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        message: form.message || null,
        channel,
      }

      if (channel === 'whatsapp') {
        const res = await fetch('/api/cotizar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          // Open WhatsApp in new tab
          const settingsRes = await fetch('/api/settings/whatsapp-number')
          const { number } = await settingsRes.json()
          const msg = encodeURIComponent(
            `Hola! Me interesa cotizar: *${product.name}*\nNombre: ${form.name}\nTeléfono: ${form.phone}${form.message ? '\nMensaje: ' + form.message : ''}`
          )
          window.open(`https://wa.me/${number}?text=${msg}`, '_blank')
          setSent(true)
        }
      } else {
        const res = await fetch('/api/cotizar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) setSent(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSent(false)
    setForm({ name: '', email: '', phone: '', message: '' })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cotizar: {product.name}</DialogTitle>
        </DialogHeader>

        {sent ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">{channel === 'email' ? '📧' : '💬'}</div>
            <h3 className="font-bold text-lg text-navy">¡Solicitud enviada!</h3>
            <p className="text-gray-500 mt-2 text-sm">
              {channel === 'email'
                ? 'Te responderemos pronto a tu correo electrónico.'
                : 'Continúa la conversación en WhatsApp.'}
            </p>
            <button
              onClick={handleClose}
              className="mt-6 bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent-dark transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nombre completo *</Label>
              <Input
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <Label>Teléfono *</Label>
              <Input
                required
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="300 123 4567"
              />
            </div>
            <div>
              <Label>Mensaje (opcional)</Label>
              <Textarea
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                rows={3}
                placeholder="¿Alguna pregunta específica?"
              />
            </div>

            <div>
              <Label className="mb-2 block">¿Cómo quieres recibir la cotización?</Label>
              <div className="flex gap-6">
                {(['email', 'whatsapp'] as const).map(ch => (
                  <label key={ch} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={ch}
                      checked={channel === ch}
                      onChange={() => setChannel(ch)}
                      className="accent-accent"
                    />
                    <span className="text-sm">
                      {ch === 'email' ? '📧 Email' : '💬 WhatsApp'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
