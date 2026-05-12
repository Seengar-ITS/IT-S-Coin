import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const { sender_id, recipient_id, amount_its } = await req.json()
    if (!sender_id || !recipient_id || !amount_its) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const TRANSFER_FEE = 0.005
    const fee_its = amount_its * TRANSFER_FEE
    const total_deducted = amount_its + fee_its
    const ref = uuidv4()

    const { data: coin } = await supabaseAdmin.from('its_coins').select('rate_pkr').single()
    const rate = coin?.rate_pkr || 1
    const amount_pkr = amount_its * rate

    const { data: outTxn, error } = await supabaseAdmin.from('coin_transactions').insert({
      user_id: sender_id, type: 'transfer_out', amount_its: total_deducted, amount_pkr, fee_its, fee_pkr: fee_its * rate, status: 'completed', reference_id: ref
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabaseAdmin.from('coin_transactions').insert({
      user_id: recipient_id, type: 'transfer_in', amount_its, amount_pkr, fee_its: 0, fee_pkr: 0, status: 'completed', reference_id: `${ref}-in`
    })

    return NextResponse.json({ data: outTxn })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
