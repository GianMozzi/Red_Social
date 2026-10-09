import { avatarHue, capitalize, initials, matchesQuery } from './format'

describe('format helpers', () => {
  it('genera iniciales de nombre y apellido', () => {
    expect(initials('Leanne Graham')).toBe('LG')
    expect(initials('  clementine  ')).toBe('C')
    expect(initials('')).toBe('?')
  })

  it('usa la primera y la última palabra para las iniciales', () => {
    expect(initials('Mrs. Dennis Schulist')).toBe('MS')
  })

  it('capitaliza sin romper strings vacíos', () => {
    expect(capitalize('hola mundo')).toBe('Hola mundo')
    expect(capitalize('   ')).toBe('')
  })

  it('el matiz del avatar es estable y está en rango', () => {
    expect(avatarHue(3)).toBe(avatarHue(3))
    for (let i = 0; i < 200; i++) {
      const h = avatarHue(i)
      expect(h).toBeGreaterThanOrEqual(0)
      expect(h).toBeLessThan(360)
    }
  })

  it('filtra ignorando mayúsculas y espacios', () => {
    expect(matchesQuery('Hola Mundo', '  mundo ')).toBe(true)
    expect(matchesQuery('Hola Mundo', 'chau')).toBe(false)
    expect(matchesQuery('Hola Mundo', '')).toBe(true)
  })
})
