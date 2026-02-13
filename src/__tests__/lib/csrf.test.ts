import { describe, it, expect } from 'vitest'
import { requiresCsrfValidation } from '@/lib/csrf'

describe('CSRF Protection', () => {
  describe('requiresCsrfValidation', () => {
    it('should require CSRF for POST requests', () => {
      expect(requiresCsrfValidation('POST')).toBe(true)
    })

    it('should require CSRF for PUT requests', () => {
      expect(requiresCsrfValidation('PUT')).toBe(true)
    })

    it('should require CSRF for PATCH requests', () => {
      expect(requiresCsrfValidation('PATCH')).toBe(true)
    })

    it('should require CSRF for DELETE requests', () => {
      expect(requiresCsrfValidation('DELETE')).toBe(true)
    })

    it('should NOT require CSRF for GET requests', () => {
      expect(requiresCsrfValidation('GET')).toBe(false)
    })

    it('should NOT require CSRF for HEAD requests', () => {
      expect(requiresCsrfValidation('HEAD')).toBe(false)
    })

    it('should NOT require CSRF for OPTIONS requests', () => {
      expect(requiresCsrfValidation('OPTIONS')).toBe(false)
    })

    it('should handle lowercase method names', () => {
      expect(requiresCsrfValidation('post')).toBe(true)
      expect(requiresCsrfValidation('get')).toBe(false)
    })

    it('should handle mixed case method names', () => {
      expect(requiresCsrfValidation('Post')).toBe(true)
      expect(requiresCsrfValidation('Get')).toBe(false)
    })
  })
})
