'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

const fallback = (
  <div className="text-xs text-text-dark-mute font-mono p-4 border border-dashed border-border-dark rounded">
    loading demo...
  </div>
)

const demos: Record<string, ComponentType> = {
  'rag-it-support': dynamic(() => import('@/components/demos/lab/rag-it-support'), { loading: () => fallback }),
  'soar-playbooks': dynamic(() => import('@/components/demos/lab/soar-playbooks'), { loading: () => fallback }),
  'onetrust-gitlab-bridge': dynamic(() => import('@/components/demos/lab/onetrust-gitlab-bridge'), { loading: () => fallback }),
  'f5-decryptor': dynamic(() => import('@/components/demos/lab/f5-decryptor'), { loading: () => fallback }),
  'burp-extensions': dynamic(() => import('@/components/demos/lab/burp-extensions'), { loading: () => fallback }),
  'phishing-pst-triage': dynamic(() => import('@/components/demos/lab/phishing-pst-triage'), { loading: () => fallback }),
  'hybrid-analysis-cli': dynamic(() => import('@/components/demos/lab/hybrid-analysis-cli'), { loading: () => fallback }),
}

export function LabDemoSlot({ slug }: { slug: string }) {
  const Demo = demos[slug]
  if (!Demo) {
    return (
      <div className="text-xs text-text-dark-mute font-mono p-4 border border-dashed border-border-dark rounded">
        No demo registered for slug &quot;{slug}&quot;.
      </div>
    )
  }
  return <Demo />
}
