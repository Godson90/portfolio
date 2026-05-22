# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the credibility-first portfolio website at `C:/Workspace/portfolio-website/` per the spec at `docs/superpowers/specs/2026-05-22-portfolio-website-design.md` — a Next.js 15 site with five case studies (one fully written, four skeletons), five interactive demos, a /lab appendix, an /about page, and a hybrid dark-terminal-plus-cream-reading-mode design.

**Architecture:** Static Next.js 15 App Router site. Content lives as MDX in `/content/`. Theme is dual-surface via Tailwind tokens — dark for home and project headers, cream for long-form case-study prose. Interactive demos are React Client Components in `/components/demos/<slug>/`. Deploy is push-to-`main` on a yet-to-be-created GitHub repo + Vercel free tier.

**Tech Stack:** Next.js 15 (App Router, React 19), TypeScript, Tailwind CSS, MDX (`@next/mdx`, `gray-matter`), Vitest for `lib/` unit tests, ESLint, Vercel deploy.

---

## Plan organization

This plan has 8 phases, 28 tasks. Each task is self-contained and produces a single commit.

| Phase | Tasks | Outcome |
|---|---|---|
| 0. Bootstrap | 1–3 | Next.js + Tailwind + MDX scaffold, dependencies, `npm run dev` boots |
| 1. Theme foundation | 4–5 | Dual-surface tokens, base layout, fonts, globals |
| 2. Content infrastructure | 6–8 | MDX loader, catalog builder, content scaffolds for all 5 projects + lab + about |
| 3. UI primitives | 9–11 | Nav, footer, catalog row, project header, demo badge |
| 4. Pages | 12–18 | `/`, `/work`, `/work/[slug]`, `/lab`, `/about`, `/404`, `/resume.pdf` placeholder |
| 5. Demos | 19–23 | Five interactive demo components |
| 6. COMPASS content | 24 | Full case-study prose for COMPASS mined from the script |
| 7. Polish & lint | 25–27 | Banned-language lint, Lighthouse pass, accessibility audit |
| 8. Deploy | 28 | Push to GitHub + connect Vercel + verify preview |

---

## Validation utilities (used across tasks)

**Banned-language grep** (mirrors COMPASS script discipline):

```bash
grep -niER 'leverage|robust|best-in-class|cutting-edge|seamless|world-class|ai-powered|passionate about' content/ app/ components/ || echo "PASS"
```

**Build sanity check:**

```bash
npm run build
```
Expected: builds successfully with no errors, no missing static params, all pages render.

**Unit test runner:**

```bash
npm run test
```
Expected: all Vitest tests pass.

**Type-check:**

```bash
npm run typecheck
```
Expected: tsc finds zero errors.

Each task that ships code includes whichever validation gates are relevant.

---

# Phase 0 — Bootstrap

## Task 1: Initialize Next.js 15 project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `.gitignore`, `app/layout.tsx`, `app/page.tsx`
- Working directory: `C:/Workspace/portfolio-website/`

- [ ] **Step 1: Run create-next-app with the exact flags**

```bash
cd C:/Workspace/portfolio-website
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --eslint --no-turbopack --skip-install
```

If prompted to overwrite `docs/`, **answer no** (the spec lives there and must survive).

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

- [ ] **Step 3: Verify dev server boots**

```bash
npm run dev
```
Expected: `Local: http://localhost:3000` logged within 15 seconds. Visit the URL — default Next.js 15 starter renders. Stop the server with Ctrl+C.

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Expected: build completes without errors. Cleanup: `rm -rf .next` afterward.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: bootstrap Next.js 15 + Tailwind + TypeScript scaffold"
```

---

## Task 2: Install MDX, gray-matter, Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`, `next.config.mjs` (overwrite)

- [ ] **Step 1: Install MDX + content dependencies**

```bash
cd C:/Workspace/portfolio-website
npm install @next/mdx @mdx-js/loader @mdx-js/react gray-matter
npm install -D @types/mdx
```

- [ ] **Step 2: Install Vitest + jsdom**

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Replace `next.config.mjs` with MDX-enabled config**

```javascript
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  experimental: { mdxRs: true },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
```

- [ ] **Step 4: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

- [ ] **Step 5: Add test + typecheck scripts to `package.json` `"scripts"` object**

Edit `package.json` and ensure `"scripts"` contains:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest",
  "typecheck": "tsc --noEmit"
}
```

- [ ] **Step 6: Verify**

```bash
npm run typecheck
npm run test
```
Expected: typecheck passes; vitest runs (zero tests found, exits 0).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: add MDX, Vitest, typecheck script"
```

---

## Task 3: Create directory scaffold

**Files (all empty placeholders / `.gitkeep`):**

- Create: `content/work/.gitkeep`, `content/lab/.gitkeep`, `components/ui/.gitkeep`, `components/demos/.gitkeep`, `lib/.gitkeep`, `public/og/.gitkeep`, `public/resume.pdf`

- [ ] **Step 1: Create directories**

```bash
mkdir -p content/work content/lab components/ui components/demos lib public/og
touch content/work/.gitkeep content/lab/.gitkeep components/ui/.gitkeep components/demos/.gitkeep lib/.gitkeep public/og/.gitkeep
```

- [ ] **Step 2: Create a placeholder resume.pdf (1-byte file, replaced later by user)**

```bash
echo "%PDF-1.4 placeholder" > public/resume.pdf
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: scaffold content/, components/, lib/, public/ directories"
```

---

# Phase 1 — Theme foundation

## Task 4: Define dual-surface theme tokens

**Files:**
- Modify: `tailwind.config.ts` (created by create-next-app — confirm it exists; if not, create per the content below)
- Modify: `app/globals.css`

- [ ] **Step 1: Replace `tailwind.config.ts` with the dual-surface theme**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark':        '#0d1117',
        'bg-dark-panel':  '#161b22',
        'border-dark':    '#1f2630',
        'text-dark':      '#c9d1d9',
        'text-dark-dim':  '#8b949e',
        'text-dark-mute': '#6e7681',
        'accent-dark':    '#5ee2a2',

        'bg-light':       '#f6f1ea',
        'bg-light-panel': '#ece7de',
        'border-light':   '#e8e3d8',
        'text-light':     '#1a1a1a',
        'text-light-dim': '#555555',
        'accent-light':   '#2d8a8a',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Cascadia Code', 'Consolas', 'monospace'],
        serif: ['Charter', 'Iowan Old Style', 'Georgia', 'serif'],
      },
      maxWidth: {
        prose: '38rem', // reading-mode body width
        wide: '64rem',  // dark surface content width
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Replace `app/globals.css` with theme baseline**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { @apply font-mono; }
  body { @apply bg-bg-dark text-text-dark; }
  a { @apply text-accent-dark; }
  a:hover { @apply underline; }
  *:focus-visible { @apply outline-2 outline-accent-dark outline-offset-2; }
}

/* Reading-mode surface — applied to <article class="reading-mode"> wrappers */
.reading-mode { @apply bg-bg-light text-text-light font-serif text-lg leading-relaxed; }
.reading-mode a { @apply text-accent-light; }
.reading-mode h2 { @apply font-serif text-3xl mt-12 mb-4 font-normal; }
.reading-mode h3 { @apply font-serif text-xl mt-8 mb-3 font-medium; }
.reading-mode code { @apply font-mono text-base bg-bg-light-panel px-1 py-0.5 rounded; }
.reading-mode pre { @apply font-mono text-sm bg-bg-light-panel p-4 rounded overflow-x-auto; }
.reading-mode p { @apply mb-4; }
.reading-mode ul { @apply list-disc pl-6 mb-4; }
.reading-mode strong { @apply font-semibold; }

/* Cursor blink for terminal prompts */
.cursor-blink { animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
```

- [ ] **Step 3: Verify build still works**

```bash
npm run build
```
Expected: build completes; no Tailwind errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(theme): dual-surface tokens — terminal dark + reading-mode cream"
```

---

## Task 5: Replace root layout with site shell

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace `app/layout.tsx` with**

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'godsonadeola.dev', template: '%s · godsonadeola.dev' },
  description: 'Security engineer in Columbus, Ohio. I build production-grade tooling that real teams actually use.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Replace `app/page.tsx` with a temporary home placeholder**

```typescript
export default function Home() {
  return (
    <main className="max-w-wide mx-auto px-8 py-16">
      <h1 className="text-2xl">godsonadeola.dev — scaffolding</h1>
      <p className="mt-4 text-text-dark-dim">Real home page lands in Task 12.</p>
    </main>
  )
}
```

- [ ] **Step 3: Verify dev server**

```bash
npm run dev
```
Visit `http://localhost:3000` — page renders dark with mono text and green link styles available. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(theme): root layout + placeholder home page"
```

---

# Phase 2 — Content infrastructure

## Task 6: MDX loader + frontmatter parser (`lib/mdx.ts`)

**Files:**
- Create: `lib/mdx.ts`
- Create: `lib/__tests__/mdx.test.ts`
- Create: `content/work/_template.mdx` (sample fixture for tests)

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/mdx.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { loadWork, listWork } from '@/lib/mdx'

describe('loadWork', () => {
  it('parses frontmatter from a known MDX file', () => {
    const work = loadWork('_template')
    expect(work.frontmatter.slug).toBe('_template')
    expect(work.frontmatter.title).toBeDefined()
    expect(work.frontmatter.catalogId).toBeDefined()
    expect(work.body).toBeDefined()
  })
})

describe('listWork', () => {
  it('returns at least the template entry sorted by catalogId', () => {
    const list = listWork()
    expect(list.length).toBeGreaterThanOrEqual(1)
    expect(list[0].frontmatter.slug).toBeDefined()
  })
})
```

- [ ] **Step 2: Create the test fixture `content/work/_template.mdx`**

```mdx
---
slug: _template
title: Template Case Study
catalogId: "99"
catalogTag: template
oneLiner: Template case study used as a test fixture.
year: 2026
role: Test
stack: [TypeScript]
demoComponent: null
---

## Problem

Template content.
```

- [ ] **Step 3: Run test to verify failure**

```bash
npm run test
```
Expected: FAIL — `Cannot find module '@/lib/mdx'`.

- [ ] **Step 4: Implement `lib/mdx.ts`**

```typescript
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export interface WorkFrontmatter {
  slug: string
  title: string
  catalogId: string          // "01", "02", ...
  catalogTag: string         // "llm-pipeline", "erm-platform", ...
  oneLiner: string
  year: number
  role: string
  stack: string[]
  demoComponent: string | null
  seo?: { description?: string; ogImage?: string }
}

export interface Work {
  frontmatter: WorkFrontmatter
  body: string
}

const WORK_DIR = path.join(process.cwd(), 'content', 'work')

export function loadWork(slug: string): Work {
  const file = path.join(WORK_DIR, `${slug}.mdx`)
  const raw = fs.readFileSync(file, 'utf8')
  const parsed = matter(raw)
  return {
    frontmatter: { slug, ...(parsed.data as Omit<WorkFrontmatter, 'slug'>) },
    body: parsed.content,
  }
}

export function listWork(): Work[] {
  return fs.readdirSync(WORK_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => loadWork(f.replace(/\.mdx$/, '')))
    .sort((a, b) => a.frontmatter.catalogId.localeCompare(b.frontmatter.catalogId))
}
```

- [ ] **Step 5: Run test to verify pass**

```bash
npm run test
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(content): MDX loader + frontmatter parser with Vitest coverage"
```

---

## Task 7: Lab entries loader + types (`lib/lab.ts`)

**Files:**
- Create: `lib/lab.ts`
- Create: `lib/__tests__/lab.test.ts`
- Create: `content/lab/entries.json`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/lab.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { listLabEntries } from '@/lib/lab'

describe('listLabEntries', () => {
  it('returns lab entries sorted by year desc', () => {
    const entries = listLabEntries()
    expect(entries.length).toBeGreaterThan(0)
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i - 1].year).toBeGreaterThanOrEqual(entries[i].year)
    }
  })
})
```

- [ ] **Step 2: Create `content/lab/entries.json` with seed data**

```json
[
  {
    "year": 2024,
    "name": "f5_decryptor",
    "description": "F5 BIG-IP configuration / credential decryptor for IR engagements."
  },
  {
    "year": 2024,
    "name": "burp-extensions",
    "description": "Custom Burp Suite extensions for in-house security testing workflows."
  },
  {
    "year": 2023,
    "name": "Phishing Email Analyzer / Triage",
    "description": "Two scripts that parse Outlook PSTs for IOC extraction and triage routing."
  },
  {
    "year": 2023,
    "name": "Hybrid Analysis CLI wrapper",
    "description": "Thin Python wrapper around Hybrid Analysis's REST API for batch sample lookups."
  }
]
```

- [ ] **Step 3: Run test to verify failure**

```bash
npm run test
```
Expected: FAIL — `Cannot find module '@/lib/lab'`.

- [ ] **Step 4: Implement `lib/lab.ts`**

```typescript
import fs from 'node:fs'
import path from 'node:path'

export interface LabEntry {
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
```

- [ ] **Step 5: Verify test passes**

```bash
npm run test
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(content): lab entries loader with seed data"
```

---

## Task 8: Scaffold all five work MDX files with frontmatter + skeleton sections

**Files:**
- Create: `content/work/compass.mdx`, `content/work/risk-register.mdx`, `content/work/mail-ioc-scanner.mdx`, `content/work/event-planner.mdx`, `content/work/cyberark-sdk.mdx`
- Create: `content/about.mdx`
- Delete: `content/work/_template.mdx` (test fixture no longer needed once real content exists; tests must still pass against the real entries)

- [ ] **Step 1: Update the test fixture removal in `lib/__tests__/mdx.test.ts` first**

Edit `lib/__tests__/mdx.test.ts` so the assertions reference `'compass'` instead of `'_template'`:

```typescript
import { describe, it, expect } from 'vitest'
import { loadWork, listWork } from '@/lib/mdx'

describe('loadWork', () => {
  it('parses frontmatter from compass.mdx', () => {
    const work = loadWork('compass')
    expect(work.frontmatter.slug).toBe('compass')
    expect(work.frontmatter.catalogId).toBe('01')
    expect(work.frontmatter.title).toContain('COMPASS')
    expect(work.body.length).toBeGreaterThan(0)
  })
})

describe('listWork', () => {
  it('returns all five work entries sorted by catalogId', () => {
    const list = listWork()
    expect(list).toHaveLength(5)
    expect(list.map((w) => w.frontmatter.catalogId)).toEqual(['01', '02', '03', '04', '05'])
  })
})
```

- [ ] **Step 2: Create `content/work/compass.mdx`**

```mdx
---
slug: compass
title: COMPASS — Configuration Assessment Agent
catalogId: "01"
catalogTag: llm-pipeline
oneLiner: Multi-agent LLM enrichment of CrowdStrike CIS findings against the official benchmark PDF, with human-in-loop approval and automated ServiceNow change tickets.
year: 2026
role: Solo engineer
stack: [Python, Next.js, Postgres, pgvector, Docker, OpenTelemetry, Prometheus, Alembic, FastAPI, OpenAI SDK]
demoComponent: compass
---

## Problem

_To be written in Task 24 (mined from `docs/portfolio/compass-script.md` in the COMPASS repo)._

## Approach

_To be written in Task 24._

## Hard problems

_To be written in Task 24._

## Stack

_To be written in Task 24._

## Outcomes

_To be written in Task 24._
```

- [ ] **Step 3: Create `content/work/risk-register.mdx`**

```mdx
---
slug: risk-register
title: Risk Register
catalogId: "02"
catalogTag: erm-platform
oneLiner: AI-powered enterprise risk management with LangGraph agents — intake, scoring, monitoring, mitigation tracking.
year: 2026
role: Solo engineer
stack: [Python, FastAPI, LangGraph, Celery, Next.js, Postgres]
demoComponent: risk-register
---

## Problem

Enterprise risk management is dominated by spreadsheet sprawl and once-a-year audit theatre. I wanted a system that captures risks as they're surfaced, scores them consistently, and tracks mitigation through to closure — without becoming a CMS.

## Approach

_Skeleton — fill iteratively post-v1._

## Hard problems

_Skeleton — fill iteratively post-v1._

## Stack

- FastAPI for the API
- LangGraph for the agent orchestration
- Celery + Redis for scheduled monitoring jobs
- Next.js for the operator UI
- Postgres for persistence

## Outcomes

_Skeleton — fill iteratively post-v1._
```

- [ ] **Step 4: Create `content/work/mail-ioc-scanner.mdx`**

```mdx
---
slug: mail-ioc-scanner
title: Mail IOC Scanner
catalogId: "03"
catalogTag: soc-tooling
oneLiner: Microsoft Graph harvesting + VirusTotal / urlscan.io / AbuseIPDB enrichment for shared mailbox triage.
year: 2025
role: Solo engineer
stack: [Python, Microsoft Graph API, VirusTotal API, urlscan.io API, AbuseIPDB API]
demoComponent: mail-ioc-scanner
---

## Problem

SOC teams triage shared phishing-report mailboxes by hand. The same indicators get re-checked across three vendor APIs every shift. I wanted a deterministic tool that walks a date-windowed mailbox, extracts indicators from message metadata, and batches them through enrichment APIs — no LLM, no flakiness.

## Approach

_Skeleton — fill iteratively post-v1._

## Hard problems

_Skeleton — fill iteratively post-v1._

## Stack

- Microsoft Graph for mailbox access (delegated permissions, shared mailbox scope)
- VirusTotal v3, urlscan.io, AbuseIPDB clients
- httpx with retry + rate-limit handling
- No LLM, no agent — fully deterministic

## Outcomes

_Skeleton — fill iteratively post-v1._
```

- [ ] **Step 5: Create `content/work/event-planner.mdx`**

```mdx
---
slug: event-planner
title: Event Planner — CrewAI
catalogId: "04"
catalogTag: agent-framework
oneLiner: Multi-agent event-planning web app on CrewAI, demonstrating agent collaboration patterns outside the COMPASS pipeline.
year: 2025
role: Solo engineer
stack: [Python, CrewAI, Flask, OpenAI API]
demoComponent: event-planner
---

## Problem

Most agent-framework demos are command-line scripts. I wanted a small but real web-served multi-agent app to internalize CrewAI's collaboration patterns and contrast them with the bespoke orchestration in COMPASS.

## Approach

_Skeleton — fill iteratively post-v1._

## Hard problems

_Skeleton — fill iteratively post-v1._

## Stack

- CrewAI for agent collaboration
- Flask for the web layer
- OpenAI API as the underlying LLM
- Simple browser-based UI

## Outcomes

_Skeleton — fill iteratively post-v1._
```

- [ ] **Step 6: Create `content/work/cyberark-sdk.mdx`**

```mdx
---
slug: cyberark-sdk
title: CyberArk Python SDK
catalogId: "05"
catalogTag: identity-sdk
oneLiner: REST API wrapper for CyberArk privileged-access workflows, authored from scratch.
year: 2024
role: Solo engineer
stack: [Python, requests, CyberArk REST API]
demoComponent: cyberark-sdk
---

## Problem

CyberArk's REST API surface is broad, sparsely documented in the open, and not consistently shaped. I wanted a Pythonic wrapper that abstracts authentication, retries, and pagination, and exposes high-level workflows (safe management, account lifecycle, user provisioning) instead of raw HTTP calls.

## Approach

_Skeleton — fill iteratively post-v1._

## Hard problems

_Skeleton — fill iteratively post-v1._

## Stack

- Python requests
- CyberArk REST API
- Token-based auth with automatic refresh

## Outcomes

_Skeleton — fill iteratively post-v1._
```

- [ ] **Step 7: Create `content/about.mdx`**

```mdx
---
title: About
---

## Godson Adeola

Security engineer. Columbus, Ohio.

I build production-grade security tooling — multi-agent LLM pipelines, IOC enrichment, identity automation, AI-powered risk management. Every feature starts as a design doc that names the problem before naming the solution.

### Currently

Shipping COMPASS, a bi-weekly CIS assessment agent that turns thousands of CrowdStrike Falcon findings into one operator's minutes of review.

### Stack

- Languages: Python, TypeScript, SQL, Bash
- Frameworks: FastAPI, Next.js, LangGraph, CrewAI
- Infra: Postgres, Docker, Vercel, Azure
- Disciplines: TDD where it earns, design-doc-first always
```

- [ ] **Step 8: Delete the test fixture**

```bash
rm content/work/_template.mdx
```

- [ ] **Step 9: Run tests**

```bash
npm run test
```
Expected: PASS — both `loadWork('compass')` and the five-entry `listWork()` assertion succeed.

- [ ] **Step 10: Verify build**

```bash
npm run build
```
Expected: build completes; no errors.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat(content): scaffold all five work MDX files + about.mdx with frontmatter"
```

---

# Phase 3 — UI primitives

## Task 9: Site nav + footer components

**Files:**
- Create: `components/ui/SiteNav.tsx`
- Create: `components/ui/SiteFooter.tsx`
- Modify: `app/layout.tsx` (mount nav + footer)

- [ ] **Step 1: Create `components/ui/SiteNav.tsx`**

```typescript
import Link from 'next/link'

export function SiteNav() {
  return (
    <nav className="border-b border-border-dark">
      <div className="max-w-wide mx-auto px-8 py-4 flex items-center gap-8 text-xs">
        <Link href="/" className="text-accent-dark font-semibold no-underline hover:no-underline">
          <span className="text-text-dark-mute">~/</span>godsonadeola.dev
        </Link>
        <Link href="/work" className="text-text-dark no-underline hover:text-accent-dark">work</Link>
        <Link href="/lab" className="text-text-dark no-underline hover:text-accent-dark">lab</Link>
        <Link href="/about" className="text-text-dark no-underline hover:text-accent-dark">about</Link>
        <a
          href="mailto:contact@example.com"
          className="ml-auto text-accent-dark no-underline hover:underline"
        >
          contact →
        </a>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Create `components/ui/SiteFooter.tsx`**

```typescript
export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-auto border-t border-border-dark">
      <div className="max-w-wide mx-auto px-8 py-6 text-xs text-text-dark-mute flex items-center justify-between">
        <span>© {year} Godson Adeola</span>
        <span>
          <span className="text-text-dark-dim">// </span>
          built with Next.js + Vercel
        </span>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Update `app/layout.tsx` to mount nav and footer**

```typescript
import type { Metadata } from 'next'
import { SiteNav } from '@/components/ui/SiteNav'
import { SiteFooter } from '@/components/ui/SiteFooter'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'godsonadeola.dev', template: '%s · godsonadeola.dev' },
  description: 'Security engineer in Columbus, Ohio. I build production-grade tooling that real teams actually use.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SiteNav />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Verify dev server renders nav + footer**

```bash
npm run dev
```
Visit `http://localhost:3000`. Expected: nav strip at top with brand + links + contact; footer strip at bottom with copyright. Stop server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(ui): site nav + footer primitives mounted in root layout"
```

---

## Task 10: Catalog row component

**Files:**
- Create: `components/ui/CatalogRow.tsx`

- [ ] **Step 1: Create `components/ui/CatalogRow.tsx`**

```typescript
import Link from 'next/link'
import type { WorkFrontmatter } from '@/lib/mdx'

interface Props { frontmatter: WorkFrontmatter }

export function CatalogRow({ frontmatter }: Props) {
  const { catalogId, catalogTag, slug, title, oneLiner } = frontmatter
  return (
    <Link
      href={`/work/${slug}`}
      className="grid grid-cols-[140px_1fr_24px] gap-5 py-4 border-b border-dashed border-border-dark items-baseline no-underline hover:bg-bg-dark-panel transition-colors px-2 -mx-2 rounded"
    >
      <span className="text-xs text-accent-dark font-mono tracking-wide">
        <span className="text-text-dark-mute">[</span>
        {catalogId} · {catalogTag}
        <span className="text-text-dark-mute">]</span>
      </span>
      <div>
        <div className="text-sm text-text-dark font-medium">{title}</div>
        <div className="text-xs text-text-dark-dim mt-1 leading-relaxed">{oneLiner}</div>
      </div>
      <span className="text-accent-dark text-sm">→</span>
    </Link>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npm run typecheck
```
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(ui): catalog row component for selected-work lists"
```

---

## Task 11: Demo badge + project header

**Files:**
- Create: `components/ui/DemoBadge.tsx`
- Create: `components/ui/ProjectHeader.tsx`

- [ ] **Step 1: Create `components/ui/DemoBadge.tsx`**

```typescript
export function DemoBadge() {
  return (
    <div className="inline-flex items-center gap-2 text-[10px] text-accent-dark font-mono tracking-widest uppercase border border-accent-dark/50 px-2 py-1 rounded">
      <span className="w-1.5 h-1.5 bg-accent-dark rounded-full" />
      demo mode — seeded mock data
    </div>
  )
}
```

- [ ] **Step 2: Create `components/ui/ProjectHeader.tsx`**

```typescript
import type { WorkFrontmatter } from '@/lib/mdx'

export function ProjectHeader({ frontmatter }: { frontmatter: WorkFrontmatter }) {
  const { catalogId, catalogTag, title, oneLiner, year, role, stack } = frontmatter
  return (
    <header className="border-b border-border-dark pb-8 mb-12">
      <div className="text-xs text-accent-dark mb-3 tracking-wide">
        <span className="text-text-dark-mute">[</span>
        {catalogId} · {catalogTag}
        <span className="text-text-dark-mute">]</span>
      </div>
      <h1 className="text-3xl text-text-dark mb-3 font-medium">{title}</h1>
      <p className="text-sm text-text-dark-dim leading-relaxed max-w-prose">{oneLiner}</p>

      <dl className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 mt-8 text-xs">
        <dt className="text-text-dark-mute">year</dt>
        <dd className="text-text-dark">{year}</dd>

        <dt className="text-text-dark-mute">role</dt>
        <dd className="text-text-dark">{role}</dd>

        <dt className="text-text-dark-mute">stack</dt>
        <dd className="text-text-dark font-mono">{stack.join(', ')}</dd>
      </dl>
    </header>
  )
}
```

- [ ] **Step 3: Verify typecheck**

```bash
npm run typecheck
```
Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(ui): demo badge + project header components"
```

---

# Phase 4 — Pages

## Task 12: Home page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace `app/page.tsx`**

```typescript
import Link from 'next/link'
import { listWork } from '@/lib/mdx'
import { CatalogRow } from '@/components/ui/CatalogRow'

export default function Home() {
  const work = listWork()
  return (
    <main className="max-w-wide mx-auto px-8 py-16">
      <div className="text-xs text-accent-dark mb-3 tracking-wide font-mono">
        $ whoami<span className="cursor-blink text-accent-dark">▍</span>
      </div>
      <h1 className="text-3xl font-medium text-text-dark leading-tight mb-5 max-w-prose">
        Security engineer in Columbus, Ohio. I build production-grade tooling that real teams actually use.
      </h1>
      <p className="text-sm text-text-dark-dim leading-relaxed max-w-prose">
        Multi-agent LLM pipelines for compliance. IOC enrichment for SOCs. Identity automation against CyberArk. AI-powered risk management. <span className="text-text-dark font-medium">Built with discipline</span> — every feature paired with a design doc, every doc paired with a commit.
      </p>

      <div className="mt-8 inline-block bg-bg-dark-panel border-l-2 border-accent-dark px-4 py-3 max-w-prose text-sm">
        <span className="text-accent-dark text-[10px] uppercase tracking-widest font-semibold mr-3">currently</span>
        Shipping COMPASS — a bi-weekly CIS assessment agent that turns thousands of CrowdStrike Falcon findings into one operator's minutes of review.
      </div>

      <section className="mt-20 border-t border-border-dark pt-10">
        <div className="text-xs text-text-dark-mute tracking-widest uppercase mb-6">
          <span className="text-accent-dark">// </span>selected_work/
        </div>
        {work.map((w) => (
          <CatalogRow key={w.frontmatter.slug} frontmatter={w.frontmatter} />
        ))}
        <p className="mt-6 text-xs text-text-dark-dim">
          Smaller tools and one-off scripts live in{' '}
          <Link href="/lab" className="text-accent-dark">/lab</Link>.
        </p>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Verify dev server**

```bash
npm run dev
```
Visit `http://localhost:3000`. Expected: home renders with hero, lede, "currently" callout, and five catalog rows linking to `/work/<slug>`. Stop server.

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: home page is statically generated (look for `○` or `●` indicator on `/`).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(page): home — terminal hero + selected-work catalog"
```

---

## Task 13: Work index page

**Files:**
- Create: `app/work/page.tsx`

- [ ] **Step 1: Create `app/work/page.tsx`**

```typescript
import { listWork } from '@/lib/mdx'
import { CatalogRow } from '@/components/ui/CatalogRow'

export const metadata = { title: 'Work' }

export default function WorkIndex() {
  const work = listWork()
  return (
    <main className="max-w-wide mx-auto px-8 py-16">
      <div className="text-xs text-accent-dark mb-3 tracking-wide font-mono">
        $ ls work/
      </div>
      <h1 className="text-3xl font-medium text-text-dark mb-12">Selected work</h1>
      {work.map((w) => (
        <CatalogRow key={w.frontmatter.slug} frontmatter={w.frontmatter} />
      ))}
    </main>
  )
}
```

- [ ] **Step 2: Verify dev — visit `http://localhost:3000/work`**

Expected: same five catalog rows. Stop server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(page): /work index"
```

---

## Task 14: Case study page `/work/[slug]`

**Files:**
- Create: `app/work/[slug]/page.tsx`
- Create: `components/ui/MdxBody.tsx`
- Create: `components/demos/DemoSlot.tsx`

- [ ] **Step 1: Create `components/ui/MdxBody.tsx` — runs the MDX body as React content**

We use Next's built-in MDX evaluation via a dynamic import per slug.

```typescript
import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

interface Props { slug: string }

const loaderMap: Record<string, () => Promise<{ default: ComponentType }>> = {
  compass:           () => import('@/content/work/compass.mdx'),
  'risk-register':   () => import('@/content/work/risk-register.mdx'),
  'mail-ioc-scanner':() => import('@/content/work/mail-ioc-scanner.mdx'),
  'event-planner':   () => import('@/content/work/event-planner.mdx'),
  'cyberark-sdk':    () => import('@/content/work/cyberark-sdk.mdx'),
}

export async function MdxBody({ slug }: Props) {
  const loader = loaderMap[slug]
  if (!loader) throw new Error(`No MDX loader for slug "${slug}"`)
  const Mod = await loader()
  const Body = Mod.default
  return <Body />
}
```

- [ ] **Step 2: Create `components/demos/DemoSlot.tsx` — placeholder slot that picks the right demo by slug**

For now, render a placeholder. Real demo components ship in Phase 5.

```typescript
interface Props { slug: string }

export function DemoSlot({ slug }: Props) {
  return (
    <div className="border border-border-dark rounded p-8 text-center text-text-dark-dim text-sm bg-bg-dark-panel">
      <div className="font-mono text-xs text-accent-dark mb-2">
        [ demo placeholder ]
      </div>
      Interactive demo for <span className="text-text-dark">{slug}</span> ships in Phase 5.
    </div>
  )
}
```

- [ ] **Step 3: Create `app/work/[slug]/page.tsx`**

```typescript
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
      {/* Dark surface: header + demo */}
      <section className="max-w-wide mx-auto px-8 py-16">
        <ProjectHeader frontmatter={work.frontmatter} />
        <div className="mb-4"><DemoBadge /></div>
        <DemoSlot slug={slug} />
      </section>

      {/* Reading-mode surface: prose */}
      <section className="reading-mode">
        <article className="max-w-prose mx-auto px-8 py-20">
          <MdxBody slug={slug} />
        </article>
      </section>
    </main>
  )
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Expected: all five `/work/<slug>` pages are listed as statically generated.

- [ ] **Step 5: Verify dev — visit `/work/compass`, `/work/risk-register`, all five**

Each page should show: dark header with title + metadata, demo placeholder block, then cream reading-mode section with the skeleton prose.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(page): /work/[slug] case study scaffolding with MDX body + demo slot"
```

---

## Task 15: `/lab` page

**Files:**
- Create: `app/lab/page.tsx`

- [ ] **Step 1: Create `app/lab/page.tsx`**

```typescript
import { listLabEntries } from '@/lib/lab'

export const metadata = { title: 'Lab' }

export default function Lab() {
  const entries = listLabEntries()
  return (
    <main className="max-w-wide mx-auto px-8 py-16">
      <div className="text-xs text-accent-dark mb-3 tracking-wide font-mono">
        $ ls lab/
      </div>
      <h1 className="text-3xl font-medium text-text-dark mb-3">Lab</h1>
      <p className="text-sm text-text-dark-dim mb-12 max-w-prose">
        Smaller projects and one-off scripts. Not every tool needs a case study.
      </p>
      <div className="border-t border-border-dark">
        {entries.map((e) => (
          <div
            key={`${e.year}-${e.name}`}
            className="grid grid-cols-[80px_220px_1fr] gap-5 py-4 border-b border-dashed border-border-dark items-baseline text-sm"
          >
            <span className="text-text-dark-mute font-mono text-xs">[{e.year}]</span>
            <span className="text-text-dark font-mono text-xs">{e.name}</span>
            <span className="text-text-dark-dim text-xs leading-relaxed">{e.description}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify build + dev**

```bash
npm run build
```

Visit `/lab` — three or four rows render. Stop server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(page): /lab appendix with seed entries"
```

---

## Task 16: `/about` page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create `app/about/page.tsx`**

```typescript
import About from '@/content/about.mdx'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <main>
      <section className="max-w-wide mx-auto px-8 py-16">
        <div className="text-xs text-accent-dark mb-3 tracking-wide font-mono">
          $ cat about.md
        </div>
        <h1 className="text-3xl font-medium text-text-dark">About</h1>
      </section>
      <section className="reading-mode">
        <article className="max-w-prose mx-auto px-8 py-16">
          <About />

          <hr className="my-12 border-border-light" />

          <p className="text-base">
            <a href="https://www.linkedin.com/" className="font-mono">LinkedIn ↗</a>
            {' · '}
            <a href="https://github.com/" className="font-mono">GitHub ↗</a>
            {' · '}
            <a href="mailto:contact@example.com" className="font-mono">contact@example.com</a>
          </p>
          <p className="mt-4 text-sm">
            <a href="/resume.pdf" className="font-mono">→ download resume.pdf</a>
          </p>
        </article>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Verify build + dev**

```bash
npm run build
```

Visit `/about` — dark hero, reading-mode body, social link strip, resume link. Stop server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(page): /about with bio + social strip + resume link"
```

---

## Task 17: `/404` not-found page

**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1: Create `app/not-found.tsx`**

```typescript
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="max-w-wide mx-auto px-8 py-32 font-mono">
      <div className="text-sm text-accent-dark mb-4">$ cd /that-page</div>
      <div className="text-sm text-text-dark-dim mb-12">bash: /that-page: No such file or directory</div>
      <div className="flex gap-6 text-sm">
        <Link href="/" className="border border-border-dark px-3 py-2 no-underline hover:bg-bg-dark-panel">[ home ]</Link>
        <Link href="/work" className="border border-border-dark px-3 py-2 no-underline hover:bg-bg-dark-panel">[ work ]</Link>
        <Link href="/about" className="border border-border-dark px-3 py-2 no-underline hover:bg-bg-dark-panel">[ about ]</Link>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify dev — visit `/anything-bogus`**

Expected: 404 page renders with terminal-style "command not found" + three return links.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(page): terminal-themed 404"
```

---

## Task 18: Resume PDF placeholder route

**Files:**
- (Already created in Task 3 as 1-byte placeholder. This task confirms it serves.)

- [ ] **Step 1: Verify `public/resume.pdf` exists**

```bash
ls -la public/resume.pdf
```

- [ ] **Step 2: Verify it serves via dev**

```bash
npm run dev
```
Visit `http://localhost:3000/resume.pdf`. Browser will either render the (invalid) PDF or download it — both confirm the route resolves. Real PDF is dropped in later by the user.

- [ ] **Step 3: Document the placeholder in `public/README.md`**

```markdown
# /public

- `resume.pdf` — placeholder. Replace with the real resume PDF before going live.
- `og/` — Open Graph social card images (per-project, optional).
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs(public): document resume.pdf placeholder"
```

---

# Phase 5 — Interactive demos

Each demo is a Client Component in `/components/demos/<slug>/index.tsx` plus optional supporting files in the same folder. Each demo must:
- Be marked `'use client'` at the top.
- Use seeded mock data only — no real API calls.
- Stay under ~400 lines including data.
- Visually fit on the dark surface above the reading-mode boundary.

Tasks 19–23 create the five demos and wire each one into `DemoSlot` so the placeholder gets replaced project-by-project.

---

## Task 19: COMPASS demo — mock dashboard

**Files:**
- Create: `components/demos/compass/index.tsx`
- Create: `components/demos/compass/data.ts`
- Modify: `components/demos/DemoSlot.tsx` (wire `compass` slug)

- [ ] **Step 1: Create `components/demos/compass/data.ts`**

```typescript
export interface MockFinding {
  id: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM'
  browser: 'edge' | 'chrome'
  controlId: string
  controlTitle: string
  decision: 'pending' | 'approved' | 'disapproved'
  autoDecided: boolean
  narrative: { riskSummary: string; whyItMatters: string; remediationHint: string }
  cisCitation: { url: string; quote: string }
}

export const MOCK_FINDINGS: MockFinding[] = [
  {
    id: 'f1',
    severity: 'CRITICAL',
    browser: 'edge',
    controlId: '1.79',
    controlTitle: 'Ensure Smart Screen is enabled',
    decision: 'pending',
    autoDecided: false,
    narrative: {
      riskSummary: 'Without Smart Screen enforcement, users can navigate to phishing and malware-hosting sites that the reputation service would otherwise block.',
      whyItMatters: 'Smart Screen is the last in-browser defense for credential-phishing pages that bypass mail filtering. Disabling it raises endpoint risk during business email compromise campaigns.',
      remediationHint: 'Set the Microsoft Edge Group Policy "Configure Microsoft Defender SmartScreen" to Enabled. Audit via registry path HKLM\\Software\\Policies\\Microsoft\\Edge\\SmartScreenEnabled = 1.',
    },
    cisCitation: {
      url: 'cis://edge/1.79#rationale',
      quote: 'Smart Screen provides early warning against phishing and malware-hosting sites …',
    },
  },
  {
    id: 'f2',
    severity: 'HIGH',
    browser: 'chrome',
    controlId: '2.14',
    controlTitle: 'Disable password manager',
    decision: 'approved',
    autoDecided: true,
    narrative: {
      riskSummary: 'Allowing Chrome to save passwords creates a credential cache outside the corporate password manager.',
      whyItMatters: 'Credentials stored in browser profiles are extractable by adversaries with local user context.',
      remediationHint: 'Set "Password Manager Enabled" policy to Disabled via Chrome Enterprise Cloud Management.',
    },
    cisCitation: {
      url: 'cis://chrome/2.14#rationale',
      quote: 'The browser password manager stores credentials in a form recoverable by any process running as the same user …',
    },
  },
  {
    id: 'f3',
    severity: 'MEDIUM',
    browser: 'edge',
    controlId: '3.7',
    controlTitle: 'Block third-party cookies',
    decision: 'pending',
    autoDecided: false,
    narrative: {
      riskSummary: 'Third-party cookies enable cross-site tracking and increase the attack surface for session-hijacking via malicious advertising networks.',
      whyItMatters: 'Modern phishing kits use third-party trackers to fingerprint victims; blocking them reduces both privacy exposure and active-session-cookie theft risk.',
      remediationHint: 'Configure the "BlockThirdPartyCookies" Group Policy under Edge → Privacy and security.',
    },
    cisCitation: {
      url: 'cis://edge/3.7#rationale',
      quote: 'Third-party cookies enable cross-site state tracking …',
    },
  },
]
```

- [ ] **Step 2: Create `components/demos/compass/index.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { MOCK_FINDINGS, type MockFinding } from './data'

const severityClass = {
  CRITICAL: 'text-red-400',
  HIGH: 'text-orange-400',
  MEDIUM: 'text-yellow-400',
} as const

const decisionClass = {
  pending:     'bg-bg-dark-panel text-text-dark-dim',
  approved:    'bg-accent-dark/20 text-accent-dark',
  disapproved: 'bg-red-500/20 text-red-400',
} as const

export default function CompassDemo() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 1800)
  }

  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark">
        compass / dashboard / run #142
      </div>
      <table className="w-full text-sm">
        <thead className="text-xs text-text-dark-mute uppercase tracking-wider border-b border-border-dark">
          <tr>
            <th className="text-left px-4 py-2 font-normal">severity</th>
            <th className="text-left px-4 py-2 font-normal">browser</th>
            <th className="text-left px-4 py-2 font-normal">control</th>
            <th className="text-left px-4 py-2 font-normal">decision</th>
            <th className="text-right px-4 py-2 font-normal">flags</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_FINDINGS.map((f) => (
            <FindingRow
              key={f.id}
              finding={f}
              open={openId === f.id}
              onToggle={() => setOpenId(openId === f.id ? null : f.id)}
              onAction={(label) => showToast(`${label} — demo mode`)}
            />
          ))}
        </tbody>
      </table>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-accent-dark text-bg-dark text-xs px-4 py-2 rounded font-mono">
          {toast}
        </div>
      )}
    </div>
  )
}

function FindingRow({
  finding, open, onToggle, onAction,
}: {
  finding: MockFinding
  open: boolean
  onToggle: () => void
  onAction: (label: string) => void
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className="border-b border-border-dark cursor-pointer hover:bg-bg-dark-panel"
      >
        <td className={`px-4 py-3 font-mono text-xs ${severityClass[finding.severity]}`}>{finding.severity}</td>
        <td className="px-4 py-3 font-mono text-xs">{finding.browser}</td>
        <td className="px-4 py-3 text-text-dark">{finding.controlId} · {finding.controlTitle}</td>
        <td className="px-4 py-3">
          <span className={`text-xs px-2 py-1 rounded font-mono ${decisionClass[finding.decision]}`}>
            {finding.decision}
          </span>
        </td>
        <td className="px-4 py-3 text-right text-xs">
          {finding.autoDecided && <span className="text-accent-dark font-mono">↻ auto</span>}
        </td>
      </tr>
      {open && (
        <tr className="border-b border-border-dark bg-bg-dark-panel">
          <td colSpan={5} className="px-6 py-5">
            <Section label="risk_summary">{finding.narrative.riskSummary}</Section>
            <Section label="why_it_matters">{finding.narrative.whyItMatters}</Section>
            <Section label="remediation_hint">{finding.narrative.remediationHint}</Section>
            <div className="mt-4 pt-3 border-t border-border-dark">
              <div className="text-[10px] text-accent-dark uppercase tracking-widest mb-1">CIS citation</div>
              <div className="font-mono text-xs text-text-dark">{finding.cisCitation.url}</div>
              <div className="text-xs text-text-dark-dim mt-1 italic">"{finding.cisCitation.quote}"</div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => onAction('Approve')} className="text-xs font-mono border border-accent-dark text-accent-dark px-3 py-1 hover:bg-accent-dark/10">
                Approve
              </button>
              <button onClick={() => onAction('Disapprove')} className="text-xs font-mono border border-border-dark text-text-dark-dim px-3 py-1 hover:bg-bg-dark">
                Disapprove
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="text-[10px] text-text-dark-mute uppercase tracking-widest mb-1 font-mono">{label}</div>
      <div className="text-xs text-text-dark leading-relaxed">{children}</div>
    </div>
  )
}
```

- [ ] **Step 3: Update `components/demos/DemoSlot.tsx` to dispatch to the COMPASS demo**

```typescript
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
```

- [ ] **Step 4: Verify dev**

```bash
npm run dev
```
Visit `/work/compass` — table renders, clicking a row expands it inline, clicking Approve shows toast. Stop server.

- [ ] **Step 5: Verify build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(demo): COMPASS — clickable mock dashboard with three findings"
```

---

## Task 20: Risk Register demo — 5×5 heat map

**Files:**
- Create: `components/demos/risk-register/index.tsx`
- Create: `components/demos/risk-register/data.ts`
- Modify: `components/demos/DemoSlot.tsx`

- [ ] **Step 1: Create `components/demos/risk-register/data.ts`**

```typescript
export interface MockRisk {
  id: string
  title: string
  owner: string
  likelihood: 1 | 2 | 3 | 4 | 5
  impact: 1 | 2 | 3 | 4 | 5
  mitigationStatus: 'open' | 'in-progress' | 'mitigated'
}

export const MOCK_RISKS: MockRisk[] = [
  { id: 'r1', title: 'Unpatched Citrix gateway exposed to internet', owner: 'IT Infra', likelihood: 4, impact: 5, mitigationStatus: 'in-progress' },
  { id: 'r2', title: 'Shared service account with Domain Admin', owner: 'Identity', likelihood: 3, impact: 5, mitigationStatus: 'open' },
  { id: 'r3', title: 'Phishing simulation click rate above target', owner: 'Awareness', likelihood: 4, impact: 3, mitigationStatus: 'in-progress' },
  { id: 'r4', title: 'Quarterly access reviews overdue', owner: 'GRC', likelihood: 3, impact: 3, mitigationStatus: 'open' },
  { id: 'r5', title: 'Vendor SOC 2 report expiring', owner: 'GRC', likelihood: 2, impact: 4, mitigationStatus: 'mitigated' },
  { id: 'r6', title: 'TLS cert auto-renewal misconfigured for legacy app', owner: 'IT Infra', likelihood: 2, impact: 2, mitigationStatus: 'open' },
  { id: 'r7', title: 'Backup restoration not tested in 12 months', owner: 'Resilience', likelihood: 3, impact: 4, mitigationStatus: 'open' },
]
```

- [ ] **Step 2: Create `components/demos/risk-register/index.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { MOCK_RISKS, type MockRisk } from './data'

const COLOR = (score: number) => {
  if (score >= 16) return 'bg-red-500/40'
  if (score >= 9)  return 'bg-orange-400/40'
  if (score >= 4)  return 'bg-yellow-400/30'
  return 'bg-accent-dark/20'
}

export default function RiskRegisterDemo() {
  const [selected, setSelected] = useState<MockRisk | null>(null)

  // Group risks by (likelihood, impact)
  const cellRisks: Record<string, MockRisk[]> = {}
  for (const r of MOCK_RISKS) {
    const key = `${r.likelihood}-${r.impact}`
    cellRisks[key] = cellRisks[key] || []
    cellRisks[key].push(r)
  }

  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark">
        risk-register / heat-map / Q2 2026
      </div>
      <div className="grid grid-cols-[60px_1fr_280px]">
        {/* Y axis labels + grid */}
        <div className="flex flex-col-reverse justify-around items-center text-[10px] text-text-dark-mute font-mono px-2 py-4">
          <span>impact →</span>
        </div>

        <div className="grid grid-cols-5 grid-rows-5 gap-1 p-4">
          {[5, 4, 3, 2, 1].map((impact) =>
            [1, 2, 3, 4, 5].map((likelihood) => {
              const score = likelihood * impact
              const risks = cellRisks[`${likelihood}-${impact}`] || []
              return (
                <div
                  key={`${likelihood}-${impact}`}
                  className={`aspect-square ${COLOR(score)} border border-border-dark rounded relative flex items-center justify-center`}
                >
                  {risks.map((r, i) => (
                    <button
                      key={r.id}
                      onClick={() => setSelected(r)}
                      title={r.title}
                      className="w-6 h-6 rounded-full bg-text-dark/80 hover:bg-accent-dark text-bg-dark text-[10px] font-mono font-semibold absolute"
                      style={{ left: `${20 + i * 18}%`, top: `${30 + i * 12}%` }}
                    >
                      {r.id.toUpperCase()}
                    </button>
                  ))}
                </div>
              )
            })
          )}
        </div>

        {/* Side panel */}
        <aside className="border-l border-border-dark p-4 text-xs">
          {!selected && <p className="text-text-dark-mute">Click a risk dot.</p>}
          {selected && (
            <>
              <div className="text-accent-dark text-[10px] uppercase tracking-widest mb-2 font-mono">{selected.id}</div>
              <h4 className="text-text-dark mb-3 leading-snug">{selected.title}</h4>
              <dl className="grid grid-cols-[80px_1fr] gap-y-1 text-xs">
                <dt className="text-text-dark-mute">owner</dt><dd>{selected.owner}</dd>
                <dt className="text-text-dark-mute">L × I</dt><dd>{selected.likelihood} × {selected.impact} = {selected.likelihood * selected.impact}</dd>
                <dt className="text-text-dark-mute">status</dt><dd className="font-mono">{selected.mitigationStatus}</dd>
              </dl>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update `components/demos/DemoSlot.tsx`**

```typescript
import CompassDemo from '@/components/demos/compass'
import RiskRegisterDemo from '@/components/demos/risk-register'

interface Props { slug: string }

const demos: Record<string, () => React.ReactElement> = {
  compass: () => <CompassDemo />,
  'risk-register': () => <RiskRegisterDemo />,
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
```

- [ ] **Step 4: Verify dev — visit `/work/risk-register`, click dots**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(demo): Risk Register — 5×5 heat map with side-panel detail"
```

---

## Task 21: Mail IOC Scanner demo

**Files:**
- Create: `components/demos/mail-ioc-scanner/index.tsx`
- Modify: `components/demos/DemoSlot.tsx`

- [ ] **Step 1: Create `components/demos/mail-ioc-scanner/index.tsx`**

```typescript
'use client'

import { useState } from 'react'

const SAMPLE_EMAIL = `From: "IT Helpdesk" <no-reply@acmecorp-secure.com>
To: jane.doe@company.com
Subject: ACTION REQUIRED: Your mailbox is full
Date: Mon, 22 May 2026 09:14:00 -0400

Your Office 365 mailbox has exceeded its quota.
Click below to verify your identity and free up space:

http://acmecorp-secure.com/login?id=85f02

Sender IP: 185.220.101.42

Failure to verify within 24 hours will result in service suspension.`

interface IOC {
  type: 'url' | 'ip' | 'sender' | 'domain'
  value: string
  vt: 'clean' | 'malicious' | 'suspicious'
  urlscan?: 'malicious' | 'pending'
  abuseipdb?: number
}

const MOCK_RESULTS: IOC[] = [
  { type: 'url', value: 'http://acmecorp-secure.com/login?id=85f02', vt: 'malicious', urlscan: 'malicious' },
  { type: 'ip',  value: '185.220.101.42', vt: 'malicious', abuseipdb: 87 },
  { type: 'sender', value: 'no-reply@acmecorp-secure.com', vt: 'suspicious' },
  { type: 'domain', value: 'acmecorp-secure.com', vt: 'malicious' },
]

const VERDICT_COLOR = {
  malicious: 'text-red-400',
  suspicious: 'text-orange-400',
  clean: 'text-accent-dark',
  pending: 'text-text-dark-mute',
} as const

export default function MailIocDemo() {
  const [email, setEmail] = useState(SAMPLE_EMAIL)
  const [results, setResults] = useState<IOC[] | null>(null)
  const [loading, setLoading] = useState(false)

  function extract() {
    setLoading(true)
    setResults(null)
    setTimeout(() => {
      setResults(MOCK_RESULTS)
      setLoading(false)
    }, 700)
  }

  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark">
        mail-ioc-scanner / paste-and-extract
      </div>
      <div className="grid grid-cols-2 gap-px bg-border-dark">
        <div className="bg-bg-dark p-4">
          <div className="text-xs text-text-dark-mute mb-2 font-mono">message_source.eml</div>
          <textarea
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            rows={14}
            className="w-full bg-bg-dark-panel text-text-dark text-xs font-mono p-3 border border-border-dark rounded resize-none"
          />
          <button
            onClick={extract}
            disabled={loading}
            className="mt-3 text-xs font-mono border border-accent-dark text-accent-dark px-3 py-2 hover:bg-accent-dark/10 disabled:opacity-50"
          >
            {loading ? 'extracting...' : 'extract IOCs →'}
          </button>
        </div>
        <div className="bg-bg-dark p-4">
          <div className="text-xs text-text-dark-mute mb-2 font-mono">enrichment_results.json</div>
          {!results && !loading && <p className="text-xs text-text-dark-mute">Click "extract IOCs" to see seeded results.</p>}
          {loading && <p className="text-xs text-accent-dark font-mono">› vt.lookup ›› urlscan.io ›› abuseipdb...</p>}
          {results && (
            <div className="space-y-2">
              {results.map((ioc, i) => (
                <div key={i} className="border border-border-dark rounded p-3 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-text-dark-mute font-mono uppercase">{ioc.type}</span>
                    <span className={`font-mono ${VERDICT_COLOR[ioc.vt]}`}>vt: {ioc.vt}</span>
                  </div>
                  <div className="text-text-dark font-mono break-all">{ioc.value}</div>
                  <div className="mt-1 text-text-dark-dim text-[10px] font-mono">
                    {ioc.urlscan && <>urlscan: <span className={VERDICT_COLOR[ioc.urlscan]}>{ioc.urlscan}</span> · </>}
                    {ioc.abuseipdb !== undefined && <>abuseipdb: <span className="text-red-400">{ioc.abuseipdb}/100</span></>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire into `components/demos/DemoSlot.tsx`**

Add the import and entry to the `demos` map:

```typescript
import MailIocDemo from '@/components/demos/mail-ioc-scanner'
// ...
const demos: Record<string, () => React.ReactElement> = {
  compass: () => <CompassDemo />,
  'risk-register': () => <RiskRegisterDemo />,
  'mail-ioc-scanner': () => <MailIocDemo />,
}
```

- [ ] **Step 3: Verify dev — visit `/work/mail-ioc-scanner`, click extract**

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(demo): Mail IOC Scanner — paste-an-email + mock VT/urlscan/AbuseIPDB enrichment"
```

---

## Task 22: Event Planner (CrewAI) demo

**Files:**
- Create: `components/demos/event-planner/index.tsx`
- Modify: `components/demos/DemoSlot.tsx`

- [ ] **Step 1: Create `components/demos/event-planner/index.tsx`**

```typescript
'use client'

import { useState } from 'react'

const AGENT_LOG = [
  { agent: 'venue_scout', message: 'Searching for venues matching capacity 80 + downtown radius...' },
  { agent: 'venue_scout', message: 'Found 3 candidates: The Vault (cap 90), Lincoln Hall (cap 75), Riverside Loft (cap 100).' },
  { agent: 'catering_planner', message: 'Soliciting menu options at price target $45/head...' },
  { agent: 'catering_planner', message: 'Selected: Roving stations (3 hot, 2 cold). Vegetarian option included.' },
  { agent: 'budget_steward', message: 'Reconciling venue + catering + AV + decor against $8K cap...' },
  { agent: 'budget_steward', message: 'Estimate within budget at $7,420. Buffer $580.' },
  { agent: 'lead_planner', message: 'Compiling proposal.' },
]

const FINAL_PLAN = `Event: Q3 Engineering Recognition Night
Venue:    The Vault (downtown, capacity 90)
Date:     Saturday Aug 15, 7-10pm
Catering: Roving stations × 5 (incl. vegetarian)
Budget:   $7,420 (cap $8,000, $580 buffer)
Staffing: Bartender × 2, photographer × 1
Theme:    "Ship & Celebrate"`

export default function EventPlannerDemo() {
  const [prompt, setPrompt] = useState('Plan a 75-person engineering recognition event under $8K')
  const [logIdx, setLogIdx] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  function plan() {
    setDone(false)
    setLogIdx(0)
    let i = 0
    const interval = setInterval(() => {
      i += 1
      if (i >= AGENT_LOG.length) {
        clearInterval(interval)
        setLogIdx(AGENT_LOG.length)
        setDone(true)
      } else {
        setLogIdx(i)
      }
    }, 700)
  }

  return (
    <div className="border border-border-dark rounded overflow-hidden">
      <div className="px-4 py-2 bg-bg-dark-panel text-xs text-text-dark-dim font-mono border-b border-border-dark">
        event-planner / crewai / agent-log
      </div>
      <div className="p-4">
        <label className="text-xs text-text-dark-mute font-mono">prompt</label>
        <div className="flex gap-2 mt-1">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-bg-dark-panel text-text-dark text-xs font-mono p-2 border border-border-dark rounded"
          />
          <button
            onClick={plan}
            className="text-xs font-mono border border-accent-dark text-accent-dark px-3 hover:bg-accent-dark/10"
          >
            plan →
          </button>
        </div>

        {logIdx !== null && (
          <div className="mt-4 bg-bg-dark-panel border border-border-dark rounded p-3 font-mono text-xs space-y-1">
            {AGENT_LOG.slice(0, logIdx).map((line, i) => (
              <div key={i}>
                <span className="text-accent-dark">[{line.agent}]</span> <span className="text-text-dark">{line.message}</span>
              </div>
            ))}
            {!done && <div className="text-text-dark-mute">› thinking<span className="cursor-blink">▍</span></div>}
          </div>
        )}

        {done && (
          <pre className="mt-4 bg-bg-dark-panel border-l-2 border-accent-dark p-3 font-mono text-xs text-text-dark whitespace-pre-wrap">{FINAL_PLAN}</pre>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire into `components/demos/DemoSlot.tsx`**

```typescript
import EventPlannerDemo from '@/components/demos/event-planner'
// ...
const demos: Record<string, () => React.ReactElement> = {
  compass: () => <CompassDemo />,
  'risk-register': () => <RiskRegisterDemo />,
  'mail-ioc-scanner': () => <MailIocDemo />,
  'event-planner': () => <EventPlannerDemo />,
}
```

- [ ] **Step 3: Verify dev — visit `/work/event-planner`, click plan**

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(demo): Event Planner — animated multi-agent log + mock final plan"
```

---

## Task 23: CyberArk SDK demo — REST playground

**Files:**
- Create: `components/demos/cyberark-sdk/index.tsx`
- Modify: `components/demos/DemoSlot.tsx`

- [ ] **Step 1: Create `components/demos/cyberark-sdk/index.tsx`**

```typescript
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
```

- [ ] **Step 2: Wire into `components/demos/DemoSlot.tsx`**

```typescript
import CyberArkDemo from '@/components/demos/cyberark-sdk'
// ...
const demos: Record<string, () => React.ReactElement> = {
  compass: () => <CompassDemo />,
  'risk-register': () => <RiskRegisterDemo />,
  'mail-ioc-scanner': () => <MailIocDemo />,
  'event-planner': () => <EventPlannerDemo />,
  'cyberark-sdk': () => <CyberArkDemo />,
}
```

- [ ] **Step 3: Verify dev — visit `/work/cyberark-sdk`, swap endpoints + tabs**

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(demo): CyberArk SDK — endpoint picker + python/request/response tabs"
```

---

# Phase 6 — COMPASS case study content

## Task 24: Populate COMPASS case-study prose from the script

**Files:**
- Modify: `content/work/compass.mdx`

The COMPASS script at `C:/Workspace/configuration-assessment-agent-pg/docs/portfolio/compass-script.md` is the source. The four "Hard problem" sections (§3, §4, §5, §6) of the script map cleanly onto the case-study "Hard problems" section.

- [ ] **Step 1: Read the source script (reference, do not paste verbatim)**

```bash
cat /c/Workspace/configuration-assessment-agent-pg/docs/portfolio/compass-script.md
```

- [ ] **Step 2: Replace `content/work/compass.mdx` body (everything below the closing `---` of the frontmatter) with the following prose**

```mdx
## Problem

An auditor walks in with a CIS benchmark — two hundred and fifty-seven controls across Microsoft Edge and Google Chrome. CrowdStrike Falcon hands the team a pile of failed checks across every endpoint in the fleet. The scanner tells you _what_ failed. It doesn't tell you what to _do_ about it. The benchmark — three hundred and fifty pages of PDF — tells you what good looks like. Nobody reads three hundred and fifty pages of PDF.

That gap is the whole job.

## Approach

COMPASS is a bi-weekly assessment agent that closes it. The pipeline has six stages — Falcon, Triage, Research, Narrative, Verifier, Dashboard, ServiceNow — and each one was rebuilt at least once after something broke in production. The dashboard puts a human in the loop: every narrative the model writes gets a single click of approve or disapprove before it leaves the system, and approved findings become ServiceNow change tickets automatically.

## Hard problems

### Grounding the LLM in CIS PDFs

An LLM that's allowed to invent its own facts is a liability. Auditors won't accept training-data sourcing. My first attempt was a tier-one web allowlist — cisecurity.org, learn.microsoft.com, chromeenterprise.google, NIST — with a Serper fallback restricted to the same domains for niche controls. It worked for the common ones and got patchy for vendor-specific Group Policy settings the open web doesn't index well.

The real fix was the obvious one. The CIS benchmark PDF itself is the source of truth. So I ingested it. CIS Microsoft Edge 4.0.0: 139 controls, 1110 chunks. CIS Google Chrome 3.0.0: 118 controls, 931 chunks. The parser splits each control into its subsections — description, rationale, audit, remediation — embeds them with `text-embedding-3-small`, stores them in pgvector with an HNSW cosine index.

Retrieval is a hierarchical cascade. For each claim the narrative agent wants to make, the retriever asks three questions in order. First — strong match in this control's own chunks? Cosine above 0.75, stop. Second — strong match anywhere in the same browser's chunks? Above 0.65, stop. Third — anything globally? Take the best we can find. Three nested concentric circles. Start tight. Widen only when the tight one fails.

### Making the LLM accountable

Good sources are necessary. Not sufficient. The model still paraphrases wrong, drops hedges, invents confidence. So I added a verifier — a second LLM pass that rates each narrative claim against the same sources the narrative agent saw. Supported, or unsupported. Binary. The verifier originally rated low/medium/high confidence; I cut that because operators couldn't act on the middle.

The verifier also has to emit a verbatim supporting quote from one of the cited sources. The orchestrator validates that quote is a literal substring after case-insensitive whitespace normalization. If the verifier hallucinates the quote to make its job easier, the orchestrator catches it, coerces the verdict to unsupported, and the rewrite loop continues. The model cannot lie its way past the verifier by inventing quotes.

The operator has three distinct primitives: override the flag with a mandatory note, mark verified to vouch for the narrative, or cast a correct/wrong feedback vote that feeds a per-operator aggregate used to drive prompt tuning. Each one is its own audit table. The system is accountable in three directions — against its sources, against the operator who reviews it, and against the operator who reviews the reviewer.

### Crash survival and idempotency

Bi-weekly runs touch thousands of LLM calls over hours. Things crash. So the run is resumable. Every Run row carries a heartbeat timestamp updated at every commit boundary. If the heartbeat is older than five minutes, the next CLI invocation declares the run interrupted and resumes it if it's within the configured window. Phase A (Falcon fetch) re-runs cheaply because Falcon is idempotent. Phase B (triage) re-runs cheaply because triage hits its own LLM cache. Phase C (per-finding enrichment) only processes groups that haven't been persisted.

When the same control comes up two weeks later with the same claims, the prior decision carries forward. The check is exact — claim-set equality on the verification evidence, normalized. If the sets match, the prior decision is inherited and the operator sees an "auto-decided" badge. Operators never re-click Approve on a finding whose narrative didn't change.

The same discipline applies on the ServiceNow side. Every change ticket has a correlation ID; approvers can create a new CHG or add to an existing one. Disapproving the last finding on an open CHG cancels the ticket. The system never duplicates a ticket by accident.

### Honest operator UX

This part is internal tooling. It still has to feel good.

Inline row expansion, j/k keyboard navigation, an e-to-approve/d-to-disapprove shortcut on the detail page, a bulk-decide toolbar for batch approvals. Saved views per user. A filter sidebar that carves the index five ways. SLA aging badges computed from severity at the moment of approval. Source-freshness icons next to every citation, re-checked at the end of each run — dead link, auth-wall, unreachable. The CHG number is a deep link straight to ServiceNow.

Honesty is the part I'm strictest about. Auto-decided findings wear a badge. Every prompt change stamps a new version on the enrichment row, so an old narrative can never falsely claim to come from the current prompt. Manual verification, operator override, and verifier flag are three distinct states that stack newest-on-top without overwriting — the operator can always see what the model said, what the verifier said, and what every prior operator did, each in its own card.

## Stack

- **Language**: Python 3.11+
- **Pipeline**: bespoke async orchestrator; OpenAI SDK against an OpenAI-wire-compatible gateway, with direct-OpenAI failover for budget exhaustion
- **Storage**: Postgres 16 with pgvector; SQLAlchemy + Alembic; migrated from SQLite via a custom ID-preserving tool that ships in the image
- **Embeddings**: `text-embedding-3-small`, HNSW index
- **Dashboard**: FastAPI + Jinja, JWT cookies (15-min access, 7-day refresh), three roles, log-out-everywhere via token-version
- **Observability**: structlog with run/request/user correlation IDs; Prometheus `/metrics`; OpenTelemetry tracing opt-in via `OTEL_EXPORTER_OTLP_ENDPOINT`
- **Deployment**: Docker Compose stack — app + Postgres + cron sidecar; `alembic upgrade head` on container start; schedule version-controlled in `deploy/cron/crontab`
- **Integrations**: CrowdStrike Falcon, ServiceNow Change Management, Slack/Teams webhooks, SMTP notifications

## Outcomes

COMPASS runs every two weeks against every endpoint in the fleet, across two browser benchmarks and roughly two hundred and fifty controls. Days of analyst toil per cycle is now a few minutes of operator review.

What I want from this is not the feature list. It's the discipline. Every feature in this system started as a design document that named the problem before it named the solution. Thirty-nine specs in the repo. Each one paired with an implementation plan. Each one paired with the commit that closed it out.

That's how I work.
```

- [ ] **Step 3: Run banned-language grep**

```bash
grep -niER 'leverage|robust|best-in-class|cutting-edge|seamless|world-class|ai-powered|passionate about' content/work/compass.mdx || echo "PASS"
```
Expected: `PASS`.

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Expected: build succeeds; `/work/compass` page in the static output.

- [ ] **Step 5: Visual verification — visit `/work/compass`**

Open `http://localhost:3000/work/compass`. Confirm: dark header with metadata, COMPASS demo widget, then transition to reading-mode (cream) with the full prose body. Scroll through; ensure section headings, paragraph breaks, and reading-mode styling all render.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "content(compass): populate full case-study prose mined from script"
```

---

# Phase 7 — Polish & lint

## Task 25: Build-time banned-language check

**Files:**
- Create: `scripts/check-prose.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create `scripts/check-prose.mjs`**

```javascript
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
```

- [ ] **Step 2: Add script to `package.json` scripts**

```json
"check:prose": "node scripts/check-prose.mjs"
```

And add it to `build` (so deploy fails on banned terms):

```json
"build": "npm run check:prose && next build"
```

- [ ] **Step 3: Run the check**

```bash
npm run check:prose
```
Expected: `Prose lint: PASS`.

- [ ] **Step 4: Sanity-test the failure path**

Add a banned word temporarily to a test file:

```bash
echo "we leverage synergies" >> content/about.mdx
npm run check:prose
```
Expected: exit code 1, `BANNED:` line printed. Then revert:

```bash
git checkout content/about.mdx
npm run check:prose
```
Expected: PASS again.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(lint): build-time banned-language check"
```

---

## Task 26: SEO / Open Graph metadata + sitemap

**Files:**
- Create: `app/sitemap.ts`
- Modify: `app/layout.tsx` (extend metadata with OG defaults)

- [ ] **Step 1: Create `app/sitemap.ts`**

```typescript
import type { MetadataRoute } from 'next'
import { listWork } from '@/lib/mdx'

const BASE = 'https://godsonadeola.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE,            lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/work`,  lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/lab`,   lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    ...listWork().map((w) => ({
      url: `${BASE}/work/${w.frontmatter.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
```

- [ ] **Step 2: Extend `app/layout.tsx` metadata with OG defaults**

Replace the `metadata` export with:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://godsonadeola.dev'),
  title: { default: 'godsonadeola.dev', template: '%s · godsonadeola.dev' },
  description: 'Security engineer in Columbus, Ohio. I build production-grade tooling that real teams actually use.',
  openGraph: {
    type: 'website',
    siteName: 'godsonadeola.dev',
    title: 'godsonadeola.dev',
    description: 'Security engineer in Columbus, Ohio.',
  },
  twitter: { card: 'summary' },
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: build includes sitemap; visit `http://localhost:3000/sitemap.xml` to confirm it serves.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(seo): sitemap + Open Graph defaults"
```

---

## Task 27: Lighthouse + a11y manual verification

**Files:**
- Create: `docs/LIGHTHOUSE_NOTES.md` (record run results)

- [ ] **Step 1: Run a production build + start**

```bash
npm run build
npm run start
```
(`npm run start` serves the production build on port 3000.)

- [ ] **Step 2: Run Lighthouse against home, /work/compass, /about**

Open Chrome DevTools → Lighthouse → run for each of:
- `http://localhost:3000/`
- `http://localhost:3000/work/compass`
- `http://localhost:3000/about`

For each, record the four scores (Performance, Accessibility, Best Practices, SEO).

- [ ] **Step 3: Write the results to `docs/LIGHTHOUSE_NOTES.md`**

Example:

```markdown
# Lighthouse pass — 2026-05-22

| URL | Perf | A11y | BP | SEO |
|---|---|---|---|---|
| /             | 99 | 100 | 100 | 100 |
| /work/compass | 95 | 96  | 100 | 100 |
| /about        | 98 | 100 | 100 | 100 |

Acceptance criterion §14.6: Perf ≥ 95 / A11y ≥ 95 / SEO ≥ 95 — PASS.

Known minor:
- /work/compass Perf 95 is bounded by the JS payload of the COMPASS demo;
  acceptable since the demo is the page's value.
```

- [ ] **Step 4: If any score is below the threshold (Perf < 95, A11y < 95, SEO < 95)**

Investigate via the Lighthouse report's flagged items. Common fixes: add `alt` text, give buttons `aria-label`, ensure heading order is sequential, fix contrast. Re-run after fixes.

- [ ] **Step 5: Commit**

```bash
git add docs/LIGHTHOUSE_NOTES.md
git commit -m "docs: Lighthouse pass notes — Perf/A11y/SEO ≥ 95 on home, COMPASS, about"
```

---

# Phase 8 — Deploy

## Task 28: GitHub repo + Vercel preview deploy

**Files:**
- (No file changes — operator-driven setup.)

**Important:** this task asks the user to perform a few interactive steps in their browser. The agent prepares everything locally; the user clicks through the GitHub + Vercel UIs.

- [ ] **Step 1: Confirm there's no Azure DevOps remote on this repo**

```bash
cd C:/Workspace/portfolio-website
git remote -v
```
Expected: no output (no remote set).

- [ ] **Step 2: Ask the user to create a new public GitHub repo**

Operator: open `https://github.com/new`. Repo name: `portfolio-website` (or another name of choice). Visibility: public (or private — both work). Do NOT initialize with README, .gitignore, or license — the repo already has all of that locally.

Operator copies the new repo's `git@github.com:<handle>/<reponame>.git` URL.

- [ ] **Step 3: Wire the new remote (operator runs this — agent does not push)**

Replace `<URL>` with the URL from Step 2:

```bash
cd C:/Workspace/portfolio-website
git remote add origin <URL>
git branch -M main
git push -u origin main
```

- [ ] **Step 4: Connect Vercel**

Operator: open `https://vercel.com/new`, sign in if needed, import the new GitHub repo. Vercel auto-detects Next.js. Defaults are correct (build command `npm run build`, output `.next`). Click Deploy.

Wait for the preview deploy to complete (≤ 2 min).

- [ ] **Step 5: Verify the preview URL**

Vercel shows a URL of the form `https://portfolio-website-<hash>.vercel.app`. Operator opens it. Verify:

- Home page loads with dark hero + five catalog rows
- All five `/work/<slug>` pages load
- COMPASS demo is interactive
- Reading-mode prose renders on `/work/compass` and `/about`
- `/lab` renders the appendix
- `/404` renders the terminal not-found

- [ ] **Step 6: (Optional, deferred) — point a custom domain at Vercel**

When the user picks a domain (per spec §15.b), add it via Vercel → Project → Settings → Domains. Vercel walks through DNS configuration. Not blocking for v1 — the `*.vercel.app` URL is sufficient until the domain decision is made.

- [ ] **Step 7: Document the live URL**

Create or update a top-level `README.md` in the repo:

```markdown
# portfolio-website

Personal portfolio site. Next.js 15 on Vercel.

- Live: <https://portfolio-website-...vercel.app> (or the custom domain once configured)
- Spec: `docs/superpowers/specs/2026-05-22-portfolio-website-design.md`
- Plan: `docs/superpowers/plans/2026-05-22-portfolio-website.md`

## Local dev

```bash
npm install
npm run dev
```

## Quality gates

```bash
npm run check:prose
npm run test
npm run typecheck
npm run build
```
```

- [ ] **Step 8: Commit the README + push**

```bash
cd C:/Workspace/portfolio-website
git add README.md
git commit -m "docs: README with live URL + dev quickstart"
git push
```

---

## Self-review

**Spec coverage:**

| Spec § | Requirement | Covered by |
|---|---|---|
| §1 | Goal — credibility-first portfolio | All pages combined |
| §2 | Audience | Voice in §16 + page contracts in §7 |
| §3 | Five projects + lab | Tasks 8 (frontmatter), 19–23 (demos), 24 (compass prose) |
| §4 | Tech stack: Next.js 15 + Tailwind + MDX | Tasks 1, 2, 4 |
| §5 | Hybrid design (dark + reading mode) | Tasks 4 (tokens), 14 (case-study surface transition) |
| §6 | IA / routes | Tasks 12 (/), 13 (/work), 14 (/work/[slug]), 15 (/lab), 16 (/about), 17 (/404), 18 (/resume.pdf) |
| §7 | Page contracts | Tasks 12–17 |
| §8 | Five interactive demos | Tasks 19–23, each scoped to spec's demo description |
| §9 | Content model (MDX + frontmatter contract) | Tasks 6, 8 |
| §10 | Repo layout | Tasks 1, 3, scaffolding tasks |
| §11 | Build + deploy plumbing | Tasks 1, 2, 28 |
| §12 | Accessibility + Lighthouse 95+ | Task 27 |
| §13 | Out of scope (no blog, no toggle, etc.) | Explicit absence — none of these are tasks |
| §14 | Acceptance criteria | All tasks combined; Task 27 is the explicit gate |
| §15 | Open questions for delivery | Task 28 step 6 (domain) + Task 18 (resume placeholder) |
| §16 | Voice & style discipline (banned-language) | Task 25 |

**Placeholder scan:** zero "TBD", "TODO", or "implement later" markers in code/prose tasks. The intentional placeholders are: skeleton prose in 4 non-COMPASS case studies (Task 8) — these are documented in spec §14.2 and intentional. `public/resume.pdf` is a documented placeholder per Task 18.

**Type consistency:**

- `WorkFrontmatter` interface defined in Task 6 is consumed unchanged in Tasks 10, 11, 14, 19, 20, 21, 22, 23 (via DemoSlot dispatch).
- `LabEntry` interface defined in Task 7 is consumed unchanged in Task 15.
- All demo components default-export a function returning a `React.ReactElement`; the dispatch map in `DemoSlot` consumes them as `() => React.ReactElement`.
- Theme tokens defined once in Task 4 (`tailwind.config.ts`) and used everywhere as `bg-bg-dark`, `text-text-dark-dim`, etc. — same names throughout.

No gaps identified.
