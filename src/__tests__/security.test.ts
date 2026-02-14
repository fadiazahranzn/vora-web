import { describe, it, expect } from 'vitest'
import { sanitizeInput } from '@/lib/sanitize'
import { requiresCsrfValidation } from '@/lib/csrf'

describe('Security - Input Sanitization', () => {
  it('strips <script> tags and content', () => {
    const input = '<script>alert("xss")</script>'
    const output = sanitizeInput(input)
    expect(output).not.toContain('<script>')
    expect(output).not.toContain('alert("xss")') // Checking if body is stripped too
  })

  it('strips <style> tags and content', () => {
    const input = '<style>body { color: red; }</style>'
    const output = sanitizeInput(input)
    expect(output).not.toContain('<style>')
    expect(output).not.toContain('color: red')
  })

  it('removes onclick attributes', () => {
    const input = '<button onclick="alert(1)">Click me</button>'
    const output = sanitizeInput(input)
    expect(output).not.toContain('onclick')
    expect(output).toContain('Click me') // Text content should remain if not in script/style
  })

  it('removes javascript: hrefs', () => {
    const input = '<a href="javascript:alert(1)">Link</a>'
    const output = sanitizeInput(input)
    expect(output).not.toContain('javascript:')
    expect(output).toContain('Link')
  })

  it('preserves safe HTML if whitelisted (none allowed currently)', () => {
    // Current config has empty whitelist, so all tags are stripped
    const input = '<b>Bold</b>'
    const output = sanitizeInput(input)
    expect(output).toBe('Bold')
  })

  it('handles empty input', () => {
    expect(sanitizeInput('')).toBe('')
    // @ts-expect-error - Testing null input handling for robustness
    expect(sanitizeInput(null)).toBe(null)
    // @ts-expect-error - Testing undefined input handling for robustness
    expect(sanitizeInput(undefined)).toBe(undefined)
  })
})

describe('Security - CSRF Logic', () => {
  it('requires validation for mutation methods', () => {
    expect(requiresCsrfValidation('POST')).toBe(true)
    expect(requiresCsrfValidation('PUT')).toBe(true)
    expect(requiresCsrfValidation('PATCH')).toBe(true)
    expect(requiresCsrfValidation('DELETE')).toBe(true)
  })

  it('skips validation for safe methods', () => {
    expect(requiresCsrfValidation('GET')).toBe(false)
    expect(requiresCsrfValidation('HEAD')).toBe(false)
    expect(requiresCsrfValidation('OPTIONS')).toBe(false)
  })
})
