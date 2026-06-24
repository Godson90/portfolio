import fs from 'node:fs'
import path from 'node:path'

export interface LabEntry {
  slug: string
  year: number
  name: string
  description: string
  url?: string
}

const FILE = path.join(process.cwd(), 'content', 'lab', 'entries.json')

export function listLabEntries(): LabEntry[] {
  const raw = fs.readFileSync(FILE, 'utf8')
  const entries = JSON.parse(raw) as LabEntry[]
  return [...entries].sort((a, b) => b.year - a.year)
}
