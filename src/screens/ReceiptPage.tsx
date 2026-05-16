import { useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useOrderCart } from '../context/OrderCartContext'
import { clearReceiptNavigationStaging, readReceiptNavigationStaging } from '../util/receiptNavStaging'

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

function escapeHtml(s: string) {
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
  const [payload, setPayload] = useState<{ snapshot: string; preview: boolean } | null>(null)
  const claimed = useRef(false)

  useLayoutEffect(() => {
    if (claimed.current) return
    claimed.current = true
    const staged = readReceiptNavigationStaging()
    if (staged) {
      setPayload(staged)
      return
    }
    const state = loc.state as { snapshot?: string; preview?: boolean } | null
    if (state?.snapshot != null && state.snapshot !== '') {
      setPayload({ snapshot: state.snapshot, preview: state.preview ?? false })
      return
    }
    nav('/main', { replace: true })
  }, [nav, loc.state])

  function leaveReceipt() {
    clearReceiptNavigationStaging()
  }

  if (!payload) return null

  const snapshot = payload.snapshot
  const isPreview = payload.preview

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
            <button
              type="button"
              className="primary"
              onClick={() =>
                void cart.confirmOrder(() => {
                  leaveReceipt()
                  nav('/main', { replace: true })
                })
              }
            >
              Conferma ordine
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                leaveReceipt()
                nav(-1)
              }}
            >
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
        <button
          type="button"
          className="ghost"
          onClick={() => {
            leaveReceipt()
            nav('/main')
          }}
        >
          Chiudi
        </button>
      </div>
    </div>
  )
}
