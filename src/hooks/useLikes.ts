import { useCallback, useState } from 'react'

const KEY = 'pajarito-likes'

function load(): Set<number> {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]') as number[])
  } catch {
    return new Set()
  }
}

export function useLikes() {
  const [likes, setLikes] = useState<Set<number>>(load)

  const toggle = useCallback((id: number) => {
    setLikes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try {
        localStorage.setItem(KEY, JSON.stringify([...next]))
      } catch {
        /* ignorar */
      }
      return next
    })
  }, [])

  return { likes, toggle }
}
