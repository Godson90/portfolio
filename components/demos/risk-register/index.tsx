'use client'

import { useState } from 'react'
import { MOCK_RISKS, type MockRisk } from './data'

const COLOR = (score: number) => {
  if (score >= 16) return 'bg-red-500/40'
  if (score >= 9)  return 'bg-orange-400/40'
  if (score >= 4)  return 'bg-yellow-400/30'
  return 'bg-accent-dark/20'
}

export default function RiskRegisterDemo() {
  const [selected, setSelected] = useState<MockRisk | null>(null)

  const cellRisks: Record<string, MockRisk[]> = {}
  for (const r of MOCK_RISKS) {
    const key = `${r.likelihood}-${r.impact}`
    cellRisks[key] = cellRisks[key] || []
    cellRisks[key].push(r)
  }

  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark">
        risk-register / heat-map / Q2 2026
      </div>
      <div className="grid grid-cols-[60px_1fr_280px]">
        <div className="flex flex-col-reverse justify-around items-center text-[10px] text-text-dark-mute font-mono px-2 py-4">
          <span>impact →</span>
        </div>

        <div className="grid grid-cols-5 grid-rows-5 gap-1 p-4">
          {[5, 4, 3, 2, 1].map((impact) =>
            [1, 2, 3, 4, 5].map((likelihood) => {
              const score = likelihood * impact
              const risks = cellRisks[`${likelihood}-${impact}`] || []
              return (
                <div
                  key={`${likelihood}-${impact}`}
                  className={`aspect-square ${COLOR(score)} border border-border-dark rounded relative flex items-center justify-center`}
                >
                  {risks.map((r, i) => (
                    <button
                      key={r.id}
                      onClick={() => setSelected(r)}
                      title={r.title}
                      className="w-6 h-6 rounded-full bg-text-dark/80 hover:bg-accent-dark text-bg-dark text-[10px] font-mono font-semibold absolute"
                      style={{ left: `${20 + i * 18}%`, top: `${30 + i * 12}%` }}
                    >
                      {r.id.toUpperCase()}
                    </button>
                  ))}
                </div>
              )
            })
          )}
        </div>

        <aside className="border-l border-border-dark p-4 text-xs">
          {!selected && <p className="text-text-dark-mute">Click a risk dot.</p>}
          {selected && (
            <>
              <div className="text-accent-dark text-[10px] uppercase tracking-widest mb-2 font-mono">{selected.id}</div>
              <h4 className="text-text-dark mb-3 leading-snug">{selected.title}</h4>
              <dl className="grid grid-cols-[80px_1fr] gap-y-1 text-xs">
                <dt className="text-text-dark-mute">owner</dt><dd>{selected.owner}</dd>
                <dt className="text-text-dark-mute">L × I</dt><dd>{selected.likelihood} × {selected.impact} = {selected.likelihood * selected.impact}</dd>
                <dt className="text-text-dark-mute">status</dt><dd className="font-mono">{selected.mitigationStatus}</dd>
              </dl>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
