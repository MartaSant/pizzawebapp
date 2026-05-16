/** Handoff scontrino → pagina ricevuta senza mettere il testo in `location.state` (limiti di serializzazione / lunghezza). */
const KEY = 'pizzapp_receiptNavHandoff_v1'

export function stageReceiptNavigation(snapshot: string, preview: boolean): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ snapshot, preview }))
  } catch {
    /* quota o storage disabilitato: niente da fare, ReceiptPage reindirizza */
  }
}

export function readReceiptNavigationStaging(): { snapshot: string; preview: boolean } | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw == null) return null
    const o = JSON.parse(raw) as { snapshot?: unknown; preview?: unknown }
    if (typeof o.snapshot !== 'string') return null
    return { snapshot: o.snapshot, preview: Boolean(o.preview) }
  } catch {
    return null
  }
}

export function clearReceiptNavigationStaging(): void {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
