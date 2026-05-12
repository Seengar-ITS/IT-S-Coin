import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { rate, reason } = await req.json()
  if (!rate || rate <= 0) return NextResponse.json({ error: 'Invalid rate' }, { status: 400 })
  await supabaseAdmin.from('its_coins').update({ rate_pkr: rate }).eq('symbol', 'ITS')
  await supabaseAdmin.from('coin_rates').insert({ rate_pkr: rate, reason })
  return NextResponse.json({ message: `Rate updated to 1 ITS = ${rate} PKR` })
}
