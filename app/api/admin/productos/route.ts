import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

/* Alta y edición de productos, en el servidor.

   El precio y las existencias se vuelven a validar aquí: lo que llega
   del navegador no es de fiar, aunque venga de nuestro propio panel. */

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function comoLista(v: unknown): string[] {
  return Array.isArray(v)
    ? v.map(x => String(x).trim()).filter(Boolean)
    : []
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const entrada = body?.product
  if (!entrada || typeof entrada !== 'object') {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }

  const name = typeof entrada.name === 'string' ? entrada.name.trim() : ''
  if (!name) {
    return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
  }

  const price = Number(entrada.price)
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: 'Precio inválido' }, { status: 400 })
  }

  const slug = slugify(entrada.slug || name)
  if (!slug) {
    return NextResponse.json(
      { error: 'El nombre no produce una URL válida' },
      { status: 400 }
    )
  }

  const stockCrudo = entrada.stock
  const stock =
    stockCrudo === null || stockCrudo === '' || stockCrudo === undefined
      ? null
      : Math.max(0, Number.parseInt(String(stockCrudo), 10) || 0)

  const ratingCrudo = entrada.rating
  const rating =
    ratingCrudo === null || ratingCrudo === '' || ratingCrudo === undefined
      ? null
      : Math.min(5, Math.max(0, Number(ratingCrudo) || 0))

  const specs =
    entrada.specs && typeof entrada.specs === 'object' && !Array.isArray(entrada.specs)
      ? Object.fromEntries(
          Object.entries(entrada.specs as Record<string, unknown>)
            .filter(([k]) => String(k).trim())
            .map(([k, v]) => [String(k).trim(), String(v ?? '')])
        )
      : {}

  const payload = {
    name,
    slug,
    category_id: entrada.category_id || null,
    price,
    description: entrada.description || null,
    image_url: entrada.image_url || null,
    images: comoLista(entrada.images),
    features: comoLista(entrada.features),
    colors: comoLista(entrada.colors),
    stock,
    rating,
    is_featured: Boolean(entrada.is_featured),
    is_active: Boolean(entrada.is_active),
    specs,
  }

  const id = typeof body?.id === 'string' && body.id ? body.id : null

  const { error } = id
    ? await supabaseAdmin.from('products').update(payload).eq('id', id)
    : await supabaseAdmin.from('products').insert(payload)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
