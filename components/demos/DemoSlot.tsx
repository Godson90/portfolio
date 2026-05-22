import CompassDemo from '@/components/demos/compass'

interface Props { slug: string }

const demos: Record<string, () => React.ReactElement> = {
  compass: () => <CompassDemo />,
}

export function DemoSlot({ slug }: Props) {
  const Demo = demos[slug]
  if (Demo) return <Demo />
  return (
    <div className="border border-border-dark rounded p-8 text-center text-text-dark-dim text-sm bg-bg-dark-panel">
      <div className="font-mono text-xs text-accent-dark mb-2">[ demo placeholder ]</div>
      Interactive demo for <span className="text-text-dark">{slug}</span> ships in a later task.
    </div>
  )
}
