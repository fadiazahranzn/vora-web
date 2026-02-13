import { describe, it, expect } from 'vitest'
import manifest from '../../../public/manifest.json'

describe('Manifest Validation', () => {
  it('should have all required fields', () => {
    expect(manifest).toHaveProperty('name')
    expect(manifest).toHaveProperty('short_name')
    expect(manifest).toHaveProperty('description')
    expect(manifest).toHaveProperty('start_url')
    expect(manifest).toHaveProperty('display')
    expect(manifest).toHaveProperty('background_color')
    expect(manifest).toHaveProperty('theme_color')
    expect(manifest).toHaveProperty('icons')
  })

  it('should have valid icons', () => {
    expect(Array.isArray(manifest.icons)).toBe(true)
    expect(manifest.icons.length).toBeGreaterThan(0)

    manifest.icons.forEach((icon) => {
      expect(icon).toHaveProperty('src')
      expect(icon).toHaveProperty('sizes')
      expect(icon).toHaveProperty('type')
    })

    const has192 = manifest.icons.some((icon) => icon.sizes === '192x192')
    const has512 = manifest.icons.some((icon) => icon.sizes === '512x512')

    expect(has192).toBe(true)
    expect(has512).toBe(true)
  })

  it('should have correct display mode', () => {
    expect(['standalone', 'fullscreen', 'minimal-ui', 'browser']).toContain(
      manifest.display
    )
  })

  it('should have valid start_url', () => {
    expect(manifest.start_url).toBe('/') // Or specific URL
  })
})
