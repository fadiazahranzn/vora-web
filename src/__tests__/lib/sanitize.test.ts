import { describe, it, expect } from 'vitest'
import {
  sanitizeInput,
  sanitizeOptionalInput,
  sanitizeTransform,
} from '@/lib/sanitize'

describe('sanitizeInput', () => {
  it('should strip script tags', () => {
    const input = "<script>alert('xss')</script>"
    const result = sanitizeInput(input)
    // xss library removes script tags and their content completely
    expect(result).toBe('')
  })

  it('should strip HTML tags', () => {
    const input = 'Hello <b>World</b>'
    const result = sanitizeInput(input)
    expect(result).toBe('Hello World')
  })

  it('should strip multiple HTML tags', () => {
    const input = '<div><p>Test</p><span>Content</span></div>'
    const result = sanitizeInput(input)
    expect(result).toBe('TestContent')
  })

  it('should handle nested script tags', () => {
    const input = '<script><script>alert("xss")</script></script>'
    const result = sanitizeInput(input)
    expect(result).not.toContain('<script>')
    expect(result).not.toContain('</script>')
  })

  it('should preserve safe text', () => {
    const input = 'This is a safe string'
    const result = sanitizeInput(input)
    expect(result).toBe('This is a safe string')
  })

  it('should handle HTML entities', () => {
    const input = 'Test &amp; &lt; &gt; entities'
    const result = sanitizeInput(input)
    expect(result).toBe('Test &amp; &lt; &gt; entities')
  })

  it('should strip style tags and content', () => {
    const input = '<style>body { color: red; }</style>Normal text'
    const result = sanitizeInput(input)
    expect(result).not.toContain('<style>')
    expect(result).not.toContain('color: red')
    expect(result).toContain('Normal text')
  })

  it('should handle onclick and other event handlers', () => {
    const input = '<div onclick="alert(\'xss\')">Click me</div>'
    const result = sanitizeInput(input)
    expect(result).not.toContain('onclick')
    expect(result).not.toContain('alert')
  })

  it('should handle img tags with onerror', () => {
    const input = '<img src="x" onerror="alert(\'xss\')">'
    const result = sanitizeInput(input)
    expect(result).not.toContain('onerror')
    expect(result).not.toContain('alert')
  })

  it('should trim whitespace', () => {
    const input = '  test  '
    const result = sanitizeInput(input)
    expect(result).toBe('test')
  })

  it('should handle empty strings', () => {
    const input = ''
    const result = sanitizeInput(input)
    expect(result).toBe('')
  })

  it('should handle null/undefined gracefully', () => {
    expect(sanitizeInput(null as any)).toBe(null)
    expect(sanitizeInput(undefined as any)).toBe(undefined)
  })
})

describe('sanitizeOptionalInput', () => {
  it('should sanitize and return string', () => {
    const input = '<script>alert("xss")</script>Test'
    const result = sanitizeOptionalInput(input)
    expect(result).toBe('Test')
  })

  it('should return undefined for undefined input', () => {
    const result = sanitizeOptionalInput(undefined)
    expect(result).toBeUndefined()
  })

  it('should return undefined for empty string after sanitization', () => {
    const input = '<script></script>'
    const result = sanitizeOptionalInput(input)
    expect(result).toBeUndefined()
  })

  it('should return sanitized string for valid input', () => {
    const input = 'Valid text'
    const result = sanitizeOptionalInput(input)
    expect(result).toBe('Valid text')
  })
})

describe('sanitizeTransform', () => {
  it('should work as a Zod transform function', () => {
    const input = '<b>Bold</b> text'
    const result = sanitizeTransform(input)
    expect(result).toBe('Bold text')
  })

  it('should strip dangerous content', () => {
    const input = '<script>alert("xss")</script>Safe'
    const result = sanitizeTransform(input)
    expect(result).toBe('Safe')
  })
})

describe('Integration with Zod schemas', () => {
  it('should sanitize habit names', async () => {
    const { createHabitSchema } = await import('@/lib/validations/habit')

    const input = {
      name: '<script>alert("xss")</script>Morning Run',
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
      color: '#FF0000',
      frequency: 'DAILY',
      targetValue: 1,
    }

    const result = createHabitSchema.parse(input)
    expect(result.name).toBe('Morning Run')
    expect(result.name).not.toContain('<script>')
  })

  it('should sanitize task titles', async () => {
    const { createTaskSchema } = await import('@/lib/validations/task')

    const input = {
      title: '<img src=x onerror="alert(1)">Buy groceries',
      priority: 'MEDIUM',
      recurrence: 'NONE',
    }

    const result = createTaskSchema.parse(input)
    expect(result.title).toBe('Buy groceries')
    expect(result.title).not.toContain('onerror')
  })

  it('should sanitize category names', async () => {
    const { createCategorySchema } = await import('@/lib/validations/category')

    const input = {
      name: '<b>Health</b>',
      icon: '💪',
      defaultColor: '#00FF00',
    }

    const result = createCategorySchema.parse(input)
    expect(result.name).toBe('Health')
    expect(result.name).not.toContain('<b>')
  })

  it('should sanitize mood reflection text', async () => {
    const { createMoodCheckinSchema } = await import('@/lib/validations/mood')

    const input = {
      habitId: '123e4567-e89b-12d3-a456-426614174000',
      date: '2024-01-01',
      mood: 'HAPPY',
      reflectionText: '<script>alert("xss")</script>Feeling great today!',
    }

    const result = createMoodCheckinSchema.parse(input)
    expect(result.reflectionText).toBe('Feeling great today!')
    expect(result.reflectionText).not.toContain('<script>')
  })
})
