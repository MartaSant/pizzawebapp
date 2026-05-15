import Dexie, { type EntityTable } from 'dexie'
import { getPizzappDexieName } from './dexieDbName'
import type {
  AppStateEntity,
  BibitaEntity,
  ModificatoreEntity,
  OrderEntity,
  OrderLineBibitaEntity,
  OrderLinePizzaEntity,
  OrderLinePizzaModEntity,
  PizzaEntity,
  UserEntity,
} from './types'

export class PizzappDB extends Dexie {
  users!: EntityTable<UserEntity, 'id'>
  pizze!: EntityTable<PizzaEntity, 'id'>
  modificatori!: EntityTable<ModificatoreEntity, 'id'>
  bibite!: EntityTable<BibitaEntity, 'id'>
  appState!: EntityTable<AppStateEntity, 'id'>
  orders!: EntityTable<OrderEntity, 'id'>
  orderLinePizza!: EntityTable<OrderLinePizzaEntity, 'id'>
  orderLinePizzaMod!: EntityTable<OrderLinePizzaModEntity, 'id'>
  orderLineBibita!: EntityTable<OrderLineBibitaEntity, 'id'>

  constructor() {
    super(getPizzappDexieName())
    this.version(1).stores({
      users: '++id, username, attivo, role',
      pizze: '++id, nome, attiva, ordineVisualizzazione',
      modificatori: '++id, nome, attiva, ordineVisualizzazione',
      bibite: '++id, nome, attiva, ordineVisualizzazione',
      appState: 'id',
      orders: '++id, createdAt, numeroDisplay',
      orderLinePizza: '++id, orderId, lineIndex',
      orderLinePizzaMod: '++id, pizzaLineId',
      orderLineBibita: '++id, orderId',
    })
  }
}

export const db = new PizzappDB()
