import { describe, expect, it } from 'vitest'
import { resolvePizzappDexieName } from './dexieDbName'

describe('resolvePizzappDexieName', () => {
  it('root base keeps legacy name', () => {
    expect(resolvePizzappDexieName('/')).toBe('pizzaweb')
    expect(resolvePizzappDexieName('')).toBe('pizzaweb')
  })

  it('GitHub Pages project path gets suffix', () => {
    expect(resolvePizzappDexieName('/pizzawebapp/')).toBe('pizzaweb-pizzawebapp')
  })

  it('nested path segments', () => {
    expect(resolvePizzappDexieName('/a/b/')).toBe('pizzaweb-a-b')
  })

  it('override wins', () => {
    expect(resolvePizzappDexieName('/pizzawebapp/', ' mio-db ')).toBe('mio-db')
  })
})
