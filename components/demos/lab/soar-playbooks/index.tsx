'use client'

import { useEffect, useRef, useState } from 'react'

interface Stage {
  label: string
  detail: string
}

interface Playbook {
  alert: string
  severity: 'High' | 'Medium' | 'Critical'
  stages: Stage[]
  outcome: string
}

const PLAYBOOKS: Record<string, Playbook> = {
  brute_force: {
    alert: 'Sentinel: Brute-force burst on admin@corp.local',
    severity: 'High',
    stages: [
      { label: 'Receive alert', detail: '47 failed sign-ins in 90s from 185.220.101.42' },
      { label: 'Enrich (IP geo, ASN, AbuseIPDB)', detail: 'Tor exit · ASN 4224 · AbuseIPDB 87/100' },
      { label: 'Decide (severity threshold)', detail: 'Score = 92 → escalate' },
      { label: 'Act: block IP at Front Door + Conditional Access', detail: 'Front Door rule, CA policy revision committed' },
    ],
    outcome: 'IP blocked. Account session revoked. Ticket SOC-4821 created with full chain of custody.',
  },
  dlp_exfil: {
    alert: 'Defender for Cloud Apps: PII exfil attempt via OneDrive share',
    severity: 'Critical',
    stages: [
      { label: 'Receive alert', detail: 'External share of 3,400-row CSV by user jdoe' },
      { label: 'Enrich (file class, user risk)', detail: 'File matches SSN regex · user has 2 prior alerts' },
      { label: 'Decide', detail: 'Critical match + repeat actor → auto-action' },
      { label: 'Act: quarantine file + disable share + notify HR/Legal', detail: 'OneDrive share link revoked, file moved to Legal Hold container' },
    ],
    outcome: 'Share killed in 38 seconds. HR/Legal looped in. User\'s session revoked pending interview.',
  },
  suspicious_login: {
    alert: 'Entra ID: Impossible travel — sign-in from Lagos then Sydney within 2h',
    severity: 'Medium',
    stages: [
      { label: 'Receive alert', detail: 'sign-in 1: Lagos NG · sign-in 2: Sydney AU 1h54m later' },
      { label: 'Enrich (device, network, prior sessions)', detail: 'Sydney device unknown, no MFA challenge satisfied' },
      { label: 'Decide', detail: 'No legitimate travel ticket on file → treat as compromise' },
      { label: 'Act: disable account + revoke tokens + open ticket', detail: 'User disabled, refresh tokens revoked, manager notified' },
    ],
    outcome: 'Account locked. Helpdesk reaches out via verified phone before reenable.',
  },
}

const SEVERITY_COLOR = {
  High: 'text-orange-400',
  Critical: 'text-red-400',
  Medium: 'text-yellow-400',
} as const

export default function SoarPlaybooksDemo() {
  const [active, setActive] = useState<keyof typeof PLAYBOOKS>('brute_force')
  const [step, setStep] = useState(-1)
  const [running, setRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pb = PLAYBOOKS[active]

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  function pick(key: keyof typeof PLAYBOOKS) {
    if (timerRef.current) clearTimeout(timerRef.current)
    setActive(key)
    setStep(-1)
    setRunning(false)
  }

  function play() {
    if (running) return
    setStep(-1)
    setRunning(true)
    const advance = (i: number) => {
      setStep(i)
      if (i < pb.stages.length - 1) {
        timerRef.current = setTimeout(() => advance(i + 1), 750)
      } else {
        setRunning(false)
      }
    }
    timerRef.current = setTimeout(() => advance(0), 200)
  }

  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark">
        soar-playbooks / sentinel + logic apps
      </div>
      <div className="bg-bg-dark p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PLAYBOOKS) as Array<keyof typeof PLAYBOOKS>).map((key) => (
            <button
              key={key}
              onClick={() => pick(key)}
              className={`text-xs font-mono px-3 py-1.5 border rounded ${
                key === active ? 'border-accent-dark text-accent-dark bg-accent-dark/10' : 'border-border-dark text-text-dark-dim hover:text-text-dark'
              }`}
            >
              {key.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="border border-border-dark rounded p-3">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[10px] text-text-dark-mute uppercase tracking-widest font-mono">Alert</span>
            <span className={`text-[10px] font-mono ${SEVERITY_COLOR[pb.severity]}`}>{pb.severity}</span>
          </div>
          <div className="text-xs text-text-dark font-mono">{pb.alert}</div>
        </div>

        <button
          onClick={play}
          disabled={running}
          className="text-xs font-mono border border-accent-dark text-accent-dark px-3 py-1.5 hover:bg-accent-dark/10 disabled:opacity-50 rounded"
        >
          {running ? 'running...' : step === pb.stages.length - 1 ? '↻ replay playbook' : '▶ play playbook'}
        </button>

        <ol className="space-y-2">
          {pb.stages.map((stg, i) => {
            const done = step >= i
            return (
              <li
                key={stg.label}
                className={`border rounded p-3 transition-colors ${done ? 'border-accent-dark bg-accent-dark/5' : 'border-border-dark bg-bg-dark opacity-60'}`}
              >
                <div className="flex items-baseline gap-2">
                  <span className={`text-[10px] font-mono ${done ? 'text-accent-dark' : 'text-text-dark-mute'}`}>0{i + 1}</span>
                  <span className={`text-xs font-medium ${done ? 'text-text-dark' : 'text-text-dark-dim'}`}>{stg.label}</span>
                </div>
                {done && <div className="text-[11px] text-text-dark-dim mt-1 font-mono">{stg.detail}</div>}
              </li>
            )
          })}
        </ol>

        {step === pb.stages.length - 1 && (
          <div className="border border-accent-dark rounded p-3 bg-accent-dark/5">
            <div className="text-[10px] text-accent-dark uppercase tracking-widest font-mono mb-1">Outcome</div>
            <div className="text-xs text-text-dark">{pb.outcome}</div>
          </div>
        )}
      </div>
    </div>
  )
}
