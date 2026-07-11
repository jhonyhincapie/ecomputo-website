'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Mail } from 'lucide-react'

interface Props {
  id: string
  status: string
}

export function QuotationActions({ id, status }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState<'status' | 'resend' | null>(null)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const call = async (payload: Record<string, string>, kind: 'status' | 'resend') => {
    setBusy(kind)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...payload }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMsg({ ok: false, text: data.error || 'Error inesperado' })
        return
      }
      if (kind === 'resend') setMsg({ ok: true, text: 'Correo de seguimiento enviado' })
      router.refresh()
    } catch {
      setMsg({ ok: false, text: 'Sin conexión con el servidor' })
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="flex flex-col gap-1.5 min-w-[170px]">
      <div className="flex items-center gap-2">
        <select
          defaultValue={status}
          disabled={busy !== null}
          onChange={e => call({ action: 'status', status: e.target.value }, 'status')}
          className="text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-navy disabled:opacity-50"
        >
          <option value="pending">Pendiente</option>
          <option value="replied">Respondida</option>
          <option value="closed">Cerrada</option>
        </select>
        <button
          onClick={() => call({ action: 'resend' }, 'resend')}
          disabled={busy !== null}
          title="Enviar correo de seguimiento al cliente"
          className="flex items-center gap-1 text-xs font-medium text-navy border border-navy/30 hover:bg-navy hover:text-white rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {busy === 'resend' ? <Loader2 size={13} className="animate-spin" /> : <Mail size={13} />}
          Seguimiento
        </button>
      </div>
      {msg && (
        <p className={`text-[11px] leading-snug ${msg.ok ? 'text-green-600' : 'text-red-500'}`}>
          {msg.text}
        </p>
      )}
    </div>
  )
}
