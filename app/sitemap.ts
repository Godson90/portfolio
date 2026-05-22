import type { MetadataRoute } from 'next'
import { listWork } from '@/lib/mdx'

const BASE = 'https://gabrieladeola.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE,            lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/work`,  lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/lab`,   lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    ...listWork().map((w) => ({
      url: `${BASE}/work/${w.frontmatter.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
