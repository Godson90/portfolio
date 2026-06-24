const RISK_DOMAINS = [
  {
    n: '01',
    title: 'Application & network attacks',
    detail: 'OWASP Top 10, SQLi, XSS, RCE, Layer-7 floods, bots.',
    controls: 'Front Door · WAF v2 · NSGs · Private Endpoints',
  },
  {
    n: '02',
    title: 'Secrets exposure',
    detail: 'Hardcoded keys, leaked credentials, compromised repos.',
    controls: 'Key Vault · Managed Identity · Defender for DevOps',
  },
  {
    n: '03',
    title: 'Insecure file uploads',
    detail: 'Malware, web shells, ZIP bombs, MIME spoofing.',
    controls: 'Defender for Storage · CDR · Private Blobs · SAS',
  },
  {
    n: '04',
    title: 'DoS / DDoS attacks',
    detail: 'Service outages, L7 floods, API abuse, burst exhaustion.',
    controls: 'Front Door · DDoS Standard · WAF rate-limit · CDN',
  },
  {
    n: '05',
    title: 'Excessive privileged access',
    detail: 'Standing admin, insider threats, privilege escalation.',
    controls: 'Entra ID · PIM · Conditional Access · JIT · MFA',
  },
  {
    n: '06',
    title: 'Lack of detection & response',
    detail: 'Delayed detection, no visibility, slow manual response.',
    controls: 'Sentinel · Defender for Cloud · Logic Apps · MITRE',
  },
]

const FRAMEWORKS = ['OWASP Top 10', 'Zero Trust', 'CIS Azure', 'NIST CSF', 'ISO 27001', 'Microsoft CSB']

export default function AzureSecureDesignDemo() {
  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark flex justify-between items-center">
        <span>azure-web-app-secure-design / 18 slides · 6 risk domains</span>
        <a
          href="/Azure_Web_App_Secure_Design_Presentation.pptx"
          className="text-accent-dark hover:underline"
          download
        >
          ↓ download .pptx
        </a>
      </div>

      <div className="bg-bg-dark p-4">
        <div className="text-xs text-text-dark-mute mb-3 font-mono">// six risk domains, six remediation plans</div>
        <div className="grid grid-cols-2 gap-px bg-border-dark">
          {RISK_DOMAINS.map((r) => (
            <div key={r.n} className="bg-bg-dark p-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-accent-dark text-xs font-mono">{r.n}</span>
                <span className="text-text-dark text-sm font-medium">{r.title}</span>
              </div>
              <div className="text-text-dark-dim text-xs mb-2">{r.detail}</div>
              <div className="text-text-dark-mute text-[10px] font-mono">{r.controls}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border-dark">
          <div className="text-[10px] text-text-dark-mute uppercase tracking-widest font-mono mb-2">Framework alignment</div>
          <div className="flex flex-wrap gap-2">
            {FRAMEWORKS.map((f) => (
              <span
                key={f}
                className="text-[10px] font-mono border border-border-dark text-text-dark-dim px-2 py-1 rounded"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
