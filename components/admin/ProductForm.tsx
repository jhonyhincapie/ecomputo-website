'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
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

function formatCOP(n: number) {
  if (!n || isNaN(n)) return '$ —'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)
}

interface Props {
  categories: Category[]
  product?: Product
}

export function ProductForm({ categories, product }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    category_id: product?.category_id || '',
    price: product?.price?.toString() || '',
    description: product?.description || '',
    image_url: product?.image_url || '',
    stock: product?.stock?.toString() ?? '',
    rating: product?.rating?.toString() ?? '',
    is_featured: product?.is_featured ?? false,
    is_active: product?.is_active ?? true,
  })
  const [specs, setSpecs] = useState<{ key: string; val: string }[]>(
    Object.entries(product?.specs || {}).map(([key, val]) => ({ key, val: val as string }))
  )
  const [gallery, setGallery] = useState<string[]>(product?.images || [])
  const [features, setFeatures] = useState<string[]>(product?.features || [])
  const [colors, setColors] = useState<string[]>(product?.colors || [])

  const addSpec = () => setSpecs([...specs, { key: '', val: '' }])
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i))
  const updateSpec = (i: number, field: 'key' | 'val', value: string) =>
    setSpecs(specs.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)))

  /* Generic list helpers for features / colors */
  const listOps = (list: string[], set: (v: string[]) => void) => ({
    add: () => set([...list, '']),
    remove: (i: number) => set(list.filter((_, idx) => idx !== i)),
    update: (i: number, value: string) => set(list.map((v, idx) => (idx === i ? value : v))),
  })
  const featOps = listOps(features, setFeatures)
  const colorOps = listOps(colors, setColors)

  const uploadImage = async (file: File): Promise<string | null> => {
    setError('')
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen (JPG, PNG o WebP).')
      return null
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen supera 5MB. Usa una más liviana.')
      return null
    }
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${slugify(form.name || 'producto')}.${ext}`
    const { error: upErr } = await supabase.storage
      .from('product-images')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (upErr) {
      setError(`No se pudo subir la imagen: ${upErr.message}`)
      return null
    }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const url = await uploadImage(file)
      if (url) setForm(f => ({ ...f, image_url: url }))
    } finally {
      setUploading(false)
    }
  }

  const handleGalleryUpload = async (files: File[]) => {
    setUploadingGallery(true)
    try {
      for (const file of files) {
        const url = await uploadImage(file)
        if (url) setGallery(g => [...g, url])
      }
    } finally {
      setUploadingGallery(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        name: form.name.trim(),
        /* Whatever lands in the slug field gets sanitized: URLs never
           break by typos (spaces, uppercase, accents) */
        slug: slugify(form.slug.trim() || form.name),
        category_id: form.category_id || null,
        price: parseFloat(form.price),
        description: form.description || null,
        image_url: form.image_url || null,
        images: gallery,
        features: features.map(f => f.trim()).filter(Boolean),
        colors: colors.map(c => c.trim()).filter(Boolean),
        stock: form.stock === '' ? null : Math.max(0, parseInt(form.stock, 10) || 0),
        rating: form.rating === '' ? null : Math.min(5, Math.max(0, parseFloat(form.rating) || 0)),
        is_featured: form.is_featured,
        is_active: form.is_active,
        specs: Object.fromEntries(
          specs.filter(s => s.key.trim()).map(s => [s.key.trim(), s.val])
        ),
      }

      const { error: dbErr } = product
        ? await supabase.from('products').update(payload).eq('id', product.id)
        : await supabase.from('products').insert(payload)

      if (dbErr) {
        setError(`No se pudo guardar: ${dbErr.message}`)
        return
      }

      router.push('/admin/productos')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const previewCategory = categories.find(c => c.id === form.category_id)

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start">
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl bg-white rounded-xl border border-gray-200 p-6">
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
          <p className="text-xs text-gray-400 mt-1">
            Dirección del producto. Se genera sola desde el nombre y se corrige automáticamente al guardar — no escribas especificaciones aquí.
          </p>
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
                {c.name}
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
          <Label>Foto del producto</Label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) handleUpload(f)
              e.target.value = ''
            }}
          />
          {form.image_url ? (
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-28 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                <Image src={form.image_url} alt="Foto del producto" fill sizes="112px" className="object-contain p-1" />
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="block text-sm text-navy font-medium hover:underline disabled:opacity-50"
                >
                  Cambiar foto
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image_url: '' })}
                  className="flex items-center gap-1 text-sm text-red-500 hover:underline"
                >
                  <Trash2 size={14} /> Quitar
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-gray-300 hover:border-navy/50 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:text-navy transition-colors disabled:opacity-50"
            >
              {uploading ? <Loader2 size={28} className="animate-spin" /> : <ImagePlus size={28} />}
              <span className="text-sm font-medium">
                {uploading ? 'Subiendo...' : 'Haz clic para subir la foto (JPG/PNG, máx 5MB)'}
              </span>
            </button>
          )}
          <p className="text-xs text-gray-400 mt-2">
            También puedes pegar una URL externa:
          </p>
          <Input
            value={form.image_url}
            onChange={e => setForm({ ...form, image_url: e.target.value })}
            placeholder="https://..."
            className="mt-1"
          />
        </div>

        <div>
          <Label>Galería de fotos adicionales</Label>
          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => {
              const files = Array.from(e.target.files || [])
              if (files.length) handleGalleryUpload(files)
              e.target.value = ''
            }}
          />
          <div className="flex flex-wrap gap-3">
            {gallery.map((img, i) => (
              <div key={img + i} className="relative w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden group">
                <Image src={img} alt={`Foto ${i + 2}`} fill sizes="80px" className="object-contain p-1" />
                <button
                  type="button"
                  onClick={() => setGallery(g => g.filter((_, idx) => idx !== i))}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Quitar foto"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              disabled={uploadingGallery}
              className="w-20 h-20 border-2 border-dashed border-gray-300 hover:border-navy/50 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-navy transition-colors disabled:opacity-50"
            >
              {uploadingGallery ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            La foto principal va arriba; estas se muestran como miniaturas en la página del producto.
          </p>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Stock (unidades)</Label>
            <Input
              type="number"
              min="0"
              value={form.stock}
              onChange={e => setForm({ ...form, stock: e.target.value })}
              placeholder="Vacío = disponible"
            />
            <p className="text-xs text-gray-400 mt-1">
              Vacío = disponible sin control. 1-5 muestra &ldquo;Pocas unidades&rdquo;, 0 muestra &ldquo;Agotado&rdquo;.
            </p>
          </div>
          <div>
            <Label>Calificación (0 a 5)</Label>
            <Input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={e => setForm({ ...form, rating: e.target.value })}
              placeholder="Ej: 4.5"
            />
            <p className="text-xs text-gray-400 mt-1">
              Opcional. Se muestra con estrellas en la ficha del producto.
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="mb-0">Características destacadas</Label>
            <button type="button" onClick={featOps.add} className="text-navy text-sm font-medium hover:underline">
              + Agregar
            </button>
          </div>
          <div className="space-y-2">
            {features.map((f, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Ej: Pantalla OLED de 14 pulgadas"
                  value={f}
                  onChange={e => featOps.update(i, e.target.value)}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => featOps.remove(i)}
                  className="text-gray-400 hover:text-red-500 px-2 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            {features.length === 0 && (
              <p className="text-xs text-gray-400">Se muestran con checkmarks en la ficha del producto.</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="mb-0">Colores disponibles</Label>
            <button type="button" onClick={colorOps.add} className="text-navy text-sm font-medium hover:underline">
              + Agregar
            </button>
          </div>
          <div className="space-y-2">
            {colors.map((c, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Ej: Gris grafito"
                  value={c}
                  onChange={e => colorOps.update(i, e.target.value)}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => colorOps.remove(i)}
                  className="text-gray-400 hover:text-red-500 px-2 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            {colors.length === 0 && (
              <p className="text-xs text-gray-400">El cliente elige el color y viaja en su solicitud de cotización.</p>
            )}
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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || uploading}
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

      {/* Live preview: the ad card exactly as it will render on the site */}
      <aside className="w-full max-w-sm xl:sticky xl:top-8">
        <p className="text-sm font-semibold text-gray-500 mb-3">
          Vista previa en la página
        </p>
        <div className="rounded-2xl p-6" style={{ background: '#1e3459' }}>
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              background: 'linear-gradient(180deg, rgba(43,68,112,0.7) 0%, rgba(37,62,102,0.9) 100%)',
              borderColor: 'rgba(125,184,232,0.18)',
            }}
          >
            <div className="relative aspect-[4/3]" style={{ background: '#172a48' }}>
              {form.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.image_url}
                  alt="Vista previa"
                  className="absolute inset-0 w-full h-full object-contain p-3"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm" style={{ color: '#7d95c1' }}>
                  Sube la foto para verla aquí
                </div>
              )}
              {form.is_featured && (
                <span
                  className="absolute top-2 left-2 text-[11px] font-bold text-white px-2 py-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #4a8fd4, #7db8e8)' }}
                >
                  NUEVO
                </span>
              )}
            </div>
            <div className="p-4">
              {previewCategory && (
                <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: '#7db8e8' }}>
                  {previewCategory.name}
                </p>
              )}
              <p className="font-bold text-white leading-snug">
                {form.name || 'Nombre del producto'}
              </p>
              <p className="font-bold mt-2" style={{ color: '#7db8e8' }}>
                {formatCOP(parseFloat(form.price))}
              </p>
              {form.description && (
                <p className="text-xs mt-2 leading-relaxed line-clamp-2" style={{ color: '#a7b6d8' }}>
                  {form.description}
                </p>
              )}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3 leading-relaxed">
          Así se verá la tarjeta en el catálogo y la página principal. La página del producto usa la misma foto con las especificaciones.
        </p>
      </aside>
    </div>
  )
}
