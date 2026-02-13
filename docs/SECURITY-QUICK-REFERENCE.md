# Quick Reference: Input Sanitization & CSRF Protection

## For Developers

### Adding Sanitization to New Fields

When creating new Zod schemas with text inputs:

```typescript
import { z } from 'zod'
import { sanitizeTransform, sanitizeOptionalInput } from '@/lib/sanitize'

// For required fields
const schema = z.object({
  name: z.string()
    .min(1, 'Required')
    .max(100, 'Too long')
    .transform(sanitizeTransform), // Add this
})

// For optional fields
const schema = z.object({
  description: z.string()
    .max(500, 'Too long')
    .optional()
    .transform(sanitizeOptionalInput), // Add this
})
```

### Using CSRF Tokens in Components

#### Option 1: Use the API Client (Recommended)
```typescript
import { apiFetch } from '@/lib/api-client'

// CSRF token is automatically included
const response = await apiFetch('/api/habits', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})
```

#### Option 2: Manual Token Management
```typescript
import { useCsrfToken } from '@/hooks/useCsrfToken'

function MyComponent() {
  const { csrfToken, isLoading } = useCsrfToken()
  
  const handleSubmit = async () => {
    await fetch('/api/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken || '',
      },
      body: JSON.stringify(data),
    })
  }
}
```

### Testing Sanitization

```typescript
import { sanitizeInput } from '@/lib/sanitize'

describe('My Feature', () => {
  it('should sanitize user input', () => {
    const input = '<script>alert("xss")</script>Safe Text'
    const result = sanitizeInput(input)
    expect(result).toBe('Safe Text')
    expect(result).not.toContain('<script>')
  })
})
```

### Common XSS Attack Vectors (All Blocked)

```typescript
// Script tags
"<script>alert('xss')</script>" → ""

// Event handlers
"<img src=x onerror='alert(1)'>" → ""

// Nested tags
"<div><script>alert(1)</script></div>" → ""

// Style tags
"<style>body{display:none}</style>" → ""

// Safe text (preserved)
"Hello World" → "Hello World"
```

### CSRF Protection Checklist

When creating new API endpoints:

1. ✅ Mutation endpoints (POST/PATCH/DELETE/PUT) are automatically protected
2. ✅ GET endpoints are automatically exempt
3. ✅ Auth endpoints (`/api/auth/*`) are automatically exempt
4. ⚠️ If you need to exempt a specific endpoint, modify `src/middleware.ts`

### Troubleshooting

#### "Invalid CSRF token" Error
- Ensure you're using `apiFetch()` or including the token manually
- Check that the token is being fetched from `/api/csrf-token`
- Verify `CSRF_SECRET` is set in environment variables

#### Sanitization Not Working
- Ensure you're using `.transform(sanitizeTransform)` in your Zod schema
- Check that the schema is being used in the API route
- Verify the field is a string type

#### Tests Failing
- Make sure to import `vi` from 'vitest' if using mocks
- Use `sanitizeInput()` directly in tests, not the transform
- Check that expected values match actual sanitized output

### Environment Variables

```bash
# Required for CSRF protection
CSRF_SECRET=your-secret-key-minimum-32-characters-long

# Generate a secure secret:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Security Best Practices

1. **Always sanitize user input** - Add transforms to all text fields
2. **Use apiFetch()** - Automatic CSRF token management
3. **Never trust client data** - Validation + sanitization on server
4. **Test your inputs** - Include XSS tests for new features
5. **Monitor logs** - Watch for blocked XSS/CSRF attempts

### Quick Commands

```bash
# Run security tests
npm test -- src/__tests__/lib/sanitize.test.ts
npm test -- src/__tests__/lib/csrf.test.ts

# Generate CSRF secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Check for XSS vulnerabilities (manual)
# Try submitting: <script>alert('test')</script>
# Should be stripped before storage
```

### Need Help?

- 📖 Full docs: `docs/SECURITY-IMPLEMENTATION.md`
- 📝 Implementation summary: `docs/STORY-003-IMPLEMENTATION.md`
- 🧪 Test examples: `src/__tests__/lib/sanitize.test.ts`
- 🔒 OWASP guides: https://owasp.org/www-community/attacks/xss/
