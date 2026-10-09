import { useState } from 'react'
import { capitalize, MAX_BODY, MAX_TITLE } from '../lib/format'
import type { Post, PostDraft, User } from '../lib/types'
import { Avatar } from './Avatar'

interface Props {
  post: Post
  author?: User
  liked: boolean
  onLike: (id: number) => void
  onUpdate: (post: Post, draft: PostDraft) => Promise<unknown>
  onDelete: (post: Post) => Promise<unknown>
}

const ghost =
  'rounded-md px-2.5 py-1 text-sm font-semibold text-muted transition hover:bg-line hover:text-ink'

export function PostCard({ post, author, liked, onLike, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [title, setTitle] = useState(post.title)
  const [body, setBody] = useState(post.body)

  const name = author?.name ?? `Usuario ${post.userId}`

  async function save() {
    if (title.trim() === '' || body.trim() === '') return
    setBusy(true)
    try {
      await onUpdate(post, { title: title.trim(), body: body.trim() })
      setEditing(false)
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    setBusy(true)
    try {
      await onDelete(post)
    } finally {
      setBusy(false)
      setConfirming(false)
    }
  }

  function cancelEdit() {
    setTitle(post.title)
    setBody(post.body)
    setEditing(false)
  }

  return (
    <article className="rounded-2xl border border-line bg-card p-4 sm:p-5">
      <header className="flex items-center gap-3">
        <Avatar id={post.userId} name={name} />
        <div className="min-w-0">
          <p className="truncate font-semibold">{name}</p>
          <p className="truncate text-sm text-muted">
            @{author?.username ?? `user${post.userId}`}
            {post.local && ' · recién publicado'}
          </p>
        </div>
      </header>

      {editing ? (
        <div className="mt-3 space-y-2">
          <label className="block text-sm font-semibold text-muted" htmlFor={`t-${post.id}`}>
            Título
          </label>
          <input
            id={`t-${post.id}`}
            className="w-full rounded-lg border border-line bg-paper px-3 py-2"
            value={title}
            maxLength={MAX_TITLE}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="block text-sm font-semibold text-muted" htmlFor={`b-${post.id}`}>
            Comentario
          </label>
          <textarea
            id={`b-${post.id}`}
            className="min-h-24 w-full resize-y rounded-lg border border-line bg-paper px-3 py-2"
            value={body}
            maxLength={MAX_BODY}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" className={ghost} onClick={cancelEdit} disabled={busy}>
              Cancelar
            </button>
            <button
              type="button"
              onClick={save}
              disabled={busy || title.trim() === '' || body.trim() === ''}
              className="rounded-md bg-canary px-4 py-1.5 text-sm font-semibold text-on-canary disabled:opacity-50"
            >
              {busy ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <h3 className="font-display text-lg font-extrabold leading-snug">
            {capitalize(post.title)}
          </h3>
          <p className="mt-1 max-w-prose whitespace-pre-line leading-relaxed text-ink/90">
            {capitalize(post.body)}
          </p>
        </div>
      )}

      {!editing && (
        <footer className="mt-3 flex items-center gap-1 border-t border-line pt-2">
          <button
            type="button"
            className={`${ghost} ${liked ? 'text-danger' : ''}`}
            aria-pressed={liked}
            onClick={() => onLike(post.id)}
          >
            {liked ? '♥ Te gusta' : '♡ Me gusta'}
          </button>
          <button type="button" className={ghost} onClick={() => setEditing(true)}>
            Editar
          </button>

          <span className="ml-auto flex items-center gap-1">
            {confirming ? (
              <>
                <span className="text-sm text-muted">¿Borrar esta publicación?</span>
                <button type="button" className={ghost} onClick={() => setConfirming(false)} disabled={busy}>
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={remove}
                  disabled={busy}
                  className="rounded-md bg-danger px-3 py-1 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {busy ? 'Borrando…' : 'Sí, borrar'}
                </button>
              </>
            ) : (
              <button type="button" className={`${ghost} hover:text-danger`} onClick={() => setConfirming(true)}>
                Borrar
              </button>
            )}
          </span>
        </footer>
      )}
    </article>
  )
}
