'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function BuyPage() {
  const [pkr, setPkr] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ id: string; amount_its: number } | null>(null)
  const [error, setError] = useState('')

  const BUY_FEE = 0.005
  const MIN_BUY = 500
  const its = pkr ? (parseFloat(pkr) * (1 - BUY_FEE)).toFixed(4) : ''
  const fee = pkr ? (parseFloat(pkr) * BUY_FEE).toFixed(2) : ''

  async function handleBuy() {
    if (!pkr || parseFloat(pkr) < MIN_BUY) { setError('Minimum buy is 500 PKR'); return }
    setLoading(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Please sign in first'); setLoading(false); return }
    const res = await fetch('/api/coin/buy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount_pkr: parseFloat(pkr), user_id: user.id }) })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    setResult(data.data)
    setLoading(false)
  }

  if (result) return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#22c55e' }}>Purchase Successful!</h2>
        <div style={{ fontSize: 40, fontWeight: 800, color: '#22c55e', margin: '16px 0' }}>{result.amount_its.toFixed(4)} ITS</div>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Transaction ID: {result.id.slice(0, 16)}...</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
          <a href="/buy" onClick={() => setResult(null)} style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', padding: '10px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>Buy More</a>
          <a href="/history" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', padding: '10px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>View History</a>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 20, padding: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Buy IT-S Coin</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontSize: 14 }}>Minimum 500 PKR · 0.5% fee</p>

        <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>PKR Amount</label>
        <input
          type="number"
          placeholder="Enter PKR amount (min 500)"
          value={pkr}
          onChange={e => setPkr(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '14px 16px', color: 'white', width: '100%', outline: 'none', fontSize: 18, marginBottom: 20, boxSizing: 'border-box' }}
        />

        {its && (
          <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>You receive</span>
              <span style={{ color: '#6366f1', fontWeight: 700, fontSize: 18 }}>{its} ITS</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Fee (0.5%)</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{fee} PKR</span>
            </div>
          </div>
        )}

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#ef4444', fontSize: 14, marginBottom: 20 }}>{error}</div>}

        <button onClick={handleBuy} disabled={loading || !pkr} style={{ width: '100%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', padding: '16px', borderRadius: 14, fontWeight: 700, fontSize: 16, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Processing...' : `Buy ITS for ${pkr || '0'} PKR`}
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
          {['500', '1000', '2500', '5000'].map(v => (
            <button key={v} onClick={() => setPkr(v)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
              {v} PKR
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
