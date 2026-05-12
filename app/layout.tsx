import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IT-S Coin — The Currency of IT-S Universe',
  description: 'Buy, sell, and transfer IT-S Coin (ITS). 100 Billion total supply.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: 'Inter, sans-serif' }}>
        <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,10,0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>ITS</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>IT-S Coin</div>
              <div style={{ fontSize: 11, color: '#6366f1' }}>IT-S Universe</div>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: 24, fontSize: 14 }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Overview</a>
            <a href="/buy" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Buy</a>
            <a href="/sell" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Sell</a>
            <a href="/transfer" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Transfer</a>
            <a href="/history" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>History</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 80 }}>
          IT-S Universe © 2026 — IT-S Coin (ITS) · Total Supply: 100,000,000,000
        </footer>
      </body>
    </html>
  )
}
