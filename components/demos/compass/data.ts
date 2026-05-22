export interface MockFinding {
  id: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM'
  browser: 'edge' | 'chrome'
  controlId: string
  controlTitle: string
  decision: 'pending' | 'approved' | 'disapproved'
  autoDecided: boolean
  narrative: { riskSummary: string; whyItMatters: string; remediationHint: string }
  cisCitation: { url: string; quote: string }
}

export const MOCK_FINDINGS: MockFinding[] = [
  {
    id: 'f1',
    severity: 'CRITICAL',
    browser: 'edge',
    controlId: '1.79',
    controlTitle: 'Ensure Smart Screen is enabled',
    decision: 'pending',
    autoDecided: false,
    narrative: {
      riskSummary: 'Without Smart Screen enforcement, users can navigate to phishing and malware-hosting sites that the reputation service would otherwise block.',
      whyItMatters: 'Smart Screen is the last in-browser defense for credential-phishing pages that bypass mail filtering. Disabling it raises endpoint risk during business email compromise campaigns.',
      remediationHint: 'Set the Microsoft Edge Group Policy "Configure Microsoft Defender SmartScreen" to Enabled. Audit via registry path HKLM\\\\Software\\\\Policies\\\\Microsoft\\\\Edge\\\\SmartScreenEnabled = 1.',
    },
    cisCitation: {
      url: 'cis://edge/1.79#rationale',
      quote: 'Smart Screen provides early warning against phishing and malware-hosting sites …',
    },
  },
  {
    id: 'f2',
    severity: 'HIGH',
    browser: 'chrome',
    controlId: '2.14',
    controlTitle: 'Disable password manager',
    decision: 'approved',
    autoDecided: true,
    narrative: {
      riskSummary: 'Allowing Chrome to save passwords creates a credential cache outside the corporate password manager.',
      whyItMatters: 'Credentials stored in browser profiles are extractable by adversaries with local user context.',
      remediationHint: 'Set "Password Manager Enabled" policy to Disabled via Chrome Enterprise Cloud Management.',
    },
    cisCitation: {
      url: 'cis://chrome/2.14#rationale',
      quote: 'The browser password manager stores credentials in a form recoverable by any process running as the same user …',
    },
  },
  {
    id: 'f3',
    severity: 'MEDIUM',
    browser: 'edge',
    controlId: '3.7',
    controlTitle: 'Block third-party cookies',
    decision: 'pending',
    autoDecided: false,
    narrative: {
      riskSummary: 'Third-party cookies enable cross-site tracking and increase the attack surface for session-hijacking via malicious advertising networks.',
      whyItMatters: 'Modern phishing kits use third-party trackers to fingerprint victims; blocking them reduces both privacy exposure and active-session-cookie theft risk.',
      remediationHint: 'Configure the "BlockThirdPartyCookies" Group Policy under Edge → Privacy and security.',
    },
    cisCitation: {
      url: 'cis://edge/3.7#rationale',
      quote: 'Third-party cookies enable cross-site state tracking …',
    },
  },
]
