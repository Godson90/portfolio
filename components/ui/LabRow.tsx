'use client'

import { useEffect, useState } from 'react'
import { LabDemoSlot } from '@/components/demos/lab/LabDemoSlot'
import type { LabEntry } from '@/lib/lab'

interface Props {
  entry: LabEntry
}

export function LabRow({ entry }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === `#${entry.slug}`) {
      setOpen(true)
    }
  }, [entry.slug])

  function toggle() {
    const next = !open
    setOpen(next)
    if (typeof window !== 'undefined') {
      const newHash = next ? `#${entry.slug}` : ''
      const url = `${window.location.pathname}${newHash}`
      window.history.replaceState(null, '', url)
    }
  }

  return (
    <div className="border-b border-dashed border-border-dark py-4 text-sm">
      <button
        onClick={toggle}
        className="grid grid-cols-[80px_220px_1fr_24px] gap-5 w-full items-baseline text-left hover:opacity-90"
        aria-expanded={open}
      >
        <span className="text-text-dark-mute font-mono text-xs">[{entry.year}]</span>
        <span className="text-text-dark font-mono text-xs">{entry.name}</span>
        <span className="text-text-dark-dim text-xs leading-relaxed">{entry.description}</span>
        <span className={`text-accent-dark text-xs font-mono transition-transform ${open ? 'rotate-90' : ''}`}>›</span>
      </button>
      {open && (
        <div className="mt-5 ml-[100px] mr-6 max-w-[860px]">
          <LabDemoSlot slug={entry.slug} />
        </div>
      )}
    </div>
  )
}
