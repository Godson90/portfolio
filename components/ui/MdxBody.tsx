import type { ComponentType } from 'react'

type MdxModule = { default: ComponentType }

const loaderMap: Record<string, () => Promise<MdxModule>> = {
  compass:            () => import('@/content/work/compass.mdx'),
  'risk-register':    () => import('@/content/work/risk-register.mdx'),
  'mail-ioc-scanner': () => import('@/content/work/mail-ioc-scanner.mdx'),
  'event-planner':    () => import('@/content/work/event-planner.mdx'),
  'cyberark-sdk':     () => import('@/content/work/cyberark-sdk.mdx'),
  'azure-web-app-secure-design': () => import('@/content/work/azure-web-app-secure-design.mdx'),
}

export async function MdxBody({ slug }: { slug: string }) {
  const loader = loaderMap[slug]
  if (!loader) throw new Error(`No MDX loader for slug "${slug}"`)
  const Mod = await loader()
  const Body = Mod.default
  return <Body />
}
