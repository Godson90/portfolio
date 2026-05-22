import { describe, it, expect } from 'vitest'
import { loadWork, listWork } from '@/lib/mdx'

describe('loadWork', () => {
  it('parses frontmatter from compass.mdx', () => {
    const work = loadWork('compass')
    expect(work.frontmatter.slug).toBe('compass')
    expect(work.frontmatter.catalogId).toBe('01')
    expect(work.frontmatter.title).toContain('COMPASS')
    expect(work.body.length).toBeGreaterThan(0)
  })
})

describe('listWork', () => {
  it('returns all five work entries sorted by catalogId', () => {
    const list = listWork()
    expect(list).toHaveLength(5)
    expect(list.map((w) => w.frontmatter.catalogId)).toEqual(['01', '02', '03', '04', '05'])
  })
})
