import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useOrderCart } from '../context/OrderCartContext'

function printSnapshot(snapshot: string) {
  const w = window.open('', '_blank', 'noopener,noreferrer')
  if (!w) {
    window.alert('Popup bloccato: consenti la finestra per stampare')
    return
  }
  w.document.write(
    `<!DOCTYPE html><html><head><title>Scontrino</title></head><body><pre style="font-family:monospace;font-size:12px;white-space:pre-wrap">${escapeHtml(snapshot)}</pre><script>window.onload=function(){window.print();}<\/script></body></html>`,
  )
  w.document.close()
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function ReceiptPage() {
  const nav = useNavigate()
  const loc = useLocation()
  const cart = useOrderCart()
  const state = loc.state as { snapshot?: string; preview?: boolean } | null
  const snapshot = state?.snapshot ?? ''
  const isPreview = state?.preview ?? false

  useEffect(() => {
    if (!snapshot) nav('/main', { replace: true })
  }, [snapshot, nav])

  if (!snapshot) return null

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ text: snapshot })
        return
      }
    } catch {
      /* ignore */
    }
    try {
      await navigator.clipboard.writeText(snapshot)
      window.alert('Copiato negli appunti')
    } catch {
      window.alert('Impossibile condividere o copiare')
    }
  }

  return (
    <div className="surface-page receipt-page">
      <h1>{isPreview ? 'Anteprima ordine' : 'Scontrino'}</h1>
      {isPreview && (
        <p className="hint">Non ancora salvato. Puoi confermare o tornare indietro per modificare.</p>
      )}
      <pre className="receipt-pre">{snapshot}</pre>
      <div className="row-gap wrap">
        {isPreview && (
          <>
            <button type="button" className="primary" onClick={() => void cart.confirmOrder(() => nav('/main', { replace: true }))}>
              Conferma ordine
            </button>
            <button type="button" className="secondary" onClick={() => nav(-1)}>
              Indietro
            </button>
          </>
        )}
        <button type="button" className="primary" onClick={() => void share()}>
          Invia / Copia
        </button>
        <button type="button" className="secondary" onClick={() => printSnapshot(snapshot)}>
          Stampa
        </button>
        <button type="button" className="ghost" onClick={() => nav('/main')}>
          Chiudi
        </button>
      </div>
    </div>
  )
}
