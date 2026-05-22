import Link from 'next/link'
import type { WorkFrontmatter } from '@/lib/mdx'

interface Props { frontmatter: WorkFrontmatter }

export function CatalogRow({ frontmatter }: Props) {
  const { catalogId, catalogTag, slug, title, oneLiner } = frontmatter
  return (
    <Link
      href={`/work/${slug}`}
      className="grid grid-cols-[140px_1fr_24px] gap-5 py-4 border-b border-dashed border-border-dark items-baseline no-underline hover:bg-bg-dark-panel transition-colors px-2 -mx-2 rounded"
    >
      <span className="text-xs text-accent-dark font-mono tracking-wide">
        <span className="text-text-dark-mute">[</span>
        {catalogId} · {catalogTag}
        <span className="text-text-dark-mute">]</span>
      </span>
      <div>
        <div className="text-sm text-text-dark font-medium">{title}</div>
        <div className="text-xs text-text-dark-dim mt-1 leading-relaxed">{oneLiner}</div>
      </div>
      <span className="text-accent-dark text-sm">→</span>
    </Link>
  )
}
