# Input Sanitization & CSRF Protection Implementation

## Overview
This implementation provides comprehensive protection against XSS (Cross-Site Scripting) attacks and CSRF (Cross-Site Request Forgery) attacks for the Vora web application.

## Features Implemented

### 1. Input Sanitization
- **Library**: `xss` npm package
- **Location**: `src/lib/sanitize.ts`
- **Coverage**: All text inputs across the application

#### Sanitized Fields:
- **Habits**: `name`, `targetUnit`
- **Tasks**: `title`, `description`, subtask `title`
- **Categories**: `name`
- **Mood Check-ins**: `reflectionText`

#### How It Works:
The sanitization is integrated directly into Zod validation schemas using `.transform()`:

```typescript
import { sanitizeTransform } from '@/lib/sanitize'

const schema = z.object({
  name: z.string().min(1).max(100).transform(sanitizeTransform),
})
```

This ensures that:
- All HTML/script tags are stripped before data reaches the database
- Dangerous content like `<script>`, `<img onerror>`, etc. is removed
- Safe text is preserved
- Sanitization happens automatically during validation

### 2. CSRF Protection
- **Library**: `csrf-csrf` npm package
- **Location**: `src/lib/csrf.ts`
- **Middleware**: `src/middleware.ts`

#### How It Works:
1. **Token Generation**: Clients fetch a CSRF token from `/api/csrf-token`
2. **Token Validation**: Middleware validates tokens on all mutation requests (POST, PATCH, DELETE, PUT)
3. **Exemptions**: 
   - GET, HEAD, OPTIONS requests (safe methods)
   - `/api/auth/*` endpoints (login/register don't have tokens yet)

#### Client Usage:
```typescript
import { useCsrfToken } from '@/hooks/useCsrfToken'

function MyComponent() {
  const { csrfToken } = useCsrfToken()
  
  // Include token in mutation requests
  fetch('/api/habits', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken || '',
    },
    body: JSON.stringify(data),
  })
}
```

## Files Created/Modified

### New Files:
- `src/lib/sanitize.ts` - Sanitization utilities
- `src/lib/csrf.ts` - CSRF protection utilities
- `src/app/api/csrf-token/route.ts` - CSRF token generation endpoint
- `src/hooks/useCsrfToken.ts` - React hook for CSRF tokens
- `src/__tests__/lib/sanitize.test.ts` - Sanitization tests
- `src/__tests__/lib/csrf.test.ts` - CSRF tests
- `src/__tests__/api/csrf-integration.test.ts` - CSRF integration tests
- `src/__tests__/api/sanitization-integration.test.ts` - Sanitization integration tests

### Modified Files:
- `src/lib/validations/habit.ts` - Added sanitization
- `src/lib/validations/task.ts` - Added sanitization
- `src/lib/validations/category.ts` - Added sanitization
- `src/lib/validations/mood.ts` - Added sanitization
- `src/middleware.ts` - Added CSRF validation
- `src/lib/env.ts` - Added CSRF_SECRET environment variable

## Environment Variables

Add to `.env`:
```bash
# CSRF Protection Secret (minimum 32 characters)
CSRF_SECRET=your-secret-key-here-minimum-32-characters-long
```

⚠️ **Important**: Generate a strong random secret for production!

## Testing

### Run All Tests:
```bash
npm test
```

### Run Specific Tests:
```bash
# Sanitization tests
npm test -- src/__tests__/lib/sanitize.test.ts

# CSRF tests
npm test -- src/__tests__/lib/csrf.test.ts

# Integration tests
npm test -- src/__tests__/api/csrf-integration.test.ts
npm test -- src/__tests__/api/sanitization-integration.test.ts
```

## Acceptance Criteria Status

✅ All text inputs sanitized in Zod schemas  
✅ HTML/script injection prevented  
✅ CSRF token generated and validated  
✅ POST/PATCH/DELETE require valid CSRF token  
✅ GET requests exempt from CSRF  
✅ Client can access CSRF token for requests  
✅ Unit tests passing  

## Security Considerations

1. **XSS Prevention**:
   - All user inputs are sanitized before storage
   - HTML tags are stripped, preventing script injection
   - Sanitization happens at the validation layer, ensuring consistency

2. **CSRF Prevention**:
   - Tokens are required for all state-changing operations
   - Tokens are stored in HTTP-only cookies
   - Tokens are validated on every mutation request
   - Safe methods (GET, HEAD, OPTIONS) are exempt

3. **Defense in Depth**:
   - Input sanitization (this implementation)
   - Output encoding (React's built-in XSS protection)
   - Content Security Policy (already implemented)
   - Security headers (already implemented)

## Known Limitations

1. **CSRF Token Refresh**: Tokens don't automatically refresh. For long-lived sessions, consider implementing token rotation.

2. **Client-Side Storage**: CSRF tokens are fetched on component mount. For server-side rendering, consider embedding tokens in the initial HTML.

3. **File Uploads**: File upload sanitization is not covered by this implementation. Consider adding file type validation and virus scanning for production.

## Next Steps

1. **Add CSRF_SECRET to production environment**
2. **Update API client to automatically include CSRF tokens**
3. **Add E2E tests for CSRF protection**
4. **Monitor for XSS/CSRF attempts in production logs**

## References

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [xss npm package](https://www.npmjs.com/package/xss)
- [csrf-csrf npm package](https://www.npmjs.com/package/csrf-csrf)
