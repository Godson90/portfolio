import { listWork } from '@/lib/mdx'
import { CatalogRow } from '@/components/ui/CatalogRow'

export const metadata = { title: 'Work' }

export default function WorkIndex() {
  const work = listWork()
  return (
    <main className="max-w-wide mx-auto px-8 py-16">
      <div className="text-xs text-accent-dark mb-3 tracking-wide font-mono">
        $ ls work/
      </div>
      <h1 className="text-3xl font-medium text-text-dark mb-12">Selected work</h1>
      {work.map((w) => (
        <CatalogRow key={w.frontmatter.slug} frontmatter={w.frontmatter} />
      ))}
    </main>
  )
}
