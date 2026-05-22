import type { WorkFrontmatter } from '@/lib/mdx'

export function ProjectHeader({ frontmatter }: { frontmatter: WorkFrontmatter }) {
  const { catalogId, catalogTag, title, oneLiner, year, role, stack } = frontmatter
  return (
    <header className="border-b border-border-dark pb-8 mb-12">
      <div className="text-xs text-accent-dark mb-3 tracking-wide">
        <span className="text-text-dark-mute">[</span>
        {catalogId} · {catalogTag}
        <span className="text-text-dark-mute">]</span>
      </div>
      <h1 className="text-3xl text-text-dark mb-3 font-medium">{title}</h1>
      <p className="text-sm text-text-dark-dim leading-relaxed max-w-prose">{oneLiner}</p>

      <dl className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 mt-8 text-xs">
        <dt className="text-text-dark-mute">year</dt>
        <dd className="text-text-dark">{year}</dd>

        <dt className="text-text-dark-mute">role</dt>
        <dd className="text-text-dark">{role}</dd>

        <dt className="text-text-dark-mute">stack</dt>
        <dd className="text-text-dark font-mono">{stack.join(', ')}</dd>
      </dl>
    </header>
  )
}
