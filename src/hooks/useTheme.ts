import { useCallback, useEffect, useState } from 'react'

export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('pajarito-theme', dark ? 'dark' : 'light')
    } catch {
      /* modo privado: ignorar */
    }
  }, [dark])

  const toggle = useCallback(() => setDark((d) => !d), [])
  return { dark, toggle }
}
