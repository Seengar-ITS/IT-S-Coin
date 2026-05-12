'use client'
import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [stats, setStats] = useState({ total_supply: 100000000000, circulating_supply: 0, rate_pkr: 1 })
  const [mintAmount, setMintAmount] = useState('')
  const [burnAmount, setBurnAmount] = useState('')
  const [newRate, setNewRate] = useState('')
  const [rateReason, setRateReason] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/coin/stats').then(r => r.json()).then(d => { if (d.data) setStats(d.data) })
  }, [])

  const adminAction = async (endpoint: string, body: object) => {
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    setMsg(data.error || data.message || 'Done')
    fetch('/api/coin/stats').then(r => r.json()).then(d => { if (d.data) setStats(d.data) })
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '6px 14px', fontSize: 12, color: '#ef4444', fontWeight: 700 }}>ADMIN</div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>IT-S Coin Control Panel</h1>
      </div>

      {msg && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '12px 16px', color: '#22c55e', fontSize: 14, marginBottom: 24 }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Supply', value: Number(stats.total_supply).toLocaleString() + ' ITS' },
          { label: 'Circulating', value: Number(stats.circulating_supply).toLocaleString() + ' ITS' },
          { label: 'Current Rate', value: `1 ITS = ${stats.rate_pkr} PKR` },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#6366f1' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 18, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#22c55e' }}>🪙 Mint Coins</h3>
          <input type="number" placeholder="Amount to mint" value={mintAmount} onChange={e => setMintAmount(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px', color: 'white', width: '100%', outline: 'none', marginBottom: 12, boxSizing: 'border-box' }} />
          <button onClick={() => adminAction('/api/coin/admin/mint', { amount: parseFloat(mintAmount) })}
            style={{ width: '100%', background: 'rgba(34,197,94,0.3)', border: '1px solid rgba(34,197,94,0.5)', color: '#22c55e', padding: '10px', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>
            Mint ITS
          </button>
        </div>

        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 18, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#ef4444' }}>🔥 Burn Coins</h3>
          <input type="number" placeholder="Amount to burn" value={burnAmount} onChange={e => setBurnAmount(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px', color: 'white', width: '100%', outline: 'none', marginBottom: 12, boxSizing: 'border-box' }} />
          <button onClick={() => adminAction('/api/coin/admin/burn', { amount: parseFloat(burnAmount) })}
            style={{ width: '100%', background: 'rgba(239,68,68,0.3)', border: '1px solid rgba(239,68,68,0.5)', color: '#ef4444', padding: '10px', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>
            Burn ITS
          </button>
        </div>

        <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 18, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#6366f1' }}>📈 Update Rate</h3>
          <input type="number" placeholder="New rate (PKR)" value={newRate} onChange={e => setNewRate(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px', color: 'white', width: '100%', outline: 'none', marginBottom: 8, boxSizing: 'border-box' }} />
          <input type="text" placeholder="Reason for change" value={rateReason} onChange={e => setRateReason(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px', color: 'white', width: '100%', outline: 'none', marginBottom: 12, boxSizing: 'border-box' }} />
          <button onClick={() => adminAction('/api/coin/admin/rate', { rate: parseFloat(newRate), reason: rateReason })}
            style={{ width: '100%', background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(99,102,241,0.5)', color: '#6366f1', padding: '10px', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>
            Update Rate
          </button>
        </div>
      </div>
    </div>
  )
}
