import { useMemo, useState } from 'react'
import { MoneyFormatter } from '../domain/money'
import { getLatestOrderTotaleCentesimi } from '../data/repositories'

function centsToInputValue(centesimi: number): string {
  return (centesimi / 100).toFixed(2).replace('.', ',')
}

export function RestoTab() {
  const [contanti, setContanti] = useState('')
  const [importo, setImporto] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  const contantiCentesimi = useMemo(() => MoneyFormatter.parseToCentesimi(contanti), [contanti])
  const importoCentesimi = useMemo(() => MoneyFormatter.parseToCentesimi(importo), [importo])

  const restoCentesimi =
    contantiCentesimi != null && importoCentesimi != null
      ? contantiCentesimi - importoCentesimi
      : null

  function onNumericInput(raw: string, set: (v: string) => void) {
    const cleaned = raw.replace(/€/g, '').replace(/\s/g, '')
    if (cleaned === '' || /^[0-9]*[,.]?[0-9]*$/.test(cleaned)) {
      set(cleaned)
      setMsg(null)
    }
  }

  async function fillImportoFromLastOrder() {
    try {
      const totale = await getLatestOrderTotaleCentesimi()
      if (totale == null) {
        setMsg('Nessun ordine nello storico')
        return
      }
      setImporto(centsToInputValue(totale))
      setMsg(null)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Errore')
    }
  }

  return (
    <div className="stack resto-tab">
      <h2 className="section-title">Resto da dare</h2>
      <p className="hint">Inserisci i contanti ricevuti e l&apos;importo dovuto: calcoliamo il resto.</p>

      <label className="resto-field">
        <span>Contanti</span>
        <input
          className="field"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0,00"
          value={contanti}
          onChange={(e) => onNumericInput(e.target.value, setContanti)}
        />
      </label>

      <label className="resto-field">
        <span>Importo</span>
        <input
          className="field"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0,00"
          value={importo}
          onChange={(e) => onNumericInput(e.target.value, setImporto)}
        />
      </label>

      <button type="button" className="secondary" onClick={() => void fillImportoFromLastOrder()}>
        Usa totale ultimo ordine (storico)
      </button>

      {msg && <p className="error">{msg}</p>}

      <section className="card resto-result" aria-live="polite">
        <div className="hint">Resto</div>
        {restoCentesimi != null ? (
          <strong className={restoCentesimi < 0 ? 'resto-result__negative' : 'resto-result__value'}>
            {MoneyFormatter.format(Math.abs(restoCentesimi))}
            {restoCentesimi < 0 ? ' (mancano)' : ''}
          </strong>
        ) : (
          <span className="hint">Inserisci contanti e importo</span>
        )}
      </section>
    </div>
  )
}
