import { render, screen, fireEvent } from '@testing-library/react'
import SignInPage from '../signin/page'
import { signIn } from '@/lib/auth'

jest.mock('@/lib/auth', () => ({ signIn: jest.fn() }))

describe('SignInPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls signIn with credentials', async () => {
    render(<SignInPage />)
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'pass' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: 'test@example.com',
      password: 'pass',
      redirect: false,
    })
  })
})
