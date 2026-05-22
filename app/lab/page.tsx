import { listLabEntries } from '@/lib/lab'

export const metadata = { title: 'Lab' }

export default function Lab() {
  const entries = listLabEntries()
  return (
    <main className="max-w-wide mx-auto px-8 py-16">
      <div className="text-xs text-accent-dark mb-3 tracking-wide font-mono">
        $ ls lab/
      </div>
      <h1 className="text-3xl font-medium text-text-dark mb-3">Lab</h1>
      <p className="text-sm text-text-dark-dim mb-12 max-w-prose">
        Smaller projects and one-off scripts. Not every tool needs a case study.
      </p>
      <div className="border-t border-border-dark">
        {entries.map((e) => (
          <div
            key={`${e.year}-${e.name}`}
            className="grid grid-cols-[80px_220px_1fr] gap-5 py-4 border-b border-dashed border-border-dark items-baseline text-sm"
          >
            <span className="text-text-dark-mute font-mono text-xs">[{e.year}]</span>
            <span className="text-text-dark font-mono text-xs">{e.name}</span>
            <span className="text-text-dark-dim text-xs leading-relaxed">{e.description}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
