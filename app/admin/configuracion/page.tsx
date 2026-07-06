'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const SETTINGS_KEYS = [
  'whatsapp_number',
  'email_to',
  'hero_title',
  'hero_subtitle',
  'bot_welcome',
]

const LABELS: Record<string, string> = {
  whatsapp_number: 'Número WhatsApp (con código de país, sin +)',
  email_to: 'Email destino de cotizaciones',
  hero_title: 'Título del Hero (página principal)',
  hero_subtitle: 'Subtítulo del Hero',
  bot_welcome: 'Mensaje de bienvenida del bot WhatsApp',
}

const PLACEHOLDERS: Record<string, string> = {
  whatsapp_number: '573001234567',
  email_to: 'ventas@ecomputo.com',
  hero_title: 'Tecnología para tu negocio y hogar',
  hero_subtitle: 'Los mejores equipos al mejor precio en Medellín',
  bot_welcome: 'Hola! Bienvenido a ECOMPUTO...',
}

const TEXTAREA_KEYS = ['bot_welcome']

export default function ConfiguracionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    supabase
      .from('settings')
      .select('key, value')
      .in('key', SETTINGS_KEYS)
      .then(({ data }) => {
        setSettings(Object.fromEntries((data || []).map(r => [r.key, r.value || ''])))
      })
  }, [status])

  const save = async () => {
    setSaving(true)
    await Promise.all(
      SETTINGS_KEYS.map(k =>
        supabase.from('settings').upsert({
          key: k,
          value: settings[k] || '',
          updated_at: new Date().toISOString(),
        })
      )
    )
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    setSaving(false)
  }

  if (status === 'loading' || !session) return null

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-navy mb-2">Configuración</h1>
        <p className="text-gray-500 text-sm mb-8">
          Ajusta los textos y datos de contacto del sitio sin tocar el código.
        </p>

        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl space-y-6">
          {SETTINGS_KEYS.map(key => (
            <div key={key}>
              <Label>{LABELS[key]}</Label>
              {TEXTAREA_KEYS.includes(key) ? (
                <Textarea
                  rows={5}
                  value={settings[key] || ''}
                  onChange={e => setSettings({ ...settings, [key]: e.target.value })}
                  placeholder={PLACEHOLDERS[key]}
                />
              ) : (
                <Input
                  value={settings[key] || ''}
                  onChange={e => setSettings({ ...settings, [key]: e.target.value })}
                  placeholder={PLACEHOLDERS[key]}
                />
              )}
            </div>
          ))}

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={save}
              disabled={saving}
              className="bg-navy hover:bg-navy-light text-white font-bold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            {saved && (
              <span className="text-green-600 text-sm font-medium">✓ Cambios guardados</span>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
