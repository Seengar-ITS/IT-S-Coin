'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SellPage() {
  const [its, setIts] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ id: string; amount_pkr: number } | null>(null)
  const [error, setError] = useState('')

  const SELL_FEE = 0.01
  const pkr = its ? (parseFloat(its) * (1 - SELL_FEE)).toFixed(2) : ''
  const fee = its ? (parseFloat(its) * SELL_FEE).toFixed(4) : ''

  async function handleSell() {
    if (!its || parseFloat(its) <= 0) { setError('Enter valid ITS amount'); return }
    setLoading(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Please sign in first'); setLoading(false); return }
    const res = await fetch('/api/coin/sell', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount_its: parseFloat(its), user_id: user.id }) })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    setResult(data.data); setLoading(false)
  }

  if (result) return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>💸</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#ef4444' }}>Sell Successful!</h2>
        <div style={{ fontSize: 40, fontWeight: 800, color: '#ef4444', margin: '16px 0' }}>{result.amount_pkr.toFixed(2)} PKR</div>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Transaction ID: {result.id.slice(0, 16)}...</p>
        <a href="/history" style={{ display: 'inline-block', marginTop: 24, background: 'rgba(239,68,68,0.2)', color: '#ef4444', padding: '10px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>View History</a>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 20, padding: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Sell IT-S Coin</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontSize: 14 }}>1% sell fee · Instant PKR credit</p>

        <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>ITS Amount to Sell</label>
        <input type="number" placeholder="Enter ITS amount" value={its} onChange={e => setIts(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '14px 16px', color: 'white', width: '100%', outline: 'none', fontSize: 18, marginBottom: 20, boxSizing: 'border-box' }} />

        {pkr && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>You receive</span>
              <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 18 }}>{pkr} PKR</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Fee (1%)</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{fee} ITS</span>
            </div>
          </div>
        )}

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#ef4444', fontSize: 14, marginBottom: 20 }}>{error}</div>}

        <button onClick={handleSell} disabled={loading || !its} style={{ width: '100%', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: 'white', padding: '16px', borderRadius: 14, fontWeight: 700, fontSize: 16, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Processing...' : `Sell ${its || '0'} ITS`}
        </button>
      </div>
    </div>
  )
}
