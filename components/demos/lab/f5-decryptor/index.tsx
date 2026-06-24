'use client'

import { useState } from 'react'

const SAMPLE_CONFIG = `# /config/bigip.conf  (excerpt — sanitized)
auth user admin {
    description "BIG-IP Admin"
    encrypted-password $M$gj$NTPGlnzM5n3Y/qy6dHJyq7
    partition-access {
        all-partitions {
            role admin
        }
    }
    shell tmsh
}
auth radius-server raidus-corp {
    server 10.42.7.18
    secret $M$pE$VfYNzqL2nO9bGmDc1cT4kQ
}
profile clientssl wildcard-corp {
    cert /Common/wildcard.corp.crt
    key /Common/wildcard.corp.key
    passphrase $M$rh$qZ8hX1lwQ4mUaJyt0kFvPa
}`

interface DecodedRow {
  field: string
  ciphertext: string
  plaintext: string
  context: string
}

const DECODED: DecodedRow[] = [
  {
    field: 'admin user password',
    ciphertext: '$M$gj$NTPGlnzM5n3Y/qy6dHJyq7',
    plaintext: 'BigBlue!2023#admin',
    context: 'auth user admin · role admin · partition all-partitions',
  },
  {
    field: 'RADIUS shared secret',
    ciphertext: '$M$pE$VfYNzqL2nO9bGmDc1cT4kQ',
    plaintext: 'radius-shared-key-9af2cd',
    context: 'auth radius-server raidus-corp · server 10.42.7.18',
  },
  {
    field: 'TLS keystore passphrase',
    ciphertext: '$M$rh$qZ8hX1lwQ4mUaJyt0kFvPa',
    plaintext: 'wildcard-cert-pass-2024Q1',
    context: 'profile clientssl wildcard-corp · /Common/wildcard.corp.crt',
  },
]

export default function F5DecryptorDemo() {
  const [config, setConfig] = useState(SAMPLE_CONFIG)
  const [out, setOut] = useState<DecodedRow[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [reveal, setReveal] = useState(false)

  function run() {
    setOut(null)
    setLoading(true)
    setReveal(false)
    setTimeout(() => {
      setOut(DECODED)
      setLoading(false)
    }, 500)
  }

  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark">
        f5-decryptor / BIG-IP $M$ credential blocks
      </div>
      <div className="bg-bg-dark p-4 grid grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] text-text-dark-mute uppercase tracking-widest font-mono mb-2">bigip.conf (paste / edit)</div>
          <textarea
            value={config}
            onChange={(e) => setConfig(e.target.value)}
            rows={14}
            className="w-full bg-bg-dark-panel text-text-dark text-[11px] font-mono p-3 border border-border-dark rounded resize-none"
          />
          <button
            onClick={run}
            disabled={loading}
            className="mt-2 text-xs font-mono border border-accent-dark text-accent-dark px-3 py-1.5 hover:bg-accent-dark/10 disabled:opacity-50 rounded"
          >
            {loading ? 'decrypting...' : '🔓 decrypt $M$ blocks'}
          </button>
        </div>
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[10px] text-text-dark-mute uppercase tracking-widest font-mono">recovered secrets</span>
            {out && (
              <button
                onClick={() => setReveal((r) => !r)}
                className="text-[10px] font-mono text-accent-dark hover:underline"
              >
                {reveal ? 'hide' : 'reveal'}
              </button>
            )}
          </div>
          {!out && !loading && <p className="text-xs text-text-dark-mute">Click decrypt to see recovered credentials.</p>}
          {loading && <p className="text-xs text-accent-dark font-mono">› parsing $M$ blocks ›› xor-decode ›› verify...</p>}
          {out && (
            <div className="space-y-2">
              {out.map((r) => (
                <div key={r.field} className="border border-border-dark rounded p-2 text-[11px]">
                  <div className="text-text-dark-dim font-mono">{r.field}</div>
                  <div className="text-text-dark-mute text-[10px] font-mono break-all mt-0.5">{r.ciphertext}</div>
                  <div className={`mt-1 font-mono ${reveal ? 'text-accent-dark' : 'text-text-dark-mute'}`}>
                    {reveal ? r.plaintext : '•'.repeat(Math.min(r.plaintext.length, 24))}
                  </div>
                  <div className="text-[10px] text-text-dark-mute mt-1 italic">{r.context}</div>
                </div>
              ))}
              <div className="text-[10px] text-text-dark-mute font-mono pt-1 border-t border-border-dark">
                audit: 3 secrets recovered → logged to ir-case-2024-117 (sha256 of source = a4f1...)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
