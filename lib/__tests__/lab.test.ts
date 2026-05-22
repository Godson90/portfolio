import { describe, it, expect } from 'vitest'
import { listLabEntries } from '@/lib/lab'

describe('listLabEntries', () => {
  it('returns lab entries sorted by year desc', () => {
    const entries = listLabEntries()
    expect(entries.length).toBeGreaterThan(0)
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i - 1].year).toBeGreaterThanOrEqual(entries[i].year)
    }
  })
})
