import { useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toggleLightDarkFromResolved } from '../data/repositories'
import { useSession } from '../auth/SessionContext'
import { OrderTab } from './OrderTab'
import { HistoryTab } from './HistoryTab'
import { RestoTab } from './RestoTab'
import { AdminTab } from './AdminTab'
import { takeMainTabAfterReceipt } from '../util/receiptNavStaging'

const LABELS = ['Ordine', 'Storico', 'Resto', 'Admin'] as const

export function MainScreen() {
  const [tab, setTab] = useState(0)
  const { logout, user } = useSession()
  const nav = useNavigate()

  useLayoutEffect(() => {
    const m = takeMainTabAfterReceipt()
    if (m != null) setTab(Math.max(0, Math.min(m, LABELS.length - 1)))
  }, [])

  async function onThemeIcon() {
    const dark = document.documentElement.dataset.theme === 'dark'
    await toggleLightDarkFromResolved(dark)
  }

  return (
    <div className="main-shell">
      <header className="top-bar row-between">
        <h1 className="title">{user?.username ?? 'PizzApp'}</h1>
        <div className="row-gap">
          <button type="button" className="icon-btn" title="Tema" onClick={() => void onThemeIcon()}>
            ◑
          </button>
          <button type="button" className="icon-btn" title="Esci" onClick={() => { logout(); nav('/login', { replace: true }) }}>
            ⎋
          </button>
        </div>
      </header>
      <nav className="tab-row main-tabs">
        {LABELS.map((l, i) => (
          <button key={l} type="button" className={tab === i ? 'tab active' : 'tab'} onClick={() => setTab(i)}>
            {l}
          </button>
        ))}
      </nav>
      <main className="main-body">
        {tab === 0 && <OrderTab />}
        {tab === 1 && <HistoryTab />}
        {tab === 2 && <RestoTab />}
        {tab === 3 && <AdminTab />}
      </main>
    </div>
  )
}
