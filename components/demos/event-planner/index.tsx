'use client'

import { useState } from 'react'

const AGENT_LOG = [
  { agent: 'venue_scout', message: 'Searching for venues matching capacity 80 + downtown radius...' },
  { agent: 'venue_scout', message: 'Found 3 candidates: The Vault (cap 90), Lincoln Hall (cap 75), Riverside Loft (cap 100).' },
  { agent: 'catering_planner', message: 'Soliciting menu options at price target $45/head...' },
  { agent: 'catering_planner', message: 'Selected: Roving stations (3 hot, 2 cold). Vegetarian option included.' },
  { agent: 'budget_steward', message: 'Reconciling venue + catering + AV + decor against $8K cap...' },
  { agent: 'budget_steward', message: 'Estimate within budget at $7,420. Buffer $580.' },
  { agent: 'lead_planner', message: 'Compiling proposal.' },
]

const FINAL_PLAN = `Event: Q3 Engineering Recognition Night
Venue:    The Vault (downtown, capacity 90)
Date:     Saturday Aug 15, 7-10pm
Catering: Roving stations × 5 (incl. vegetarian)
Budget:   $7,420 (cap $8,000, $580 buffer)
Staffing: Bartender × 2, photographer × 1
Theme:    "Ship & Celebrate"`

export default function EventPlannerDemo() {
  const [prompt, setPrompt] = useState('Plan a 75-person engineering recognition event under $8K')
  const [logIdx, setLogIdx] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  function plan() {
    setDone(false)
    setLogIdx(0)
    let i = 0
    const interval = setInterval(() => {
      i += 1
      if (i >= AGENT_LOG.length) {
        clearInterval(interval)
        setLogIdx(AGENT_LOG.length)
        setDone(true)
      } else {
        setLogIdx(i)
      }
    }, 700)
  }

  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark">
        event-planner / crewai / agent-log
      </div>
      <div className="p-4">
        <label className="text-xs text-text-dark-mute font-mono">prompt</label>
        <div className="flex gap-2 mt-1">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-bg-dark-panel text-text-dark text-xs font-mono p-2 border border-border-dark rounded"
          />
          <button
            onClick={plan}
            className="text-xs font-mono border border-accent-dark text-accent-dark px-3 hover:bg-accent-dark/10"
          >
            plan →
          </button>
        </div>

        {logIdx !== null && (
          <div className="mt-4 bg-bg-dark-panel border border-border-dark rounded p-3 font-mono text-xs space-y-1">
            {AGENT_LOG.slice(0, logIdx).map((line, i) => (
              <div key={i}>
                <span className="text-accent-dark">[{line.agent}]</span> <span className="text-text-dark">{line.message}</span>
              </div>
            ))}
            {!done && <div className="text-text-dark-mute">› thinking<span className="cursor-blink">▍</span></div>}
          </div>
        )}

        {done && (
          <pre className="mt-4 bg-bg-dark-panel border-l-2 border-accent-dark p-3 font-mono text-xs text-text-dark whitespace-pre-wrap">{FINAL_PLAN}</pre>
        )}
      </div>
    </div>
  )
}
