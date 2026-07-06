'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import type { Category, Product } from '@/types'

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

interface Props {
  categories: Category[]
  product?: Product
}

export function ProductForm({ categories, product }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    category_id: product?.category_id || '',
    price: product?.price?.toString() || '',
    description: product?.description || '',
    image_url: product?.image_url || '',
    is_featured: product?.is_featured ?? false,
    is_active: product?.is_active ?? true,
  })
  const [specs, setSpecs] = useState<{ key: string; val: string }[]>(
    Object.entries(product?.specs || {}).map(([key, val]) => ({ key, val: val as string }))
  )

  const addSpec = () => setSpecs([...specs, { key: '', val: '' }])
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i))
  const updateSpec = (i: number, field: 'key' | 'val', value: string) =>
    setSpecs(specs.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        category_id: form.category_id || null,
        price: parseFloat(form.price),
        description: form.description || null,
        image_url: form.image_url || null,
        is_featured: form.is_featured,
        is_active: form.is_active,
        specs: Object.fromEntries(
          specs.filter(s => s.key.trim()).map(s => [s.key.trim(), s.val])
        ),
      }

      if (product) {
        await supabase.from('products').update(payload).eq('id', product.id)
      } else {
        await supabase.from('products').insert(payload)
      }

      router.push('/admin/productos')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white rounded-xl border border-gray-200 p-6">
      <div>
        <Label>Nombre del producto *</Label>
        <Input
          required
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
          placeholder="Ej: Portátil HP 15 Core i5 16GB"
        />
      </div>

      <div>
        <Label>Slug (URL)</Label>
        <Input
          value={form.slug}
          onChange={e => setForm({ ...form, slug: e.target.value })}
          placeholder="portatil-hp-15-core-i5"
        />
        <p className="text-xs text-gray-400 mt-1">Se usa en la URL del producto. Se genera automáticamente.</p>
      </div>

      <div>
        <Label>Categoría</Label>
        <select
          value={form.category_id}
          onChange={e => setForm({ ...form, category_id: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
        >
          <option value="">Sin categoría</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Precio (COP) *</Label>
        <Input
          required
          type="number"
          min="0"
          step="1000"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          placeholder="1500000"
        />
      </div>

      <div>
        <Label>Descripción</Label>
        <Textarea
          rows={4}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Describe el producto..."
        />
      </div>

      <div>
        <Label>URL de imagen</Label>
        <Input
          value={form.image_url}
          onChange={e => setForm({ ...form, image_url: e.target.value })}
          placeholder="https://..."
          type="url"
        />
        <p className="text-xs text-gray-400 mt-1">Pega la URL de la imagen (Supabase Storage, CDN, etc.)</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="mb-0">Especificaciones técnicas</Label>
          <button
            type="button"
            onClick={addSpec}
            className="text-navy text-sm font-medium hover:underline"
          >
            + Agregar
          </button>
        </div>
        <div className="space-y-2">
          {specs.map((s, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="Ej: RAM"
                value={s.key}
                onChange={e => updateSpec(i, 'key', e.target.value)}
                className="w-36"
              />
              <Input
                placeholder="Ej: 16GB DDR4"
                value={s.val}
                onChange={e => updateSpec(i, 'val', e.target.value)}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeSpec(i)}
                className="text-gray-400 hover:text-red-500 px-2 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-6 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={e => setForm({ ...form, is_featured: e.target.checked })}
            className="accent-accent w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700">⭐ Producto destacado (aparece en homepage)</span>
        </label>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={e => setForm({ ...form, is_active: e.target.checked })}
            className="accent-navy w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700">Activo (visible en el catálogo)</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-navy hover:bg-navy-light text-white font-bold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60"
        >
          {loading ? 'Guardando...' : product ? 'Guardar cambios' : 'Crear producto'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/productos')}
          className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2.5 rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
