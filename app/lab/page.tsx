import { listLabEntries } from '@/lib/lab'
import { LabRow } from '@/components/ui/LabRow'

export const metadata = { title: 'Lab' }

export default function Lab() {
  const entries = listLabEntries()
  return (
    <main className="max-w-wide mx-auto px-8 py-16">
      <div className="text-xs text-accent-dark mb-3 tracking-wide font-mono">
        $ ls lab/
      </div>
      <h1 className="text-3xl font-medium text-text-dark mb-3">Lab</h1>
      <p className="text-sm text-text-dark-dim mb-3 max-w-prose">
        Smaller projects and one-off scripts. The selected_work catalog is where I put projects with a design story worth a write-up; the lab is where the day-to-day toolbox lives.
      </p>
      <p className="text-sm text-text-dark-dim mb-3 max-w-prose">
        Most of these started as a single annoying problem on a Monday 🙂: suspected malware we needed to detonate, a PST we needed to triage, a config we needed to decrypt during an IR. They earned a name and a folder because they kept being useful after the original problem went away. None of them are demos. They are tools — used in real investigations, real audits, real change windows.
      </p>
      <p className="text-xs text-text-dark-mute mb-12 max-w-prose">
        Click any row to expand an interactive demo. Listed in reverse-chronological order.
      </p>
      <div className="border-t border-border-dark">
        {entries.map((e) => (
          <LabRow key={e.slug} entry={e} />
        ))}
      </div>
    </main>
  )
}
