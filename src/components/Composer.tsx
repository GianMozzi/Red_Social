import { useState, type FormEvent } from 'react'
import { MAX_BODY, MAX_TITLE } from '../lib/format'
import type { PostDraft } from '../lib/types'

interface Props {
  pending: boolean
  onSubmit: (draft: PostDraft) => Promise<unknown>
}

const field =
  'w-full rounded-lg border border-line bg-paper px-3 py-2 text-base text-ink placeholder:text-muted'

export function Composer({ pending, onSubmit }: Props) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const valid = title.trim() !== '' && body.trim() !== ''

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!valid || pending) return
    try {
      await onSubmit({ title: title.trim(), body: body.trim() })
      setTitle('')
      setBody('')
    } catch {
      /* el error se informa desde el padre; conservamos lo escrito */
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Nueva publicación"
      className="rounded-2xl border border-line border-l-8 border-l-canary bg-card p-4 sm:p-5"
    >
      <h2 className="font-display text-xl font-extrabold">¿Qué estás pensando?</h2>

      <label htmlFor="title" className="mt-3 block text-sm font-semibold text-muted">
        Título
      </label>
      <input
        id="title"
        className={field}
        value={title}
        maxLength={MAX_TITLE}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ponele nombre a tu idea"
      />

      <label htmlFor="body" className="mt-3 block text-sm font-semibold text-muted">
        Comentario
      </label>
      <textarea
        id="body"
        className={`${field} min-h-24 resize-y`}
        value={body}
        maxLength={MAX_BODY}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Contá más…"
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-sm text-muted" aria-live="off">
          {body.length}/{MAX_BODY}
        </span>
        <button
          type="submit"
          disabled={!valid || pending}
          className="rounded-lg bg-canary px-5 py-2 font-semibold text-on-canary transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Publicando…' : 'Publicar'}
        </button>
      </div>
    </form>
  )
}
