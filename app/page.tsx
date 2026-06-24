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
        Security engineer in Columbus, Ohio. I run the day job — threat hunting, IAM, third-party risk assessment — and build the tooling that closes the gap between alert and action.
      </h1>
      <p className="text-sm text-text-dark-dim leading-relaxed max-w-prose">
        Detection and threat hunting across EDR, DLP, identity, and cloud telemetry. IAM and PAM administration against CyberArk. Cloud security across AWS, Azure, and M365. Application security and OWASP guardrails — including the LLM top ten. Penetration testing and vulnerability assessment. Vendor and third-party risk assessment. And the tooling that ties it together: multi-agent LLM pipelines for compliance, IOC enrichment for SOCs, identity automation, and risk management at scale.
      </p>

      <section className="mt-20 border-t border-border-dark pt-10">
        <div className="text-xs text-text-dark-mute tracking-widest uppercase mb-6">
          <span className="text-accent-dark">// </span>selected_work/
        </div>
        {work.map((w) => (
          <CatalogRow key={w.frontmatter.slug} frontmatter={w.frontmatter} />
        ))}
        <p className="mt-6 text-xs text-text-dark-dim">
          Smaller tools and one-off scripts live in{' '}
          <Link href="/lab" className="text-accent-dark underline underline-offset-2 decoration-accent-dark/40 hover:decoration-accent-dark">/lab</Link>.
        </p>
      </section>
    </main>
  )
}
