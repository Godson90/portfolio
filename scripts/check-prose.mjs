import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const BANNED = [
  'leverage', 'robust', 'best-in-class', 'cutting-edge',
  'seamless', 'world-class', 'ai-powered', 'passionate about',
]
const SCAN_DIRS = ['content', 'app', 'components']
const EXTS = new Set(['.mdx', '.md', '.tsx', '.ts'])

let failed = false

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.') || entry === 'node_modules') continue
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walk(p)
    else if (EXTS.has(p.slice(p.lastIndexOf('.')))) check(p)
  }
}

function check(file) {
  const text = readFileSync(file, 'utf8').toLowerCase()
  for (const term of BANNED) {
    const idx = text.indexOf(term)
    if (idx !== -1) {
      const lineNum = text.slice(0, idx).split('\n').length
      console.error(`\u001b[31mBANNED:\u001b[0m ${file}:${lineNum} — "${term}"`)
      failed = true
    }
  }
}

for (const d of SCAN_DIRS) walk(d)

if (failed) {
  console.error('\nProse lint failed. Remove banned terms before shipping.')
  process.exit(1)
} else {
  console.log('Prose lint: PASS')
}
