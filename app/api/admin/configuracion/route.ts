import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

/* Ajustes del sitio, escritos en el servidor.

   `settings` guarda el número de WhatsApp por el que entran todas las
   consultas de clientes. Cuando esta tabla era escribible con la clave
   anónima, cualquiera podía cambiar ese número y desviar las ventas.
   Aquí solo se aceptan las claves conocidas y con sesión válida. */

const CLAVES_PERMITIDAS = new Set([
  'whatsapp_number',
  'email_to',
  'hero_title',
  'hero_subtitle',
  'bot_welcome',
])

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const entradas = body?.settings
  if (!entradas || typeof entradas !== 'object') {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }

  /* Lista blanca: una clave desconocida no se guarda, se rechaza.
     Así el endpoint no se puede usar para escribir ajustes arbitrarios. */
  const filas: Array<{ key: string; value: string; updated_at: string }> = []
  for (const [key, value] of Object.entries(entradas)) {
    if (!CLAVES_PERMITIDAS.has(key)) {
      return NextResponse.json(
        { error: `Ajuste no permitido: ${key}` },
        { status: 400 }
      )
    }
    filas.push({
      key,
      value: typeof value === 'string' ? value : '',
      updated_at: new Date().toISOString(),
    })
  }

  if (filas.length === 0) {
    return NextResponse.json({ error: 'Nada que guardar' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('settings')
    .upsert(filas, { onConflict: 'key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
