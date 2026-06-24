'use client'

import { useState } from 'react'

type Tool = 'session-replayer' | 'header-canonicalizer'

const SESSION_SAMPLE = `POST /api/orders HTTP/1.1
Host: shop.example.com
Cookie: sid=EXPIRED_TOKEN_abc123; csrf=old_csrf_xyz
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.expired

{"sku":"SK-491","qty":2}`

const SESSION_REWRITTEN = `POST /api/orders HTTP/1.1
Host: shop.example.com
Cookie: sid=fresh_session_q9f2a; csrf=42aaba9c-fresh
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.fresh_token_jwt

{"sku":"SK-491","qty":2}`

const HEADER_SAMPLE = `User-Agent: Mozilla/5.0 ...
Accept: application/json
accept: text/html
X-Forwarded-For: 10.0.0.1
x-forwarded-for: 10.0.0.2
CONTENT-TYPE: application/json
Authorization: Bearer abc
host: shop.example.com`

const HEADER_CANONICAL = `accept: application/json, text/html
authorization: Bearer abc
content-type: application/json
host: shop.example.com
user-agent: Mozilla/5.0 ...
x-forwarded-for: 10.0.0.1, 10.0.0.2

# notes
# - lowercased all names per RFC 7230
# - merged duplicate Accept and X-Forwarded-For values
# - sorted alphabetically for diffability`

export default function BurpExtensionsDemo() {
  const [tool, setTool] = useState<Tool>('session-replayer')

  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark">
        burp-extensions / two in-house extensions
      </div>
      <div className="bg-bg-dark">
        <div className="border-b border-border-dark flex">
          <button
            onClick={() => setTool('session-replayer')}
            className={`text-xs font-mono px-4 py-2 ${tool === 'session-replayer' ? 'text-accent-dark border-b border-accent-dark' : 'text-text-dark-dim hover:text-text-dark'}`}
          >
            session-replayer
          </button>
          <button
            onClick={() => setTool('header-canonicalizer')}
            className={`text-xs font-mono px-4 py-2 ${tool === 'header-canonicalizer' ? 'text-accent-dark border-b border-accent-dark' : 'text-text-dark-dim hover:text-text-dark'}`}
          >
            header-canonicalizer
          </button>
        </div>

        {tool === 'session-replayer' && (
          <SidePanel
            description="Replays a captured request with a freshly minted session. Tied into the team's OAuth helper so expired tokens auto-refresh before replay."
            beforeLabel="captured request (expired session)"
            before={SESSION_SAMPLE}
            afterLabel="replayed (session refreshed)"
            after={SESSION_REWRITTEN}
          />
        )}
        {tool === 'header-canonicalizer' && (
          <SidePanel
            description="Lowercases header names, merges duplicates per RFC 7230, sorts alphabetically. Turns 'is the response different because of header order or because of the change I made?' into a one-second answer."
            beforeLabel="raw headers"
            before={HEADER_SAMPLE}
            afterLabel="canonicalized"
            after={HEADER_CANONICAL}
          />
        )}
      </div>
    </div>
  )
}

function SidePanel({
  description, beforeLabel, before, afterLabel, after,
}: {
  description: string
  beforeLabel: string
  before: string
  afterLabel: string
  after: string
}) {
  const [src, setSrc] = useState(before)
  const [out, setOut] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function run() {
    setOut(null)
    setLoading(true)
    setTimeout(() => {
      setOut(after)
      setLoading(false)
    }, 300)
  }

  return (
    <div className="p-4 space-y-3">
      <div className="text-[11px] text-text-dark-dim leading-relaxed">{description}</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] text-text-dark-mute uppercase tracking-widest font-mono mb-2">{beforeLabel}</div>
          <textarea
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            rows={12}
            className="w-full bg-bg-dark-panel text-text-dark text-[11px] font-mono p-3 border border-border-dark rounded resize-none"
          />
          <button
            onClick={run}
            disabled={loading}
            className="mt-2 text-xs font-mono border border-accent-dark text-accent-dark px-3 py-1.5 hover:bg-accent-dark/10 disabled:opacity-50 rounded"
          >
            {loading ? 'processing...' : '→ process'}
          </button>
        </div>
        <div>
          <div className="text-[10px] text-text-dark-mute uppercase tracking-widest font-mono mb-2">{afterLabel}</div>
          {!out && !loading && <p className="text-xs text-text-dark-mute">Click process to see the output.</p>}
          {loading && <p className="text-xs text-accent-dark font-mono">› parsing ›› transforming...</p>}
          {out && (
            <pre className="bg-bg-dark-panel border border-border-dark rounded p-3 text-[11px] font-mono text-text-dark whitespace-pre-wrap">
              {out}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
