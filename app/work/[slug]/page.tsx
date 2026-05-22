import { notFound } from 'next/navigation'
import { listWork, loadWork } from '@/lib/mdx'
import { ProjectHeader } from '@/components/ui/ProjectHeader'
import { DemoBadge } from '@/components/ui/DemoBadge'
import { DemoSlot } from '@/components/demos/DemoSlot'
import { MdxBody } from '@/components/ui/MdxBody'

export function generateStaticParams() {
  return listWork().map((w) => ({ slug: w.frontmatter.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const work = loadWork(slug)
    return { title: work.frontmatter.title }
  } catch {
    return { title: 'Not found' }
  }
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let work
  try {
    work = loadWork(slug)
  } catch {
    notFound()
  }

  return (
    <main>
      <section className="max-w-wide mx-auto px-8 py-16">
        <ProjectHeader frontmatter={work.frontmatter} />
        <div className="mb-4"><DemoBadge /></div>
        <DemoSlot slug={slug} />
      </section>

      <section className="reading-mode">
        <article className="max-w-prose mx-auto px-8 py-20">
          <MdxBody slug={slug} />
        </article>
      </section>
    </main>
  )
}
