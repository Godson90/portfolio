import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  transpilePackages: ['@mdx-js/react'],
}

// Pass the plugin as a string name (not an imported function) so Turbopack
// can serialize the loader options. Next.js / @next/mdx resolve the package
// name automatically.
const withMDX = createMDX({
  options: {
    remarkPlugins: [['remark-frontmatter', ['yaml']]],
  },
})

export default withMDX(nextConfig)
