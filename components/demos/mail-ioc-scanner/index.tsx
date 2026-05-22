'use client'

import { useState } from 'react'

const SAMPLE_EMAIL = `From: "IT Helpdesk" <no-reply@acmecorp-secure.com>
To: jane.doe@company.com
Subject: ACTION REQUIRED: Your mailbox is full
Date: Mon, 22 May 2026 09:14:00 -0400

Your Office 365 mailbox has exceeded its quota.
Click below to verify your identity and free up space:

http://acmecorp-secure.com/login?id=85f02

Sender IP: 185.220.101.42

Failure to verify within 24 hours will result in service suspension.`

interface IOC {
  type: 'url' | 'ip' | 'sender' | 'domain'
  value: string
  vt: 'clean' | 'malicious' | 'suspicious'
  urlscan?: 'malicious' | 'pending'
  abuseipdb?: number
}

const MOCK_RESULTS: IOC[] = [
  { type: 'url', value: 'http://acmecorp-secure.com/login?id=85f02', vt: 'malicious', urlscan: 'malicious' },
  { type: 'ip',  value: '185.220.101.42', vt: 'malicious', abuseipdb: 87 },
  { type: 'sender', value: 'no-reply@acmecorp-secure.com', vt: 'suspicious' },
  { type: 'domain', value: 'acmecorp-secure.com', vt: 'malicious' },
]

const VERDICT_COLOR = {
  malicious: 'text-red-400',
  suspicious: 'text-orange-400',
  clean: 'text-accent-dark',
  pending: 'text-text-dark-mute',
} as const

export default function MailIocDemo() {
  const [email, setEmail] = useState(SAMPLE_EMAIL)
  const [results, setResults] = useState<IOC[] | null>(null)
  const [loading, setLoading] = useState(false)

  function extract() {
    setLoading(true)
    setResults(null)
    setTimeout(() => {
      setResults(MOCK_RESULTS)
      setLoading(false)
    }, 700)
  }

  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark">
        mail-ioc-scanner / paste-and-extract
      </div>
      <div className="grid grid-cols-2 gap-px bg-border-dark">
        <div className="bg-bg-dark p-4">
          <div className="text-xs text-text-dark-mute mb-2 font-mono">message_source.eml</div>
          <textarea
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            rows={14}
            className="w-full bg-bg-dark-panel text-text-dark text-xs font-mono p-3 border border-border-dark rounded resize-none"
          />
          <button
            onClick={extract}
            disabled={loading}
            className="mt-3 text-xs font-mono border border-accent-dark text-accent-dark px-3 py-2 hover:bg-accent-dark/10 disabled:opacity-50"
          >
            {loading ? 'extracting...' : 'extract IOCs →'}
          </button>
        </div>
        <div className="bg-bg-dark p-4">
          <div className="text-xs text-text-dark-mute mb-2 font-mono">enrichment_results.json</div>
          {!results && !loading && <p className="text-xs text-text-dark-mute">Click &quot;extract IOCs&quot; to see seeded results.</p>}
          {loading && <p className="text-xs text-accent-dark font-mono">› vt.lookup ›› urlscan.io ›› abuseipdb...</p>}
          {results && (
            <div className="space-y-2">
              {results.map((ioc, i) => (
                <div key={i} className="border border-border-dark rounded p-3 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-text-dark-mute font-mono uppercase">{ioc.type}</span>
                    <span className={`font-mono ${VERDICT_COLOR[ioc.vt]}`}>vt: {ioc.vt}</span>
                  </div>
                  <div className="text-text-dark font-mono break-all">{ioc.value}</div>
                  <div className="mt-1 text-text-dark-dim text-[10px] font-mono">
                    {ioc.urlscan && <>urlscan: <span className={VERDICT_COLOR[ioc.urlscan]}>{ioc.urlscan}</span> · </>}
                    {ioc.abuseipdb !== undefined && <>abuseipdb: <span className="text-red-400">{ioc.abuseipdb}/100</span></>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
