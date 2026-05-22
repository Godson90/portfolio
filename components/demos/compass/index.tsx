'use client'

import { useState } from 'react'
import { MOCK_FINDINGS, type MockFinding } from './data'

const severityClass = {
  CRITICAL: 'text-red-400',
  HIGH: 'text-orange-400',
  MEDIUM: 'text-yellow-400',
} as const

const decisionClass = {
  pending:     'bg-bg-dark-panel text-text-dark-dim',
  approved:    'bg-accent-dark/20 text-accent-dark',
  disapproved: 'bg-red-500/20 text-red-400',
} as const

export default function CompassDemo() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 1800)
  }

  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark">
        compass / dashboard / run #142
      </div>
      <table className="w-full text-sm">
        <thead className="text-xs text-text-dark-mute uppercase tracking-wider border-b border-border-dark">
          <tr>
            <th className="text-left px-4 py-2 font-normal">severity</th>
            <th className="text-left px-4 py-2 font-normal">browser</th>
            <th className="text-left px-4 py-2 font-normal">control</th>
            <th className="text-left px-4 py-2 font-normal">decision</th>
            <th className="text-right px-4 py-2 font-normal">flags</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_FINDINGS.map((f) => (
            <FindingRow
              key={f.id}
              finding={f}
              open={openId === f.id}
              onToggle={() => setOpenId(openId === f.id ? null : f.id)}
              onAction={(label) => showToast(`${label} — demo mode`)}
            />
          ))}
        </tbody>
      </table>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-accent-dark text-bg-dark text-xs px-4 py-2 rounded font-mono z-50">
          {toast}
        </div>
      )}
    </div>
  )
}

function FindingRow({
  finding, open, onToggle, onAction,
}: {
  finding: MockFinding
  open: boolean
  onToggle: () => void
  onAction: (label: string) => void
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className="border-b border-border-dark cursor-pointer hover:bg-bg-dark-panel"
      >
        <td className={`px-4 py-3 font-mono text-xs ${severityClass[finding.severity]}`}>{finding.severity}</td>
        <td className="px-4 py-3 font-mono text-xs">{finding.browser}</td>
        <td className="px-4 py-3 text-text-dark">{finding.controlId} · {finding.controlTitle}</td>
        <td className="px-4 py-3">
          <span className={`text-xs px-2 py-1 rounded font-mono ${decisionClass[finding.decision]}`}>
            {finding.decision}
          </span>
        </td>
        <td className="px-4 py-3 text-right text-xs">
          {finding.autoDecided && <span className="text-accent-dark font-mono">↻ auto</span>}
        </td>
      </tr>
      {open && (
        <tr className="border-b border-border-dark bg-bg-dark-panel">
          <td colSpan={5} className="px-6 py-5">
            <Section label="risk_summary">{finding.narrative.riskSummary}</Section>
            <Section label="why_it_matters">{finding.narrative.whyItMatters}</Section>
            <Section label="remediation_hint">{finding.narrative.remediationHint}</Section>
            <div className="mt-4 pt-3 border-t border-border-dark">
              <div className="text-[10px] text-accent-dark uppercase tracking-widest mb-1">CIS citation</div>
              <div className="font-mono text-xs text-text-dark">{finding.cisCitation.url}</div>
              <div className="text-xs text-text-dark-dim mt-1 italic">&quot;{finding.cisCitation.quote}&quot;</div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => onAction('Approve')} className="text-xs font-mono border border-accent-dark text-accent-dark px-3 py-1 hover:bg-accent-dark/10">
                Approve
              </button>
              <button onClick={() => onAction('Disapprove')} className="text-xs font-mono border border-border-dark text-text-dark-dim px-3 py-1 hover:bg-bg-dark">
                Disapprove
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="text-[10px] text-text-dark-mute uppercase tracking-widest mb-1 font-mono">{label}</div>
      <div className="text-xs text-text-dark leading-relaxed">{children}</div>
    </div>
  )
}
