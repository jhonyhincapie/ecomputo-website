import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

// In-memory conversation state (resets on server restart; acceptable for this use case)
const states = new Map<string, string>()

function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)
}

async function getWelcomeMessage(): Promise<string> {
  const { data } = await supabaseAdmin
    .from('settings')
    .select('value')
    .eq('key', 'bot_welcome')
    .single()
  return (
    data?.value ||
    'Hola! Bienvenido a Comercializadora ECOMPUTO 🖥️\n\n¿Cómo puedo ayudarte?\n1️⃣ Ver catálogo\n2️⃣ Cotizar un producto\n3️⃣ Hablar con un asesor'
  )
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: true })
  }

  const from = body.from as string
  const msgBody = body.body as string

  if (!from || !msgBody) return NextResponse.json({ ok: true })

  const text = msgBody.trim().toLowerCase()
  const state = states.get(from) || 'idle'

  // Greetings or menu request always resets to menu
  if (['hola', 'hello', 'hi', 'menu', 'inicio', 'inicio', '0', 'ayuda', 'help'].includes(text) || state === 'idle') {
    const msg = await getWelcomeMessage()
    await sendWhatsAppMessage(from, msg)
    states.set(from, 'menu')
    return NextResponse.json({ ok: true })
  }

  // Main menu
  if (state === 'menu') {
    if (text === '1') {
      const { data: cats } = await supabaseAdmin
        .from('categories')
        .select('name, icon')
        .order('order_index')
      const list = (cats || []).map(c => `${c.icon} ${c.name}`).join('\n')
      await sendWhatsAppMessage(
        from,
        `📋 *Nuestras categorías:*\n\n${list}\n\n🌐 Visita nuestra web para ver todos los productos y cotizar en línea.\n\nEscribe *menu* para volver.`
      )
      states.set(from, 'menu')
    } else if (text === '2') {
      await sendWhatsAppMessage(
        from,
        '🔍 ¿Qué producto quieres cotizar?\n\nEscribe el nombre o modelo del equipo y lo buscaré en nuestro catálogo.'
      )
      states.set(from, 'cotizar')
    } else if (text === '3') {
      await sendWhatsAppMessage(
        from,
        '👤 *Un asesor te contactará pronto.*\n\n🕐 Horario de atención:\nLunes a Sábado: 8:00 AM — 6:00 PM\n\nEscribe *menu* para ver más opciones.'
      )
      states.set(from, 'menu')
    } else {
      await sendWhatsAppMessage(
        from,
        '❓ No entendí esa opción.\n\nEscribe *menu* para ver las opciones disponibles.'
      )
    }
    return NextResponse.json({ ok: true })
  }

  // Product search for quotation
  if (state === 'cotizar') {
    if (['menu', 'cancelar', 'volver'].includes(text)) {
      const msg = await getWelcomeMessage()
      await sendWhatsAppMessage(from, msg)
      states.set(from, 'menu')
      return NextResponse.json({ ok: true })
    }

    const { data: products } = await supabaseAdmin
      .from('products')
      .select('name, price')
      .eq('is_active', true)
      .ilike('name', `%${text}%`)
      .limit(3)

    if (!products || products.length === 0) {
      await sendWhatsAppMessage(
        from,
        `😔 No encontré productos con "*${msgBody.trim()}*".\n\nIntenta con otra búsqueda, o escribe *menu* para volver.`
      )
    } else {
      const list = products
        .map(p => `• *${p.name}*\n  Precio: ${formatCOP(p.price)}`)
        .join('\n\n')
      await sendWhatsAppMessage(
        from,
        `🖥️ *Encontré esto en nuestro catálogo:*\n\n${list}\n\n¿Te interesa alguno? Escribe *3* para hablar con un asesor, o *menu* para volver.`
      )
      states.set(from, 'menu')
    }
    return NextResponse.json({ ok: true })
  }

  // Fallback
  await sendWhatsAppMessage(
    from,
    '❓ No entendí tu mensaje.\n\nEscribe *menu* para ver las opciones disponibles.'
  )
  return NextResponse.json({ ok: true })
}
