import { useMemo, useState } from 'react'
import { Composer } from './components/Composer'
import { PostList } from './components/PostList'
import { useToast } from './components/Toast'
import { useLikes } from './hooks/useLikes'
import { usePostMutations, usePostsQuery, useUsers } from './hooks/usePosts'
import { useTheme } from './hooks/useTheme'
import { matchesQuery } from './lib/format'
import type { Post, PostDraft } from './lib/types'

export default function App() {
  const { dark, toggle: toggleTheme } = useTheme()
  const { likes, toggle: toggleLike } = useLikes()
  const notify = useToast()
  const [query, setQuery] = useState('')

  const postsQuery = usePostsQuery()
  const { byId: users } = useUsers()
  const { create, update, remove } = usePostMutations()

  const filtered = useMemo(
    () =>
      (postsQuery.data ?? []).filter((p) =>
        matchesQuery(`${p.title} ${p.body} ${users.get(p.userId)?.name ?? ''}`, query),
      ),
    [postsQuery.data, users, query],
  )

  const run = async (action: () => Promise<unknown>, ok: string, fail: string) => {
    try {
      await action()
      notify(ok)
    } catch {
      notify(fail, 'error')
      throw new Error(fail)
    }
  }

  const handleCreate = (draft: PostDraft) =>
    run(() => create.mutateAsync(draft), 'Publicado', 'No se pudo publicar. Probá de nuevo.')
  const handleUpdate = (post: Post, draft: PostDraft) =>
    run(() => update.mutateAsync({ post, draft }), 'Cambios guardados', 'No se pudieron guardar los cambios.')
  const handleDelete = (post: Post) =>
    run(() => remove.mutateAsync(post), 'Publicación borrada', 'No se pudo borrar la publicación.')

  return (
    <div className="mx-auto min-h-dvh max-w-2xl px-4 pb-24 pt-6 sm:pt-10">
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span aria-hidden="true">🐤 </span>Pajarito
        </h1>
        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={dark}
          className="rounded-lg border border-line bg-card px-3 py-1.5 text-sm font-semibold hover:bg-line"
        >
          {dark ? 'Modo claro' : 'Modo oscuro'}
        </button>
      </header>
      <p className="mt-1 text-muted">Una mini red social: publicá, editá y borrá en tiempo real.</p>

      <main className="mt-6 space-y-6">
        <Composer pending={create.isPending} onSubmit={handleCreate} />

        <section aria-labelledby="feed-title">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 id="feed-title" className="font-display text-xl font-extrabold">
              Publicaciones
              {postsQuery.data && (
                <span className="ml-2 text-base font-semibold text-muted">
                  {filtered.length === postsQuery.data.length
                    ? postsQuery.data.length
                    : `${filtered.length} de ${postsQuery.data.length}`}
                </span>
              )}
            </h2>
            <input
              type="search"
              aria-label="Buscar publicaciones"
              placeholder="Buscar por texto o autor"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm sm:w-64"
            />
          </div>

          <PostList
            posts={postsQuery.data}
            isLoading={postsQuery.isLoading}
            error={postsQuery.error}
            onRetry={() => postsQuery.refetch()}
            filtered={filtered}
            query={query}
            users={users}
            likes={likes}
            onLike={toggleLike}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  )
}
