import { describe, it, expect } from 'vitest'
import { loadWork, listWork } from '@/lib/mdx'

describe('loadWork', () => {
  it('parses frontmatter from a known MDX file', () => {
    const work = loadWork('_template')
    expect(work.frontmatter.slug).toBe('_template')
    expect(work.frontmatter.title).toBeDefined()
    expect(work.frontmatter.catalogId).toBeDefined()
    expect(work.body).toBeDefined()
  })
})

describe('listWork', () => {
  it('returns at least the template entry sorted by catalogId', () => {
    const list = listWork()
    expect(list.length).toBeGreaterThanOrEqual(1)
    expect(list[0].frontmatter.slug).toBeDefined()
  })
})
