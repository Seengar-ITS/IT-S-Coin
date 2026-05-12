import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get('user_id')
  if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

  const { data } = await supabaseAdmin.from('coin_transactions').select('type, amount_its, fee_its').eq('user_id', user_id)
  let balance = 0
  for (const t of (data || [])) {
    if (t.type === 'buy' || t.type === 'transfer_in') balance += Number(t.amount_its)
    if (t.type === 'sell' || t.type === 'transfer_out') balance -= Number(t.amount_its)
  }
  return NextResponse.json({ data: { balance_its: Math.max(0, balance) } })
}
