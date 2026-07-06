import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'whatsapp_number')
    .single()

  return NextResponse.json({ number: data?.value || '' })
}
