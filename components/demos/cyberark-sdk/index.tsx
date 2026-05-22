'use client'

import { useState } from 'react'

interface Endpoint {
  id: string
  label: string
  python: string
  request: string
  response: string
}

const ENDPOINTS: Endpoint[] = [
  {
    id: 'get_safes',
    label: 'get_safes()',
    python:
`from cyberark import Client

client = Client.from_env()
safes = client.safes.list()
for s in safes:
    print(s.name, s.description)`,
    request:
`GET /PasswordVault/api/Safes
Authorization: Bearer <session-token>`,
    response:
`{
  "value": [
    { "safeName": "AppCreds-Prod",   "description": "Production app credentials" },
    { "safeName": "DBA-Privileged",  "description": "DBA elevated accounts" }
  ],
  "count": 2
}`,
  },
  {
    id: 'list_accounts',
    label: 'list_accounts(safe="AppCreds-Prod")',
    python:
`accounts = client.accounts.list(safe="AppCreds-Prod")
for a in accounts:
    print(a.userName, a.platformId)`,
    request:
`GET /PasswordVault/api/Accounts?filter=safeName eq AppCreds-Prod
Authorization: Bearer <session-token>`,
    response:
`{
  "value": [
    { "id": "12_15", "userName": "svc-app01", "platformId": "WinServerLocal" },
    { "id": "12_16", "userName": "svc-app02", "platformId": "WinServerLocal" }
  ]
}`,
  },
  {
    id: 'create_user',
    label: 'create_user(username, ...)',
    python:
`user = client.users.create(
    username="jdoe",
    location="\\\\Internal",
    user_type="EPVUser",
    initial_password="<redacted>",
    change_password_on_next_login=True,
)
print(user.id)`,
    request:
`POST /PasswordVault/api/Users
Authorization: Bearer <session-token>
Content-Type: application/json

{ "username": "jdoe", "userType": "EPVUser", ... }`,
    response:
`{
  "id": 4012,
  "username": "jdoe",
  "userType": "EPVUser",
  "componentUser": false
}`,
  },
]

const TABS = ['python', 'request', 'response'] as const
type Tab = typeof TABS[number]

export default function CyberArkDemo() {
  const [endpointId, setEndpointId] = useState(ENDPOINTS[0].id)
  const [tab, setTab] = useState<Tab>('python')
  const endpoint = ENDPOINTS.find((e) => e.id === endpointId)!

  function copy() {
    navigator.clipboard.writeText(endpoint[tab])
  }

  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark">
        cyberark-sdk / rest-playground
      </div>
      <div className="grid grid-cols-[240px_1fr]">
        <aside className="border-r border-border-dark p-3 space-y-1">
          {ENDPOINTS.map((e) => (
            <button
              key={e.id}
              onClick={() => setEndpointId(e.id)}
              className={`w-full text-left text-xs font-mono px-2 py-2 rounded ${
                e.id === endpointId ? 'bg-accent-dark/15 text-accent-dark' : 'text-text-dark hover:bg-bg-dark-panel'
              }`}
            >
              {e.label}
            </button>
          ))}
        </aside>
        <div>
          <div className="flex items-center justify-between border-b border-border-dark px-3">
            <div className="flex">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`text-xs font-mono px-3 py-2 ${tab === t ? 'text-accent-dark border-b-2 border-accent-dark' : 'text-text-dark-mute'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={copy}
              className="text-[10px] font-mono text-text-dark-mute hover:text-accent-dark py-2"
            >
              copy
            </button>
          </div>
          <pre className="p-4 font-mono text-xs text-text-dark whitespace-pre-wrap leading-relaxed max-h-[320px] overflow-auto">{endpoint[tab]}</pre>
        </div>
      </div>
    </div>
  )
}
