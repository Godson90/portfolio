import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export interface WorkFrontmatter {
  slug: string
  title: string
  catalogId: string
  catalogTag: string
  oneLiner: string
  year: number
  role: string
  stack: string[]
  demoComponent: string | null
  seo?: { description?: string; ogImage?: string }
}

export interface Work {
  frontmatter: WorkFrontmatter
  body: string
}

const WORK_DIR = path.join(process.cwd(), 'content', 'work')

export function loadWork(slug: string): Work {
  const file = path.join(WORK_DIR, `${slug}.mdx`)
  const raw = fs.readFileSync(file, 'utf8')
  const parsed = matter(raw)
  return {
    frontmatter: { slug, ...(parsed.data as Omit<WorkFrontmatter, 'slug'>) },
    body: parsed.content,
  }
}

export function listWork(): Work[] {
  return fs.readdirSync(WORK_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => loadWork(f.replace(/\.mdx$/, '')))
    .sort((a, b) => a.frontmatter.catalogId.localeCompare(b.frontmatter.catalogId))
}
