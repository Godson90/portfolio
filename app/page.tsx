import Link from 'next/link'
import { listWork } from '@/lib/mdx'
import { CatalogRow } from '@/components/ui/CatalogRow'

export default function Home() {
  const work = listWork()
  return (
    <main className="max-w-wide mx-auto px-8 py-16">
      <div className="text-xs text-accent-dark mb-3 tracking-wide font-mono">
        $ whoami<span className="cursor-blink text-accent-dark">▍</span>
      </div>
      <h1 className="text-3xl font-medium text-text-dark leading-tight mb-5 max-w-prose">
        Security engineer in Columbus, Ohio. I build production-grade tooling that real teams actually use.
      </h1>
      <p className="text-sm text-text-dark-dim leading-relaxed max-w-prose">
        Multi-agent LLM pipelines for compliance. IOC enrichment for SOCs. Identity automation against CyberArk. Risk management at scale. <span className="text-text-dark font-medium">Built with discipline</span> — every feature paired with a design doc, every doc paired with a commit.
      </p>

      <div className="mt-8 inline-block bg-bg-dark-panel border-l-2 border-accent-dark px-4 py-3 max-w-prose text-sm">
        <span className="text-accent-dark text-[10px] uppercase tracking-widest font-semibold mr-3">currently</span>
        Shipping COMPASS — a bi-weekly CIS assessment agent that turns thousands of CrowdStrike Falcon findings into one operator's minutes of review.
      </div>

      <section className="mt-20 border-t border-border-dark pt-10">
        <div className="text-xs text-text-dark-mute tracking-widest uppercase mb-6">
          <span className="text-accent-dark">// </span>selected_work/
        </div>
        {work.map((w) => (
          <CatalogRow key={w.frontmatter.slug} frontmatter={w.frontmatter} />
        ))}
        <p className="mt-6 text-xs text-text-dark-dim">
          Smaller tools and one-off scripts live in{' '}
          <Link href="/lab" className="text-accent-dark">/lab</Link>.
        </p>
      </section>
    </main>
  )
}
