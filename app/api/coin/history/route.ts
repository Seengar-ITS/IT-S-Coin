import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get('user_id')
  if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })
  const { data } = await supabaseAdmin.from('coin_transactions').select('*').eq('user_id', user_id).order('created_at', { ascending: false })
  return NextResponse.json({ data: data || [] })
}
