import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendQuotationEmails } from '@/lib/resend'

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { product_id, product_name, customer_name, customer_email, customer_phone, message, channel } = body

  if (!customer_name || !customer_email || !customer_phone || !product_name || !channel) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('quotations').insert({
    product_id: product_id || null,
    product_name,
    customer_name,
    customer_email,
    customer_phone,
    message: message || null,
    channel,
    status: 'pending',
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Failed to save quotation' }, { status: 500 })
  }

  if (channel === 'email') {
    await sendQuotationEmails({
      product_name: product_name as string,
      customer_name: customer_name as string,
      customer_email: customer_email as string,
      customer_phone: customer_phone as string,
      message: message as string | null,
    })
  }

  return NextResponse.json({ ok: true })
}
