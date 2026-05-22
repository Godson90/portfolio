import About from '@/content/about.mdx'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <main>
      <section className="max-w-wide mx-auto px-8 py-16">
        <div className="text-xs text-accent-dark mb-3 tracking-wide font-mono">
          $ cat about.md
        </div>
        <h1 className="text-3xl font-medium text-text-dark">About</h1>
      </section>
      <section className="reading-mode">
        <article className="max-w-prose mx-auto px-8 py-16">
          <About />

          <hr className="my-12 border-border-light" />

          <p className="text-base">
            <a href="https://www.linkedin.com/" className="font-mono">LinkedIn ↗</a>
            {' · '}
            <a href="https://github.com/" className="font-mono">GitHub ↗</a>
            {' · '}
            <a href="mailto:contact@example.com" className="font-mono">contact@example.com</a>
          </p>
          <p className="mt-4 text-sm">
            <a href="/resume.pdf" className="font-mono">→ download resume.pdf</a>
          </p>
        </article>
      </section>
    </main>
  )
}
