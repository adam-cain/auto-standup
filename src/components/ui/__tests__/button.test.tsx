import { render, screen } from '@testing-library/react'
import { Button } from '../button'

describe('Button component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('applies destructive styles when variant set', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toMatch(/bg-destructive/)
  })
})
