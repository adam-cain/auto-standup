import {
  cn,
  formatDate,
  formatTime,
  generateSlug,
  truncate,
  getInitials,
  isValidEmail,
} from '../utils'

describe('utils', () => {
  test('cn merges class names', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c')
  })

  test('formatDate returns a readable date', () => {
    const result = formatDate(new Date('2024-06-15T00:00:00Z'))
    expect(result).toMatch(/2024/)
  })

  test('formatTime returns a readable time', () => {
    const result = formatTime(new Date('2024-06-15T13:45:00Z'))
    expect(result).toMatch(/\d{1,2}:\d{2}/)
  })

  test('generateSlug converts text to slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })

  test('truncate shortens text', () => {
    expect(truncate('abcdef', 3)).toBe('abc...')
  })

  test('getInitials extracts initials', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  test('isValidEmail validates email', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('invalid')).toBe(false)
  })
})
