import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import remarkFrontmatter from 'remark-frontmatter'

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  transpilePackages: ['@mdx-js/react'],
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter],
  },
})

export default withMDX(nextConfig)
