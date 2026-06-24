'use client'

import { useState } from 'react'

interface Verdict {
  hash: string
  cached: boolean
  rateLimit: { used: number; limit: number; window: string }
  threatScore: number
  verdict: 'clean' | 'suspicious' | 'malicious'
  family: string | null
  firstSeen: string
}

const SAMPLES: { label: string; hash: string; verdict: Verdict }[] = [
  {
    label: 'Known dropper',
    hash: 'a3f1c8e9d24b7a91f6e0bc847d2e1a83',
    verdict: {
      hash: 'a3f1c8e9d24b7a91f6e0bc847d2e1a83',
      cached: true,
      rateLimit: { used: 12, limit: 200, window: 'per minute' },
      threatScore: 96,
      verdict: 'malicious',
      family: 'Emotet (banker)',
      firstSeen: '2024-11-03',
    },
  },
  {
    label: 'Suspicious script',
    hash: 'bd5f2a48c9e171034ab8e4f7c2961bf1',
    verdict: {
      hash: 'bd5f2a48c9e171034ab8e4f7c2961bf1',
      cached: false,
      rateLimit: { used: 13, limit: 200, window: 'per minute' },
      threatScore: 58,
      verdict: 'suspicious',
      family: 'Downloader (heuristic)',
      firstSeen: '2026-04-09',
    },
  },
  {
    label: 'Clean binary',
    hash: '0fbc14e9aae0d62b3f8a3df2b4c5e6f7',
    verdict: {
      hash: '0fbc14e9aae0d62b3f8a3df2b4c5e6f7',
      cached: true,
      rateLimit: { used: 14, limit: 200, window: 'per minute' },
      threatScore: 4,
      verdict: 'clean',
      family: null,
      firstSeen: '2024-02-18',
    },
  },
]

const VERDICT_COLOR = {
  clean: 'text-accent-dark',
  suspicious: 'text-orange-400',
  malicious: 'text-red-400',
} as const

export default function HybridAnalysisCliDemo() {
  const [hash, setHash] = useState(SAMPLES[0].hash)
  const [out, setOut] = useState<Verdict | null>(null)
  const [loading, setLoading] = useState(false)

  function run(hashIn: string) {
    setOut(null)
    setLoading(true)
    setHash(hashIn)
    const match = SAMPLES.find((s) => s.hash === hashIn) ?? SAMPLES[0]
    setTimeout(() => {
      setOut(match.verdict)
      setLoading(false)
    }, 500)
  }

  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark">
        hybrid-analysis-cli / batch hash lookup with cache + rate-limit
      </div>
      <div className="bg-bg-dark p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s.label}
              onClick={() => run(s.hash)}
              className="text-xs font-mono px-3 py-1.5 border border-border-dark text-text-dark-dim hover:text-text-dark rounded"
            >
              {s.label}
            </button>
          ))}
        </div>

        <div>
          <div className="text-[10px] text-text-dark-mute uppercase tracking-widest font-mono mb-1">sha256 / md5</div>
          <input
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            className="w-full bg-bg-dark-panel text-text-dark text-xs font-mono p-2 border border-border-dark rounded"
          />
          <button
            onClick={() => run(hash)}
            disabled={loading}
            className="mt-2 text-xs font-mono border border-accent-dark text-accent-dark px-3 py-1.5 hover:bg-accent-dark/10 disabled:opacity-50 rounded"
          >
            {loading ? 'looking up...' : '$ ha-cli lookup'}
          </button>
        </div>

        <div className="bg-bg-dark-panel border border-border-dark rounded p-3 font-mono text-[11px] leading-relaxed text-text-dark-dim min-h-[180px]">
          {!out && !loading && <span className="text-text-dark-mute">// results appear here</span>}
          {loading && (
            <div>
              <div>$ ha-cli lookup --hash {hash}</div>
              <div>› cache lookup...</div>
              <div>› rate-limit check...</div>
              <div className="text-accent-dark">› querying hybrid-analysis API...</div>
            </div>
          )}
          {out && (
            <div className="space-y-1">
              <div>$ ha-cli lookup --hash {out.hash}</div>
              <div>
                rate-limit: <span className="text-text-dark">{out.rateLimit.used}/{out.rateLimit.limit}</span> {out.rateLimit.window}
              </div>
              <div>
                cache: <span className={out.cached ? 'text-accent-dark' : 'text-orange-400'}>{out.cached ? 'HIT' : 'MISS — fresh fetch'}</span>
              </div>
              <div className="border-t border-border-dark my-1" />
              <div>
                verdict: <span className={VERDICT_COLOR[out.verdict]}>{out.verdict}</span>
              </div>
              <div>
                threat_score: <span className="text-text-dark">{out.threatScore}</span>/100
              </div>
              <div>
                family: <span className="text-text-dark">{out.family ?? 'n/a'}</span>
              </div>
              <div>
                first_seen: <span className="text-text-dark">{out.firstSeen}</span>
              </div>
              <div className="border-t border-border-dark my-1" />
              <div className="text-text-dark-mute">// merged verdict written to ./cache/ha.db · ttl=24h</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
