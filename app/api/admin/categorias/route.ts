import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

/* Escrituras de categorías, en el servidor.

   Antes el panel escribía directo desde el navegador con la clave
   anónima, lo que obligaba a mantener una política RLS que dejaba a
   cualquiera modificar el catálogo. Aquí la sesión se valida antes de
   tocar nada y se escribe con service_role. */

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

async function requireSession() {
  const session = await getServerSession(authOptions)
  return Boolean(session)
}

export async function POST(req: Request) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  if (!name) {
    return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
  }

  const slug = slugify(body.slug || name)
  if (!slug) {
    return NextResponse.json(
      { error: 'El nombre no produce una URL válida' },
      { status: 400 }
    )
  }

  const orderIndex = Number.parseInt(String(body?.order_index ?? '0'), 10)

  const { error } = await supabaseAdmin.from('categories').insert({
    name,
    slug,
    icon: typeof body?.icon === 'string' ? body.icon : '',
    order_index: Number.isFinite(orderIndex) ? orderIndex : 0,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const id = typeof body?.id === 'string' ? body.id : ''
  if (!id) {
    return NextResponse.json({ error: 'Falta el identificador' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('categories').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
