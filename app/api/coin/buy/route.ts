import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const { amount_pkr, user_id } = await req.json()
    if (!amount_pkr || !user_id) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    if (amount_pkr < 500) return NextResponse.json({ error: 'Minimum buy is 500 PKR' }, { status: 400 })

    const { data: coin } = await supabaseAdmin.from('its_coins').select('rate_pkr, circulating_supply, total_supply').single()
    if (!coin) return NextResponse.json({ error: 'Coin not found' }, { status: 404 })

    const BUY_FEE = 0.005
    const fee_pkr = amount_pkr * BUY_FEE
    const amount_its = (amount_pkr - fee_pkr) / coin.rate_pkr
    const fee_its = fee_pkr / coin.rate_pkr

    const { data: txn, error } = await supabaseAdmin.from('coin_transactions').insert({
      user_id, type: 'buy', amount_its, amount_pkr, fee_its, fee_pkr, status: 'completed', reference_id: uuidv4()
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabaseAdmin.from('its_coins').update({ circulating_supply: Number(coin.circulating_supply) + amount_its }).eq('symbol', 'ITS')

    return NextResponse.json({ data: txn })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
