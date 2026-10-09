import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostCard } from './PostCard'
import type { Post } from '../lib/types'

const post: Post = { id: 1, userId: 1, title: 'hola mundo', body: 'primer comentario' }
const author = { id: 1, name: 'Leanne Graham', username: 'Bret' }

function setup(overrides = {}) {
  const props = {
    post,
    author,
    liked: false,
    onLike: vi.fn(),
    onUpdate: vi.fn().mockResolvedValue(undefined),
    onDelete: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
  render(<PostCard {...props} />)
  return props
}

describe('<PostCard />', () => {
  it('muestra autor, título y comentario capitalizados', () => {
    setup()
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Hola mundo' })).toBeInTheDocument()
    expect(screen.getByText('Primer comentario')).toBeInTheDocument()
  })

  it('permite editar y guardar cambios', async () => {
    const user = userEvent.setup()
    const { onUpdate } = setup()

    await user.click(screen.getByRole('button', { name: 'Editar' }))
    const input = screen.getByLabelText('Título')
    await user.clear(input)
    await user.type(input, 'nuevo título')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(onUpdate).toHaveBeenCalledWith(post, { title: 'nuevo título', body: 'primer comentario' })
  })

  it('pide confirmación antes de borrar', async () => {
    const user = userEvent.setup()
    const { onDelete } = setup()

    await user.click(screen.getByRole('button', { name: 'Borrar' }))
    expect(onDelete).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Sí, borrar' }))
    expect(onDelete).toHaveBeenCalledWith(post)
  })

  it('avisa el estado del me gusta', async () => {
    const user = userEvent.setup()
    const { onLike } = setup({ liked: true })
    const like = screen.getByRole('button', { name: /te gusta/i })
    expect(like).toHaveAttribute('aria-pressed', 'true')
    await user.click(like)
    expect(onLike).toHaveBeenCalledWith(1)
  })
})
