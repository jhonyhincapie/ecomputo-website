'use client'
import { useState } from 'react'
import { Mail, MessageCircle, CheckCircle2 } from 'lucide-react'
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
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
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

      const res = await fetch('/api/cotizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        setError('No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.')
        return
      }

      if (channel === 'whatsapp') {
        const settingsRes = await fetch('/api/settings/whatsapp-number')
        const { number } = await settingsRes.json()
        const msg = encodeURIComponent(
          `Hola! Me interesa cotizar: *${product.name}*\nNombre: ${form.name}\nTeléfono: ${form.phone}${form.message ? '\nMensaje: ' + form.message : ''}`
        )
        window.open(`https://wa.me/${number}?text=${msg}`, '_blank')
      }
      setSent(true)
    } catch {
      setError('Error de conexión. Revisa tu internet e intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSent(false)
    setError('')
    setForm({ name: '', email: '', phone: '', message: '' })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-[#0c1a33] border border-accent/25 shadow-[0_0_60px_-12px_rgba(30,136,255,0.4)]">
        <DialogHeader>
          <DialogTitle className="text-white">Cotizar: {product.name}</DialogTitle>
        </DialogHeader>

        {sent ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="mx-auto mb-4 text-accent" strokeWidth={1.5} />
            <h3 className="font-bold text-lg text-white">¡Solicitud enviada!</h3>
            <p className="text-[#9fb1d1] mt-2 text-sm">
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
              <Label className="text-gray-200">Nombre completo *</Label>
              <Input
                className="bg-navy-deep/70 border-border-subtle text-white placeholder:text-[#5a6b8f] focus:ring-accent"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <Label className="text-gray-200">Email *</Label>
              <Input
                className="bg-navy-deep/70 border-border-subtle text-white placeholder:text-[#5a6b8f] focus:ring-accent"
                required
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <Label className="text-gray-200">Teléfono *</Label>
              <Input
                className="bg-navy-deep/70 border-border-subtle text-white placeholder:text-[#5a6b8f] focus:ring-accent"
                required
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="300 123 4567"
              />
            </div>
            <div>
              <Label className="text-gray-200">Mensaje (opcional)</Label>
              <Textarea
                className="bg-navy-deep/70 border-border-subtle text-white placeholder:text-[#5a6b8f] focus:ring-accent"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                rows={3}
                placeholder="¿Alguna pregunta específica?"
              />
            </div>

            <div>
              <Label className="mb-2 block text-gray-200">¿Cómo quieres recibir la cotización?</Label>
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
                    <span className="text-sm inline-flex items-center gap-1.5 text-gray-200">
                      {ch === 'email' ? (
                        <><Mail size={15} strokeWidth={1.75} /> Email</>
                      ) : (
                        <><MessageCircle size={15} strokeWidth={1.75} /> WhatsApp</>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400" role="alert">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-electric w-full text-white font-semibold py-2.5 rounded-lg disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
