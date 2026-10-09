import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface ToastItem {
  id: number
  text: string
  tone: 'ok' | 'error'
}

type Notify = (text: string, tone?: ToastItem['tone']) => void

const ToastContext = createContext<Notify>(() => {})

export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const notify = useCallback<Notify>((text, tone = 'ok') => {
    const id = Date.now() + Math.random()
    setItems((prev) => [...prev, { id, text, tone }])
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className={`toast pointer-events-auto rounded-lg px-4 py-2 text-sm font-semibold shadow-lg ${
              t.tone === 'error' ? 'bg-danger text-white' : 'bg-ink text-paper'
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
