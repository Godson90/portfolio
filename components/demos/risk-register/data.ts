export interface MockRisk {
  id: string
  title: string
  owner: string
  likelihood: 1 | 2 | 3 | 4 | 5
  impact: 1 | 2 | 3 | 4 | 5
  mitigationStatus: 'open' | 'in-progress' | 'mitigated'
}

export const MOCK_RISKS: MockRisk[] = [
  { id: 'r1', title: 'Unpatched Citrix gateway exposed to internet', owner: 'IT Infra', likelihood: 4, impact: 5, mitigationStatus: 'in-progress' },
  { id: 'r2', title: 'Shared service account with Domain Admin', owner: 'Identity', likelihood: 3, impact: 5, mitigationStatus: 'open' },
  { id: 'r3', title: 'Phishing simulation click rate above target', owner: 'Awareness', likelihood: 4, impact: 3, mitigationStatus: 'in-progress' },
  { id: 'r4', title: 'Quarterly access reviews overdue', owner: 'GRC', likelihood: 3, impact: 3, mitigationStatus: 'open' },
  { id: 'r5', title: 'Vendor SOC 2 report expiring', owner: 'GRC', likelihood: 2, impact: 4, mitigationStatus: 'mitigated' },
  { id: 'r6', title: 'TLS cert auto-renewal misconfigured for legacy app', owner: 'IT Infra', likelihood: 2, impact: 2, mitigationStatus: 'open' },
  { id: 'r7', title: 'Backup restoration not tested in 12 months', owner: 'Resilience', likelihood: 3, impact: 4, mitigationStatus: 'open' },
]
