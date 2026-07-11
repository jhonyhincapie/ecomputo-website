import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { sendFollowUpEmail } from '@/lib/resend'

const VALID_STATUS = ['pending', 'replied', 'closed']

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.id || !body?.action) {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }

  if (body.action === 'status') {
    if (!VALID_STATUS.includes(body.status)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }
    const { error } = await supabaseAdmin
      .from('quotations')
      .update({ status: body.status })
      .eq('id', body.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'resend') {
    const { data: q, error } = await supabaseAdmin
      .from('quotations')
      .select('*')
      .eq('id', body.id)
      .single()
    if (error || !q) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 })
    }

    const result = await sendFollowUpEmail(q)
    if (!result.ok) {
      return NextResponse.json(
        { error: `El correo no salió: ${result.error}. Verifica RESEND_API_KEY en .env.local.` },
        { status: 502 }
      )
    }

    await supabaseAdmin.from('quotations').update({ status: 'replied' }).eq('id', body.id)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 })
}
