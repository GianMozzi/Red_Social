import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPost, deletePost, fetchPosts, fetchUsers, updatePost } from '../api/posts'
import type { Post, PostDraft, User } from '../lib/types'

const POSTS_KEY = ['posts']
export const CURRENT_USER_ID = 1

export function usePostsQuery() {
  return useQuery({ queryKey: POSTS_KEY, queryFn: fetchPosts, staleTime: Infinity })
}

export function useUsers() {
  const query = useQuery({ queryKey: ['users'], queryFn: fetchUsers, staleTime: Infinity })
  const byId = new Map<number, User>((query.data ?? []).map((u) => [u.id, u]))
  return { byId, ...query }
}

// Como JSONPlaceholder no guarda cambios, el caché de React Query es nuestra fuente de verdad.
export function usePostMutations() {
  const qc = useQueryClient()
  const patch = (fn: (posts: Post[]) => Post[]) =>
    qc.setQueryData<Post[]>(POSTS_KEY, (old = []) => fn(old))

  const create = useMutation({
    mutationFn: (draft: PostDraft) => createPost(draft, CURRENT_USER_ID),
    onSuccess: (post) => patch((posts) => [post, ...posts]),
  })

  const update = useMutation({
    mutationFn: ({ post, draft }: { post: Post; draft: PostDraft }) => updatePost(post, draft),
    onSuccess: (updated) => patch((posts) => posts.map((p) => (p.id === updated.id ? updated : p))),
  })

  const remove = useMutation({
    mutationFn: (post: Post) => deletePost(post),
    onSuccess: (_void, post) => patch((posts) => posts.filter((p) => p.id !== post.id)),
  })

  return { create, update, remove }
}
