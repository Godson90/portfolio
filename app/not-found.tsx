import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="max-w-wide mx-auto px-8 py-32 font-mono">
      <div className="text-sm text-accent-dark mb-4">$ cd /that-page</div>
      <div className="text-sm text-text-dark-dim mb-12">bash: /that-page: No such file or directory</div>
      <div className="flex gap-6 text-sm">
        <Link href="/" className="border border-border-dark px-3 py-2 no-underline hover:bg-bg-dark-panel">[ home ]</Link>
        <Link href="/work" className="border border-border-dark px-3 py-2 no-underline hover:bg-bg-dark-panel">[ work ]</Link>
        <Link href="/about" className="border border-border-dark px-3 py-2 no-underline hover:bg-bg-dark-panel">[ about ]</Link>
      </div>
    </main>
  )
}
