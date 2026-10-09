import type { Post, PostDraft, User } from '../lib/types'
import { PostCard } from './PostCard'

interface Props {
  posts: Post[] | undefined
  isLoading: boolean
  error: Error | null
  onRetry: () => void
  filtered: Post[]
  query: string
  users: Map<number, User>
  likes: Set<number>
  onLike: (id: number) => void
  onUpdate: (post: Post, draft: PostDraft) => Promise<unknown>
  onDelete: (post: Post) => Promise<unknown>
}

function Skeleton() {
  return (
    <div className="rounded-2xl border border-line bg-card p-5" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="skeleton size-11 rounded-full" />
        <div className="space-y-2">
          <div className="skeleton h-3 w-32" />
          <div className="skeleton h-3 w-20" />
        </div>
      </div>
      <div className="skeleton mt-4 h-4 w-3/4" />
      <div className="skeleton mt-2 h-3 w-full" />
      <div className="skeleton mt-2 h-3 w-5/6" />
    </div>
  )
}

export function PostList(props: Props) {
  const { posts, isLoading, error, onRetry, filtered, query, users, likes } = props

  if (isLoading) {
    return (
      <div className="space-y-4" role="status" aria-label="Cargando publicaciones">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-danger bg-card p-5">
        <p className="font-semibold text-danger">No pudimos cargar las publicaciones.</p>
        <p className="mt-1 text-sm text-muted">{error.message}. Revisá tu conexión y volvé a intentar.</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg bg-canary px-4 py-2 font-semibold text-on-canary"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">
        {posts && posts.length > 0 && query
          ? `No hay publicaciones que coincidan con “${query}”.`
          : 'Todavía no hay publicaciones. Escribí la primera arriba.'}
      </p>
    )
  }

  return (
    <ul className="space-y-4">
      {filtered.map((post) => (
        <li key={post.id}>
          <PostCard
            post={post}
            author={users.get(post.userId)}
            liked={likes.has(post.id)}
            onLike={props.onLike}
            onUpdate={props.onUpdate}
            onDelete={props.onDelete}
          />
        </li>
      ))}
    </ul>
  )
}
