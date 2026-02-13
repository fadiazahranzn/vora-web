import xss from 'xss'

/**
 * Sanitizes user input to prevent XSS attacks
 * Strips HTML/script tags while preserving safe text
 *
 * @param input - The string to sanitize
 * @returns Sanitized string with dangerous HTML removed
 *
 * @example
 * sanitizeInput("<script>alert('xss')</script>") // Returns: "alert('xss')"
 * sanitizeInput("Hello <b>World</b>") // Returns: "Hello World"
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return input
  }

  // Configure xss to strip all HTML tags
  const sanitized = xss(input, {
    whiteList: {}, // No HTML tags allowed
    stripIgnoreTag: true, // Strip all tags not in whitelist
    stripIgnoreTagBody: ['script', 'style'], // Remove content of script/style tags
  })

  return sanitized.trim()
}

/**
 * Sanitizes optional string input
 * Returns undefined if input is undefined or empty after sanitization
 */
export function sanitizeOptionalInput(
  input: string | undefined
): string | undefined {
  if (!input) return undefined
  const sanitized = sanitizeInput(input)
  return sanitized.length > 0 ? sanitized : undefined
}

/**
 * Zod transform helper for sanitizing string inputs
 * Use with .transform() in Zod schemas
 *
 * @example
 * z.string().transform(sanitizeTransform)
 */
export const sanitizeTransform = (val: string) => sanitizeInput(val)
