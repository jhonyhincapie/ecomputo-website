'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Input } from '@/components/ui/input'
import { iconForSlug } from '@/lib/categoryIcons'
import type { Category } from '@/types'

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

/* Emoji stored in DB (used in selects); the public site renders the
   matching lucide icon via iconForSlug. Both infer from the name. */
const emojiRules: [string[], string][] = [
  [['portatil', 'laptop'], '💻'],
  [['computador', 'pc', 'torre', 'escritorio'], '🖥️'],
  [['celular', 'telefono', 'smartphone', 'tablet'], '📱'],
  [['audifono', 'auricular', 'diadema'], '🎧'],
  [['parlante', 'altavoz', 'sonido'], '🔊'],
  [['teclado'], '⌨️'],
  [['mouse', 'raton'], '🖱️'],
  [['impresora', 'multifuncional'], '🖨️'],
  [['camara', 'webcam'], '📷'],
  [['router', 'red', 'wifi'], '📶'],
  [['disco', 'memoria', 'usb', 'ssd'], '💾'],
  [['tv', 'televisor', 'pantalla', 'monitor'], '📺'],
  [['consola', 'videojuego', 'gamer', 'gaming'], '🎮'],
  [['cable', 'cargador', 'adaptador'], '🔌'],
  [['reloj', 'smartwatch'], '⌚'],
]

function emojiForName(name: string) {
  const n = slugify(name)
  for (const [keys, emoji] of emojiRules) {
    if (keys.some(k => n.includes(k))) return emoji
  }
  return '📦'
}

export default function CategoriasPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cats, setCats] = useState<Category[]>([])
  const [form, setForm] = useState({ name: '', order_index: '0' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    supabase
      .from('categories')
      .select('*')
      .order('order_index')
      .then(({ data }) => setCats((data as Category[]) || []))
  }, [status])

  const add = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    await supabase.from('categories').insert({
      name: form.name,
      slug: slugify(form.name),
      icon: emojiForName(form.name),
      order_index: parseInt(form.order_index) || 0,
    })
    const { data } = await supabase.from('categories').select('*').order('order_index')
    setCats((data as Category[]) || [])
    setForm({ name: '', order_index: '0' })
    setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría?')) return
    await supabase.from('categories').delete().eq('id', id)
    setCats(cats.filter(c => c.id !== id))
  }

  if (status === 'loading' || !session) return null

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-navy mb-6">Categorías</h1>

        {/* Add form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-navy mb-4">Agregar categoría</h2>
          <div className="flex gap-3 items-end flex-wrap">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ícono (automático)</label>
              {(() => {
                const Icon = iconForSlug(form.name || 'paquete')
                return (
                  <div className="w-11 h-10 rounded-lg bg-navy/5 border border-gray-300 flex items-center justify-center">
                    <Icon size={20} className="text-navy" strokeWidth={1.75} />
                  </div>
                )
              })()}
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-gray-500 mb-1 block">Nombre *</label>
              <Input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Impresoras"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                El ícono se elige solo según el nombre y la categoría aparece de inmediato en la página principal.
              </p>
            </div>
            <div className="w-24">
              <label className="text-xs text-gray-500 mb-1 block">Orden</label>
              <Input
                type="number"
                value={form.order_index}
                onChange={e => setForm({ ...form, order_index: e.target.value })}
              />
            </div>
            <button
              onClick={add}
              disabled={saving}
              className="bg-navy hover:bg-navy-light text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-60"
            >
              {saving ? '...' : 'Agregar'}
            </button>
          </div>
        </div>

        {/* Categories list */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {cats.map((c, i) => (
            <div
              key={c.id}
              className={`flex items-center gap-4 px-4 py-3 ${i < cats.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              {(() => {
                const Icon = iconForSlug(`${c.slug} ${c.name}`)
                return (
                  <span className="w-10 h-10 rounded-lg bg-navy/5 border border-gray-200 flex items-center justify-center">
                    <Icon size={20} className="text-navy" strokeWidth={1.75} />
                  </span>
                )
              })()}
              <div className="flex-1">
                <p className="font-medium text-gray-800">{c.name}</p>
                <p className="text-xs text-gray-400">/{c.slug} · orden {c.order_index}</p>
              </div>
              <button
                onClick={() => remove(c.id)}
                className="text-gray-300 hover:text-red-500 text-sm transition-colors"
              >
                Eliminar
              </button>
            </div>
          ))}
          {cats.length === 0 && (
            <p className="text-center text-gray-400 py-8">No hay categorías.</p>
          )}
        </div>
      </main>
    </div>
  )
}
