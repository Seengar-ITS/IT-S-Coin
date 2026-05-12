'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TransferPage() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ id: string } | null>(null)
  const [error, setError] = useState('')

  const TRANSFER_FEE = 0.005
  const fee = amount ? (parseFloat(amount) * TRANSFER_FEE).toFixed(4) : ''
  const total = amount ? (parseFloat(amount) * (1 + TRANSFER_FEE)).toFixed(4) : ''

  async function handleTransfer() {
    if (!recipient || !amount) { setError('Fill all fields'); return }
    setLoading(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Please sign in first'); setLoading(false); return }
    const res = await fetch('/api/coin/transfer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sender_id: user.id, recipient_id: recipient, amount_its: parseFloat(amount) }) })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    setResult(data.data); setLoading(false)
  }

  if (result) return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📤</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#22c55e' }}>Transfer Sent!</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 12 }}>Transaction ID: {result.id.slice(0, 16)}...</p>
        <a href="/history" style={{ display: 'inline-block', marginTop: 24, background: 'rgba(34,197,94,0.2)', color: '#22c55e', padding: '10px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>View History</a>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 20, padding: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Transfer ITS</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontSize: 14 }}>Send to any user · 0.5% fee</p>

        <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>Recipient User ID</label>
        <input type="text" placeholder="Enter recipient user ID" value={recipient} onChange={e => setRecipient(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '14px 16px', color: 'white', width: '100%', outline: 'none', fontSize: 14, marginBottom: 16, boxSizing: 'border-box' }} />

        <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>ITS Amount</label>
        <input type="number" placeholder="Enter ITS to send" value={amount} onChange={e => setAmount(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '14px 16px', color: 'white', width: '100%', outline: 'none', fontSize: 18, marginBottom: 20, boxSizing: 'border-box' }} />

        {total && (
          <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Recipient gets</span>
              <span style={{ color: '#6366f1', fontWeight: 700 }}>{amount} ITS</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Transfer fee (0.5%)</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{fee} ITS</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Total deducted</span>
              <span style={{ color: 'white', fontWeight: 700 }}>{total} ITS</span>
            </div>
          </div>
        )}

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#ef4444', fontSize: 14, marginBottom: 20 }}>{error}</div>}

        <button onClick={handleTransfer} disabled={loading || !recipient || !amount} style={{ width: '100%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', padding: '16px', borderRadius: 14, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Sending...' : 'Send ITS'}
        </button>
      </div>
    </div>
  )
}
