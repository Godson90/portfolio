'use client'

import { useEffect, useRef, useState } from 'react'

type Action = 'add' | 'remove' | 'in-sync'

interface DeviceState {
  hostname: string
  inAD: boolean
  falconTag: string | null
  desiredTag: string
  action: Action
}

interface Wave {
  key: string
  label: string
  tag: string
  devices: DeviceState[]
  direction: 'add-only' | 'add-and-remove'
}

const WAVES: Wave[] = [
  {
    key: 'patch-test',
    label: 'ServerPatchTest',
    tag: 'WIN_PATCH_TEST',
    direction: 'add-only',
    devices: [
      { hostname: 'win-test-01', inAD: true, falconTag: 'WIN_PATCH_TEST', desiredTag: 'WIN_PATCH_TEST', action: 'in-sync' },
      { hostname: 'win-test-02', inAD: true, falconTag: null, desiredTag: 'WIN_PATCH_TEST', action: 'add' },
      { hostname: 'win-test-03', inAD: true, falconTag: null, desiredTag: 'WIN_PATCH_TEST', action: 'add' },
      { hostname: 'win-test-04', inAD: true, falconTag: 'WIN_PATCH_TEST', desiredTag: 'WIN_PATCH_TEST', action: 'in-sync' },
    ],
  },
  {
    key: 'patch-pilot',
    label: 'ServerPatchPilot',
    tag: 'WIN_PATCH_PILOT',
    direction: 'add-only',
    devices: [
      { hostname: 'win-pilot-01', inAD: true, falconTag: 'WIN_PATCH_PILOT', desiredTag: 'WIN_PATCH_PILOT', action: 'in-sync' },
      { hostname: 'win-pilot-02', inAD: true, falconTag: null, desiredTag: 'WIN_PATCH_PILOT', action: 'add' },
      { hostname: 'win-pilot-03', inAD: true, falconTag: 'WIN_PATCH_PILOT', desiredTag: 'WIN_PATCH_PILOT', action: 'in-sync' },
    ],
  },
  {
    key: 'patch-prod',
    label: 'ServerPatchProd',
    tag: 'WIN_PATCH_PROD',
    direction: 'add-only',
    devices: [
      { hostname: 'app-prod-01', inAD: true, falconTag: 'WIN_PATCH_PROD', desiredTag: 'WIN_PATCH_PROD', action: 'in-sync' },
      { hostname: 'app-prod-02', inAD: true, falconTag: null, desiredTag: 'WIN_PATCH_PROD', action: 'add' },
      { hostname: 'db-prod-04', inAD: true, falconTag: 'WIN_PATCH_PROD', desiredTag: 'WIN_PATCH_PROD', action: 'in-sync' },
      { hostname: 'web-prod-09', inAD: true, falconTag: null, desiredTag: 'WIN_PATCH_PROD', action: 'add' },
      { hostname: 'web-prod-10', inAD: true, falconTag: 'WIN_PATCH_PROD', desiredTag: 'WIN_PATCH_PROD', action: 'in-sync' },
    ],
  },
  {
    key: 'dlp-allow',
    label: 'DLP-AllowWrite (bidirectional)',
    tag: 'DLP_REMOVABLE_ALLOW',
    direction: 'add-and-remove',
    devices: [
      { hostname: 'laptop-fin-12', inAD: true, falconTag: 'DLP_REMOVABLE_ALLOW', desiredTag: 'DLP_REMOVABLE_ALLOW', action: 'in-sync' },
      { hostname: 'laptop-fin-22', inAD: true, falconTag: null, desiredTag: 'DLP_REMOVABLE_ALLOW', action: 'add' },
      { hostname: 'laptop-hr-04', inAD: false, falconTag: 'DLP_REMOVABLE_ALLOW', desiredTag: 'DLP_REMOVABLE_ALLOW', action: 'remove' },
      { hostname: 'laptop-eng-31', inAD: true, falconTag: 'DLP_REMOVABLE_ALLOW', desiredTag: 'DLP_REMOVABLE_ALLOW', action: 'in-sync' },
    ],
  },
]

const ACTION_COLOR: Record<Action, string> = {
  'in-sync': 'border-border-dark text-text-dark-dim',
  add: 'border-accent-dark text-accent-dark bg-accent-dark/5',
  remove: 'border-orange-400 text-orange-400 bg-orange-400/5',
}

const ACTION_LABEL: Record<Action, string> = {
  'in-sync': 'in-sync',
  add: 'tag missing → PATCH add',
  remove: 'tag orphaned → PATCH remove',
}

interface LogLine {
  level: 'INFO' | 'WARNING' | 'ERROR'
  text: string
}

const LEVEL_COLOR: Record<LogLine['level'], string> = {
  INFO: 'text-text-dark-dim',
  WARNING: 'text-orange-400',
  ERROR: 'text-red-400',
}

export default function CrowdStrikeTagSyncDemo() {
  const [waveKey, setWaveKey] = useState<string>(WAVES[0].key)
  const [snapshot, setSnapshot] = useState<DeviceState[]>(WAVES[0].devices)
  const [logs, setLogs] = useState<LogLine[]>([])
  const [running, setRunning] = useState(false)
  const [synced, setSynced] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const wave = WAVES.find((w) => w.key === waveKey)!

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  function pickWave(key: string) {
    if (timerRef.current) clearTimeout(timerRef.current)
    setWaveKey(key)
    const w = WAVES.find((x) => x.key === key)!
    setSnapshot(w.devices)
    setLogs([])
    setRunning(false)
    setSynced(false)
  }

  function runSync() {
    if (running) return
    setRunning(true)
    setSynced(false)
    setLogs([
      { level: 'INFO', text: `wave=${wave.label} :: AD pull via Get-ADGroupMember -Recursive` },
      { level: 'INFO', text: `wave=${wave.label} :: ${wave.devices.length} members resolved` },
    ])
    const order = wave.devices.map((_, i) => i)
    const next = wave.devices.map((d) => ({ ...d }))

    const step = (i: number) => {
      if (i >= order.length) {
        setLogs((l) => [...l, { level: 'INFO', text: `wave=${wave.label} :: pass complete (${next.filter((d) => d.action !== 'in-sync').length} mutations)` }])
        setRunning(false)
        setSynced(true)
        return
      }
      const idx = order[i]
      const d = next[idx]
      if (d.action === 'in-sync') {
        setLogs((l) => [...l, { level: 'INFO', text: `${d.hostname} :: tag '${d.desiredTag}' already applied` }])
      } else if (d.action === 'add') {
        d.falconTag = d.desiredTag
        d.action = 'in-sync'
        setLogs((l) => [...l, { level: 'INFO', text: `${d.hostname} :: PATCH /devices/entities/devices/tags/v1 add=${d.desiredTag} → 202` }])
      } else if (d.action === 'remove') {
        d.falconTag = null
        d.action = 'in-sync'
        setLogs((l) => [...l, { level: 'INFO', text: `${d.hostname} :: PATCH /devices/entities/devices/tags/v1 remove=${d.desiredTag} → 202` }])
      }
      setSnapshot([...next])
      timerRef.current = setTimeout(() => step(i + 1), 380)
    }

    timerRef.current = setTimeout(() => step(0), 250)
  }

  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark">
        crowdstrike-tag-sync / AD groups → Falcon device tags, idempotent
      </div>
      <div className="bg-bg-dark p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {WAVES.map((w) => (
            <button
              key={w.key}
              onClick={() => pickWave(w.key)}
              className={`text-xs font-mono px-3 py-1.5 border rounded ${
                w.key === waveKey ? 'border-accent-dark text-accent-dark bg-accent-dark/10' : 'border-border-dark text-text-dark-dim hover:text-text-dark'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3 items-baseline">
          <button
            onClick={runSync}
            disabled={running}
            className="text-xs font-mono border border-accent-dark text-accent-dark px-3 py-1.5 hover:bg-accent-dark/10 disabled:opacity-50 rounded"
          >
            {running ? 'syncing...' : synced ? '↻ replay sync' : '▶ run sync pass'}
          </button>
          <span className="text-[10px] text-text-dark-mute font-mono">
            direction: {wave.direction}
          </span>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-3">
          <div>
            <div className="text-[10px] text-text-dark-mute uppercase tracking-widest font-mono mb-2">Device state</div>
            <div className="space-y-1">
              {snapshot.map((d) => (
                <div
                  key={d.hostname}
                  className={`border rounded px-3 py-2 text-[11px] font-mono transition-colors ${ACTION_COLOR[d.action]}`}
                >
                  <div className="flex justify-between">
                    <span className="text-text-dark">{d.hostname}</span>
                    <span className="text-[10px] uppercase tracking-widest">{ACTION_LABEL[d.action]}</span>
                  </div>
                  <div className="text-text-dark-mute text-[10px] mt-0.5 flex gap-3">
                    <span>AD: {d.inAD ? '✓ in group' : '✗ removed'}</span>
                    <span>Falcon: {d.falconTag ? d.falconTag : '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-text-dark-mute uppercase tracking-widest font-mono mb-2">Run log</div>
            <div className="bg-bg-dark-panel border border-border-dark rounded p-2 font-mono text-[10px] leading-relaxed h-[260px] overflow-auto">
              {logs.length === 0 && <span className="text-text-dark-mute">// click run to start a sync pass</span>}
              {logs.map((l, i) => (
                <div key={i}>
                  <span className={`${LEVEL_COLOR[l.level]} mr-2`}>[{l.level}]</span>
                  <span className="text-text-dark-dim">{l.text}</span>
                </div>
              ))}
              {synced && (
                <div className="mt-1 pt-1 border-t border-border-dark text-accent-dark">
                  ✓ all devices in sync · pass safe to re-run (no-op)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
