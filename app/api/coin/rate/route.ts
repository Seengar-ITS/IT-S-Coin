import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data } = await supabaseAdmin.from('its_coins').select('rate_pkr, symbol, name').single()
  return NextResponse.json({ data })
}
