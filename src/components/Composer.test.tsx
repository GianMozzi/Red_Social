import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Composer } from './Composer'

describe('<Composer />', () => {
  it('deshabilita el botón hasta completar título y comentario', async () => {
    const user = userEvent.setup()
    render(<Composer pending={false} onSubmit={vi.fn()} />)
    const button = screen.getByRole('button', { name: 'Publicar' })
    expect(button).toBeDisabled()

    await user.type(screen.getByLabelText('Título'), 'Hola')
    expect(button).toBeDisabled()
    await user.type(screen.getByLabelText('Comentario'), 'Mundo')
    expect(button).toBeEnabled()
  })

  it('envía los valores sin espacios sobrantes y limpia el formulario', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<Composer pending={false} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Título'), '  Hola  ')
    await user.type(screen.getByLabelText('Comentario'), '  Mundo ')
    await user.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(onSubmit).toHaveBeenCalledWith({ title: 'Hola', body: 'Mundo' })
    expect(screen.getByLabelText('Título')).toHaveValue('')
  })

  it('conserva lo escrito si el envío falla', async () => {
    const user = userEvent.setup()
    render(<Composer pending={false} onSubmit={vi.fn().mockRejectedValue(new Error('x'))} />)

    await user.type(screen.getByLabelText('Título'), 'Hola')
    await user.type(screen.getByLabelText('Comentario'), 'Mundo')
    await user.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(screen.getByLabelText('Título')).toHaveValue('Hola')
  })
})
