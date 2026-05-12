import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const { amount_its, user_id } = await req.json()
    if (!amount_its || !user_id) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    if (amount_its <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })

    const { data: coin } = await supabaseAdmin.from('its_coins').select('rate_pkr, circulating_supply').single()
    if (!coin) return NextResponse.json({ error: 'Coin not found' }, { status: 404 })

    const SELL_FEE = 0.01
    const fee_its = amount_its * SELL_FEE
    const net_its = amount_its - fee_its
    const amount_pkr = net_its * coin.rate_pkr
    const fee_pkr = fee_its * coin.rate_pkr

    const { data: txn, error } = await supabaseAdmin.from('coin_transactions').insert({
      user_id, type: 'sell', amount_its, amount_pkr, fee_its, fee_pkr, status: 'completed', reference_id: uuidv4()
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const newCirculating = Math.max(0, Number(coin.circulating_supply) - amount_its)
    await supabaseAdmin.from('its_coins').update({ circulating_supply: newCirculating }).eq('symbol', 'ITS')

    return NextResponse.json({ data: txn })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
