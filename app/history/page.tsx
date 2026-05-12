'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Transaction { id: string; type: string; amount_its: number; amount_pkr: number; fee_its: number; status: string; created_at: string; reference_id: string }

export default function HistoryPage() {
  const [txns, setTxns] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/'; return }
      const res = await fetch(`/api/coin/history?user_id=${user.id}`)
      const data = await res.json()
      if (data.data) setTxns(data.data)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = filter === 'all' ? txns : txns.filter(t => t.type === filter)
  const typeColor = (t: string) => ({ buy: '#22c55e', sell: '#ef4444', transfer_out: '#f59e0b', transfer_in: '#22d3ee' }[t] || '#6366f1')
  const typeIcon = (t: string) => ({ buy: '💰', sell: '💸', transfer_out: '📤', transfer_in: '📥' }[t] || '🔄')

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Transaction History</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>All your IT-S Coin transactions</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', 'buy', 'sell', 'transfer_out', 'transfer_in'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ background: filter === f ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)', border: `1px solid ${filter === f ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, padding: '8px 18px', color: filter === f ? '#6366f1' : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>Loading transactions...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>No transactions found</div>
        ) : filtered.map((t, i) => (
          <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: 16, alignItems: 'center', padding: '16px 24px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${typeColor(t.type)}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{typeIcon(t.type)}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, textTransform: 'capitalize' }}>{t.type.replace('_', ' ')}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{new Date(t.created_at).toLocaleString()} · Ref: {t.reference_id?.slice(0, 12) || 'N/A'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: typeColor(t.type) }}>{Number(t.amount_its).toLocaleString()} ITS</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Fee: {t.fee_its} ITS</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
