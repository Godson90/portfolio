import Link from 'next/link'

export function SiteNav() {
  return (
    <nav className="border-b border-border-dark">
      <div className="max-w-wide mx-auto px-8 py-4 flex items-center gap-8 text-xs">
        <Link href="/" className="text-accent-dark font-semibold no-underline hover:no-underline">
          <span className="text-text-dark-mute">~/</span>godsonadeola.dev
        </Link>
        <Link href="/work" className="text-text-dark no-underline hover:text-accent-dark">work</Link>
        <Link href="/lab" className="text-text-dark no-underline hover:text-accent-dark">lab</Link>
        <Link href="/about" className="text-text-dark no-underline hover:text-accent-dark">about</Link>
        <a
          href="mailto:contact@example.com"
          className="ml-auto text-accent-dark no-underline hover:underline"
        >
          contact →
        </a>
      </div>
    </nav>
  )
}
