export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-auto border-t border-border-dark">
      <div className="max-w-wide mx-auto px-8 py-6 text-xs text-text-dark-mute flex items-center justify-between">
        <span>© {year} Godson Adeola</span>
        <span>
          <span className="text-text-dark-dim">// </span>
          built with Next.js + Vercel
        </span>
      </div>
    </footer>
  )
}
