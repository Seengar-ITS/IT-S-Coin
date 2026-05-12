import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data: coin } = await supabaseAdmin.from('its_coins').select('*').single()
  const { count } = await supabaseAdmin.from('coin_transactions').select('id', { count: 'exact', head: true })
  return NextResponse.json({ data: { ...coin, transactions: count || 0 } })
}
