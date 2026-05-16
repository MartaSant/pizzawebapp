/** Handoff scontrino → pagina ricevuta senza mettere il testo in `location.state` (limiti di serializzazione / lunghezza). */
const KEY = 'pizzapp_receiptNavHandoff_v1'

const MAIN_TAB_AFTER_RECEIPT_KEY = 'pizzapp_mainTabAfterReceipt_v1'

export function stageReceiptNavigation(snapshot: string, preview: boolean, returnMainTab?: number): void {
  try {
    const payload: { snapshot: string; preview: boolean; returnMainTab?: number } = { snapshot, preview }
    if (returnMainTab !== undefined) payload.returnMainTab = returnMainTab
    sessionStorage.setItem(KEY, JSON.stringify(payload))
  } catch {
    /* quota o storage disabilitato: niente da fare, ReceiptPage reindirizza */
  }
}

export function readReceiptNavigationStaging(): { snapshot: string; preview: boolean; returnMainTab?: number } | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw == null) return null
    const o = JSON.parse(raw) as { snapshot?: unknown; preview?: unknown; returnMainTab?: unknown }
    if (typeof o.snapshot !== 'string') return null
    const returnMainTab =
      typeof o.returnMainTab === 'number' && Number.isFinite(o.returnMainTab) ? o.returnMainTab : undefined
    return { snapshot: o.snapshot, preview: Boolean(o.preview), returnMainTab }
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

/** Chiamare da ReceiptPage prima di tornare a /main: MainScreen legge e rimuove al mount. */
export function stashMainTabForReturnFromReceipt(mainTab: number): void {
  try {
    sessionStorage.setItem(MAIN_TAB_AFTER_RECEIPT_KEY, String(mainTab))
  } catch {
    /* ignore */
  }
}

export function takeMainTabAfterReceipt(): number | null {
  try {
    const v = sessionStorage.getItem(MAIN_TAB_AFTER_RECEIPT_KEY)
    sessionStorage.removeItem(MAIN_TAB_AFTER_RECEIPT_KEY)
    if (v == null) return null
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}
