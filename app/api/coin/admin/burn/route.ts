import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { amount } = await req.json()
  if (!amount || amount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  const { data: coin } = await supabaseAdmin.from('its_coins').select('total_supply, circulating_supply').single()
  const newSupply = Math.max(Number(coin?.circulating_supply || 0), Number(coin?.total_supply || 0) - amount)
  await supabaseAdmin.from('its_coins').update({ total_supply: newSupply }).eq('symbol', 'ITS')
  return NextResponse.json({ message: `Burned ${amount} ITS` })
}
