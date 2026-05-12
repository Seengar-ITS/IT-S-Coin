'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [stats, setStats] = useState({ total_supply: 100000000000, circulating_supply: 0, rate_pkr: 1, transactions: 0 })

  useEffect(() => {
    fetch('/api/coin/stats').then(r => r.json()).then(d => { if (d.data) setStats(d.data) }).catch(() => {})
  }, [])

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100, padding: '8px 20px', marginBottom: 24, fontSize: 13, color: '#6366f1' }}>
          🪙 IT-S Coin — Live on IT-S Universe
        </div>
        <h1 style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, background: 'linear-gradient(135deg,#ffffff,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          The Currency of<br />IT-S Universe
        </h1>
        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
          IT-S Coin (ITS) — 100 Billion total supply. 1 ITS = 1 PKR. Buy, sell, transfer with ultra-low fees.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/buy" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', padding: '14px 32px', borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-block' }}>Buy IT-S Coin</a>
          <a href="/sell" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '14px 32px', borderRadius: 14, fontWeight: 600, fontSize: 16, textDecoration: 'none', display: 'inline-block' }}>Sell ITS</a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 80 }}>
        {[
          { label: 'Coin Name', value: 'IT-S Coin', sub: 'Symbol: ITS' },
          { label: 'Total Supply', value: '100,000,000,000', sub: '100 Billion ITS' },
          { label: 'Current Rate', value: `1 ITS = ${stats.rate_pkr} PKR`, sub: 'Live rate' },
          { label: 'Circulating', value: Number(stats.circulating_supply).toLocaleString(), sub: 'ITS in circulation' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16, padding: 28 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#6366f1', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {[
          { icon: '💰', title: 'Buy ITS', desc: 'Minimum 500 PKR. Only 0.5% fee. Instant credit to your wallet.', href: '/buy', cta: 'Buy Now' },
          { icon: '💸', title: 'Sell ITS', desc: 'Convert your ITS back to PKR. Only 1% fee on sells.', href: '/sell', cta: 'Sell Now' },
          { icon: '📤', title: 'Transfer ITS', desc: 'Send ITS to any user instantly. 0.5% transfer fee.', href: '/transfer', cta: 'Send ITS' },
          { icon: '📊', title: 'Transaction History', desc: 'View all your buys, sells, and transfers in one place.', href: '/history', cta: 'View History' },
        ].map(f => (
          <div key={f.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 32 }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>{f.desc}</p>
            <a href={f.href} style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#6366f1', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>{f.cta}</a>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 80, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: 40, textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>IT-S Coin Economics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20, marginTop: 24 }}>
          {[
            { label: 'Buy Fee', value: '0.5%' },
            { label: 'Sell Fee', value: '1%' },
            { label: 'Transfer Fee', value: '0.5%' },
            { label: 'Settlement', value: '0.5%' },
            { label: 'Minimum Buy', value: '500 PKR' },
            { label: 'Rate', value: '1 ITS = 1 PKR' },
          ].map(e => (
            <div key={e.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '16px 12px' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{e.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#22d3ee' }}>{e.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
