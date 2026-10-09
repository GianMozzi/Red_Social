export interface Post {
  id: number
  userId: number
  title: string
  body: string
  /** true si se creó en esta sesión (JSONPlaceholder no persiste datos reales) */
  local?: boolean
}

export interface User {
  id: number
  name: string
  username: string
}

export type PostDraft = Pick<Post, 'title' | 'body'>
