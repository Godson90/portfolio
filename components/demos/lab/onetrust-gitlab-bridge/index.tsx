'use client'

import { useState } from 'react'

interface Verdict {
  verdict: 'approved' | 'blocked' | 'review-required'
  riskScore: number
  rationale: string
  assessmentId: string
  gitlabComment: string
}

interface Sample {
  label: string
  mrTitle: string
  labels: string[]
  verdict: Verdict
}

const SAMPLES: Sample[] = [
  {
    label: 'Routine MR',
    mrTitle: 'feat(ui): add user-settings toggle for email notifications',
    labels: ['feature', 'frontend'],
    verdict: {
      verdict: 'approved',
      riskScore: 12,
      rationale: 'No new data flow. No third-party integration. No auth surface change.',
      assessmentId: 'OT-2026-04812',
      gitlabComment: '✓ OneTrust: no DPIA required. Routine change — merge cleared.',
    },
  },
  {
    label: 'Touches PII',
    mrTitle: 'feat(api): export member contact details to CSV for support team',
    labels: ['feature', 'backend', 'data-access'],
    verdict: {
      verdict: 'review-required',
      riskScore: 64,
      rationale: 'Bulk PII export path detected. DPIA required before merge per GDPR Article 35.',
      assessmentId: 'OT-2026-04813',
      gitlabComment: '⚠ OneTrust: DPIA required before merge. Reviewer assigned: priya.s@corp. SLA 48h.',
    },
  },
  {
    label: 'New vendor',
    mrTitle: 'chore(integrations): wire Acme Analytics SDK into checkout flow',
    labels: ['integration', 'third-party-api'],
    verdict: {
      verdict: 'blocked',
      riskScore: 88,
      rationale: 'Vendor not in OneTrust register. Third-party risk assessment required before any merge.',
      assessmentId: 'OT-2026-04814',
      gitlabComment: '✗ OneTrust: BLOCKED — Acme Analytics has no completed vendor risk assessment. File one in OneTrust, then re-run the bridge.',
    },
  },
]

const VERDICT_COLOR = {
  approved: 'text-accent-dark border-accent-dark bg-accent-dark/5',
  'review-required': 'text-yellow-400 border-yellow-400 bg-yellow-400/5',
  blocked: 'text-red-400 border-red-400 bg-red-400/5',
} as const

export default function OneTrustGitlabBridgeDemo() {
  const [active, setActive] = useState(0)
  const s = SAMPLES[active]

  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark">
        onetrust-gitlab-bridge / gitlab MR → onetrust assessment lookup → gitlab comment
      </div>
      <div className="bg-bg-dark p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {SAMPLES.map((sa, i) => (
            <button
              key={sa.label}
              onClick={() => setActive(i)}
              className={`text-xs font-mono px-3 py-1.5 border rounded ${
                i === active ? 'border-accent-dark text-accent-dark bg-accent-dark/10' : 'border-border-dark text-text-dark-dim hover:text-text-dark'
              }`}
            >
              {sa.label}
            </button>
          ))}
        </div>

        <div className="border border-border-dark rounded p-3 space-y-1">
          <div className="text-[10px] text-text-dark-mute uppercase tracking-widest font-mono">GitLab MR</div>
          <div className="text-xs text-text-dark font-mono">{s.mrTitle}</div>
          <div className="flex flex-wrap gap-1 pt-1">
            {s.labels.map((l) => (
              <span key={l} className="text-[10px] font-mono border border-border-dark text-text-dark-dim px-1.5 py-0.5 rounded">
                {l}
              </span>
            ))}
          </div>
        </div>

        <div className="border border-border-dark rounded p-3 font-mono text-[11px] text-text-dark-dim leading-relaxed">
          <div className="text-text-dark-mute mb-1">{`// bridge.py — onetrust lookup`}</div>
          <div>POST /v3/assessments/lookup?labels={s.labels.join(',')}</div>
          <div className="text-accent-dark">200 OK</div>
          <div>{`{`}</div>
          <div className="pl-3">&quot;assessment_id&quot;: &quot;{s.verdict.assessmentId}&quot;,</div>
          <div className="pl-3">&quot;risk_score&quot;: {s.verdict.riskScore},</div>
          <div className="pl-3">&quot;verdict&quot;: &quot;{s.verdict.verdict}&quot;</div>
          <div>{`}`}</div>
        </div>

        <div className={`border rounded p-3 ${VERDICT_COLOR[s.verdict.verdict]}`}>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[10px] uppercase tracking-widest font-mono">Verdict</span>
            <span className="text-[10px] font-mono">risk {s.verdict.riskScore}/100</span>
          </div>
          <div className="text-sm font-medium mb-1">{s.verdict.verdict}</div>
          <div className="text-[11px] text-text-dark-dim">{s.verdict.rationale}</div>
        </div>

        <div className="border border-border-dark rounded p-3">
          <div className="text-[10px] text-text-dark-mute uppercase tracking-widest font-mono mb-1">GitLab comment posted</div>
          <div className="text-xs text-text-dark font-mono">{s.verdict.gitlabComment}</div>
        </div>
      </div>
    </div>
  )
}
