'use client'

import { useState } from 'react'

interface Sample {
  label: string
  message: string
  iocs: { type: string; value: string; verdict: 'clean' | 'suspicious' | 'malicious' }[]
  score: number
  queue: string
  rationale: string
}

const SAMPLES: Sample[] = [
  {
    label: 'Clean newsletter',
    message: `From: "ACME Engineering Weekly" <newsletter@acme.dev>
To: jane.doe@company.com
Subject: This week in ACME — release 4.2 highlights
Date: Tue, 2026-04-08 09:01

Hey team,
Quick recap of release 4.2:
https://acme.dev/blog/release-4-2

Unsubscribe: https://acme.dev/unsub?u=jdoe`,
    iocs: [
      { type: 'sender_domain', value: 'acme.dev', verdict: 'clean' },
      { type: 'url', value: 'https://acme.dev/blog/release-4-2', verdict: 'clean' },
    ],
    score: 4,
    queue: 'dismiss',
    rationale: 'Sender domain matches subscribed-vendor list. No suspicious patterns. Dismissed automatically.',
  },
  {
    label: 'Suspicious lookalike',
    message: `From: "IT Helpdesk" <helpdesk@cornpany-it.com>
To: jane.doe@company.com
Subject: Action required: Verify your account
Date: Mon, 2026-04-07 14:22

Your mailbox quota is exceeded. Verify within 24 hours to avoid suspension:
hxxps://cornpany-it[.]com/verify?id=85f02

ITSupport
Sender IP: 185.220.101.42`,
    iocs: [
      { type: 'sender_domain', value: 'cornpany-it.com', verdict: 'suspicious' },
      { type: 'url', value: 'https://cornpany-it.com/verify', verdict: 'suspicious' },
      { type: 'sender_ip', value: '185.220.101.42', verdict: 'suspicious' },
    ],
    score: 67,
    queue: 'tier-2 review',
    rationale: 'Lookalike domain (cornpany vs company). Defanged URL pattern matches phishing kit. Sender IP on AbuseIPDB watchlist.',
  },
  {
    label: 'Known malicious',
    message: `From: "Payroll Admin" <payroll@securepay-portal.net>
To: jane.doe@company.com
Subject: Q1 bonus statement — please confirm
Date: Wed, 2026-04-09 03:14
Attachment: bonus_statement_Q1.zip (44 KB)

Open the attached file to view your bonus details. You will need to enable macros.

Thank you,
Payroll`,
    iocs: [
      { type: 'sender_domain', value: 'securepay-portal.net', verdict: 'malicious' },
      { type: 'attachment_sha256', value: 'a3f1...e8c2', verdict: 'malicious' },
      { type: 'macro_lure', value: '"enable macros" present', verdict: 'malicious' },
    ],
    score: 95,
    queue: 'escalate · IR pager',
    rationale: 'Attachment hash matches known dropper. Macro-enable lure present. Domain registered 11 days ago. Auto-quarantined; IR paged.',
  },
]

const VERDICT_COLOR = {
  clean: 'text-accent-dark',
  suspicious: 'text-orange-400',
  malicious: 'text-red-400',
} as const

const QUEUE_COLOR = {
  'dismiss': 'border-accent-dark text-accent-dark bg-accent-dark/5',
  'tier-2 review': 'border-orange-400 text-orange-400 bg-orange-400/5',
  'escalate · IR pager': 'border-red-400 text-red-400 bg-red-400/5',
} as const

export default function PhishingPstTriageDemo() {
  const [active, setActive] = useState(0)
  const s = SAMPLES[active]

  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark">
        phishing-pst-triage / parse → score → route
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] text-text-dark-mute uppercase tracking-widest font-mono mb-2">.pst entry</div>
            <pre className="bg-bg-dark-panel border border-border-dark rounded p-3 text-[10px] font-mono text-text-dark-dim whitespace-pre-wrap max-h-72 overflow-auto">
              {s.message}
            </pre>
          </div>
          <div>
            <div className="text-[10px] text-text-dark-mute uppercase tracking-widest font-mono mb-2">extracted IOCs (normalized JSON)</div>
            <div className="space-y-1">
              {s.iocs.map((ioc, i) => (
                <div key={i} className="text-[11px] font-mono border border-border-dark rounded p-2">
                  <div className="flex justify-between">
                    <span className="text-text-dark-mute">{ioc.type}</span>
                    <span className={VERDICT_COLOR[ioc.verdict]}>{ioc.verdict}</span>
                  </div>
                  <div className="text-text-dark break-all">{ioc.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[10px] text-text-dark-mute font-mono">
              triage_score: <span className="text-text-dark">{s.score}</span>/100
            </div>
          </div>
        </div>

        <div className={`border rounded p-3 ${QUEUE_COLOR[s.queue as keyof typeof QUEUE_COLOR]}`}>
          <div className="text-[10px] uppercase tracking-widest font-mono mb-1">routed to</div>
          <div className="text-sm font-medium font-mono mb-1">{s.queue}</div>
          <div className="text-[11px] text-text-dark-dim">{s.rationale}</div>
        </div>
      </div>
    </div>
  )
}
