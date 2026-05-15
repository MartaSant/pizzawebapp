export interface ReceiptModLine {
  nome: string
  prezzoCentesimi: number
}

export interface ReceiptPizzaLine {
  nome: string
  prezzoBaseCentesimi: number
  extras: ReceiptModLine[]
  removals: string[]
  nota: string | null | undefined
}

export interface ReceiptBibitaLine {
  nome: string
  prezzoUnitarioCentesimi: number
  quantita: number
}

export interface ReceiptData {
  nomeCliente: string | null | undefined
  createdAtMillis: number
  numeroDisplay: number
  pizze: ReceiptPizzaLine[]
  bibite: ReceiptBibitaLine[]
  totaleCentesimi: number
}
