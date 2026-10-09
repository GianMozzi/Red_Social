export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

/** Matiz estable (0-359) derivado de un id, para colorear avatares */
export function avatarHue(id: number): number {
  return (id * 47 + 20) % 360
}

export function capitalize(text: string): string {
  const t = text.trim()
  return t ? t[0].toUpperCase() + t.slice(1) : t
}

export function matchesQuery(text: string, query: string): boolean {
  const q = query.trim().toLowerCase()
  return q === '' || text.toLowerCase().includes(q)
}

export const MAX_TITLE = 80
export const MAX_BODY = 280
