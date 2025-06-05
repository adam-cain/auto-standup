import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignUpPage from '../signup/page'
import { signIn } from '@/lib/auth'

jest.mock('@/lib/auth', () => ({ signIn: jest.fn() }))

beforeEach(() => {
  global.fetch = jest.fn(
    () => Promise.resolve({ ok: true })
  ) as unknown as typeof fetch
})

describe('SignUpPage', () => {
  it('registers and signs in', async () => {
    render(<SignUpPage />)
    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'pass' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'pass',
        redirectTo: '/dashboard',
      })
    })
  })
})
