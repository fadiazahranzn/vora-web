import { describe, it, expect } from 'vitest'
import { requiresCsrfValidation } from '@/lib/csrf'

describe('CSRF Protection Integration', () => {
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
  })

  describe('CSRF middleware behavior', () => {
    it('should validate mutation methods', () => {
      const mutationMethods = ['POST', 'PUT', 'PATCH', 'DELETE']
      mutationMethods.forEach((method) => {
        expect(requiresCsrfValidation(method)).toBe(true)
      })
    })

    it('should exempt safe methods', () => {
      const safeMethods = ['GET', 'HEAD', 'OPTIONS']
      safeMethods.forEach((method) => {
        expect(requiresCsrfValidation(method)).toBe(false)
      })
    })

    it('should handle case-insensitive method names', () => {
      expect(requiresCsrfValidation('post')).toBe(true)
      expect(requiresCsrfValidation('Post')).toBe(true)
      expect(requiresCsrfValidation('get')).toBe(false)
      expect(requiresCsrfValidation('Get')).toBe(false)
    })
  })
})
