import type { Post, PostDraft, User } from '../lib/types'

const BASE = 'https://jsonplaceholder.typicode.com'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json; charset=UTF-8', ...init?.headers },
  })
  if (!res.ok) throw new Error(`La API respondió ${res.status}`)
  return res.json() as Promise<T>
}

export const fetchPosts = () => request<Post[]>('/posts')
export const fetchUsers = () => request<User[]>('/users')

export async function createPost(draft: PostDraft, userId: number): Promise<Post> {
  await request('/posts', { method: 'POST', body: JSON.stringify({ ...draft, userId }) })
  // JSONPlaceholder siempre devuelve id 101, así que generamos uno propio
  return { id: Date.now(), userId, ...draft, local: true }
}

export async function updatePost(post: Post, draft: PostDraft): Promise<Post> {
  // Los posts creados localmente no existen en el servidor: no hay nada que enviar
  if (!post.local) {
    await request(`/posts/${post.id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...post, ...draft }),
    })
  }
  return { ...post, ...draft }
}

export async function deletePost(post: Post): Promise<void> {
  if (!post.local) await request(`/posts/${post.id}`, { method: 'DELETE' })
}
