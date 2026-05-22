# Portfolio Website — Design

**Date:** 2026-05-22
**Subject:** Credibility-first personal portfolio website for Godson Adeola
**Author:** Godson Adeola (solo)
**Repo:** `C:/Workspace/portfolio-website/` (new, no remote yet)
**Output of:** brainstorming session 2026-05-22
**Next step:** writing-plans skill → implementation plan

---

## 1. Goal

A public personal portfolio website that anchors the engineer's reputation across three contexts simultaneously:

- **Primary:** public credibility — "Google my name → find this." Long-lived, ages well, demonstrates depth across security engineering, multi-agent LLM systems, and identity / SOC tooling.
- **Secondary 1:** job-hunting asset — the URL goes on a resume; recruiters and hiring managers click through.
- **Secondary 2:** targeted showcase — individual project URLs handed to specific recruiters when the role matches.

Primary optimization is credibility-first because that mode naturally serves the other two — a credible engineer's portfolio converts recruiters; project-deep pages serve targeted links.

## 2. Audience

- Senior software engineers
- Engineering managers / hiring managers
- Security engineering peers
- Technical recruiters (cold)

The site must read well to all four without pandering to any one of them.

## 3. Projects in scope

Five marquee projects, each with a dedicated case-study page, plus one "Lab" appendix listing smaller / single-file tools without dedicated pages.

| # | Slug | Title | One-line description |
|---|---|---|---|
| 01 | `compass` | COMPASS — Configuration Assessment Agent | Multi-agent LLM enrichment of CrowdStrike CIS findings against the official CIS benchmark PDF, with human-in-loop approval and automated ServiceNow change tickets. |
| 02 | `risk-register` | Risk Register | AI-powered enterprise risk management with LangGraph agents — intake, scoring, monitoring, mitigation tracking. FastAPI + Celery + Next.js. |
| 03 | `mail-ioc-scanner` | Mail IOC Scanner | Microsoft Graph harvesting + VirusTotal / urlscan.io / AbuseIPDB enrichment for shared mailbox triage. SOC tool, deterministic, no LLM. |
| 04 | `event-planner` | Event Planner — CrewAI | Multi-agent event-planning web app on CrewAI, demonstrating agent collaboration patterns outside the COMPASS pipeline. |
| 05 | `cyberark-sdk` | CyberArk Python SDK | REST API wrapper for CyberArk privileged-access workflows, authored from scratch. |

The Lab appendix (`/lab`) lists smaller projects (Phishing email triage scripts, F5 decryptor, Burp extensions, Hybrid Analysis tooling, CyberArk admin utilities) as a one-line catalog. No deep pages.

## 4. Tech stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 15 (App Router, React Server Components default)** | Mainstream resume signal; modern default; Vercel-native. |
| Styling | **Tailwind CSS** | Co-locates style with markup; small bundles; large ecosystem. |
| Content format | **MDX** | Markdown for prose; JSX for embedded interactive demos. Git as source of truth. |
| Theme | **Single fixed theme — no dark/light toggle** | Hybrid design already handles dark+light by surface (homepage dark, reading mode light). Toggle adds complexity without value. |
| Hosting | **Vercel free tier** | Auto-deploy on `git push main`; zero ops; one-click preview deploys. |
| Repo host | **GitHub** (handle TBD) | Public repo (no source-link rendered on the site if the user prefers private). |
| Domain | **TBD** — `.dev` or `.engineer` preferred for credibility tone | Provisioned later. Vercel default URL works in the interim. |
| Backend | **None** | No CMS, no database, no API. Static site with a few client components. |

**Out:** Notion / Cargo / Carrd / Linktree (excluded as page-builder feel) ; SvelteKit / Astro (not chosen — Next.js wins on resume signal); Hugo / 11ty / plain HTML (not chosen — interactive demos demand a React-aware stack).

## 5. Design direction

### 5.1 Aesthetic — hybrid

Two surfaces, each with its own treatment:

| Surface | Treatment | Rationale |
|---|---|---|
| **Homepage, project catalog, project landing tiles, navigation, `/lab`** | **Terminal / dark** — `#0d1117` background, `#c9d1d9` body text, `#5ee2a2` neon-green accent, monospace throughout (JetBrains Mono), `~/` prompt branding, `[NN · slug]` catalog IDs, `// section_label/` headings. | Engineer-coded surface. Signals affinity with the audience. Strong personality on first impression. |
| **Long-form case-study prose inside each `/work/<slug>` page** | **Reading mode** — cream background (`#f6f1ea`), dark text (`#1a1a1a`), serif body (Charter / Iowan Old Style fallback chain), mono-only for metadata / file paths / code, desaturated teal accent (`#2d8a8a`). | Long-form reading is punished by dark/mono. The case studies are 1500–3000 words each; readability wins. |

Transition between the two surfaces happens at a clear visual break inside the project page — the interactive demo and metadata stay dark/mono at the top; the prose body switches to reading mode below a horizontal rule.

### 5.2 Typography

- **Body (reading mode):** Charter, Iowan Old Style, Georgia, serif (system fallback chain).
- **Monospace:** JetBrains Mono, SF Mono, Consolas, monospace.
- **UI (terminal surfaces):** monospace only — no sans-serif fallback.
- **Headings (reading mode):** body serif at scaled sizes, no separate display face.

### 5.3 Color tokens

```
--bg-dark:        #0d1117
--bg-dark-panel:  #161b22
--border-dark:    #1f2630
--text-dark:      #c9d1d9
--text-dark-dim:  #8b949e
--text-dark-mute: #6e7681
--accent-dark:    #5ee2a2   /* neon green */

--bg-light:       #f6f1ea   /* cream */
--bg-light-panel: #ece7de
--border-light:   #e8e3d8
--text-light:     #1a1a1a
--text-light-dim: #555555
--accent-light:   #2d8a8a   /* desaturated teal */
```

## 6. Information architecture

```
/                            → home (dark hero + 5-project catalog + lab teaser)
/work                        → project index (dark, same as home catalog)
/work/compass                → COMPASS case study
/work/risk-register          → Risk Register case study
/work/mail-ioc-scanner       → Mail IOC Scanner case study
/work/event-planner          → CrewAI Event Planner case study
/work/cyberark-sdk           → CyberArk SDK case study
/lab                         → appendix list of smaller projects (one-line each)
/about                       → bio, credentials, social links
/resume.pdf                  → static asset (user supplies later)
/404                         → custom 404 page (terminal-themed)
```

**Site navigation (every page):** `~/godsonadeola.dev` brand → `work` / `notes` (TBD; see §13) / `about` → `contact →`

**Footer (every page):** copyright + last-deploy timestamp (from Vercel env var) + a single mono accent line crediting Next.js + Vercel.

## 7. Page contracts

### 7.1 Home (`/`)

Sections, top to bottom (all on dark surface):

1. **Nav bar** — terminal-style, sticky.
2. **Hero** — `whoami` prompt, headline (two-line, ~14 words), 60-word lede, "currently" callout (one sentence, refresh manually each deployment, no automation).
3. **Selected work** — five-row catalog. Each row: `[NN · slug]` + title + one-line description + `→` link to `/work/<slug>`.
4. **Lab teaser** — single line: "Smaller tools and one-off scripts live in `/lab`."
5. **Footer.**

### 7.2 Case study (`/work/<slug>`)

Top half — dark surface:

1. **Nav bar.**
2. **Project header** — `[NN · slug]` catalog ID + title + one-line description + project metadata block (stack, role, scope, year — mono).
3. **Interactive demo** — full-width component slot. The demo is a Client Component imported from `/components/demos/<slug>/`. Each demo is project-specific (see §8).
4. **Horizontal rule** — visual transition into reading mode.

Bottom half — reading mode (cream surface):

5. **Problem** — 1–2 paragraphs naming the original problem and constraints. Why this needed to exist.
6. **Approach** — 1–2 paragraphs describing the high-level approach and design tradeoffs.
7. **Hard problems** — 3–5 subsections, one per significant technical challenge solved. Each subsection has a title, 2–4 paragraphs, and (optional) one code block, screenshot, or callout.
8. **Stack** — bulleted list of technologies, libraries, infra.
9. **Outcomes** — 1 paragraph + bullet list of concrete results (hedged where appropriate; no invented metrics).
10. **Footer.**

**COMPASS-specific exception:** the §7.2 prose mines content from `C:/Workspace/configuration-assessment-agent-pg/docs/portfolio/compass-script.md` — specifically §3/§4/§5/§6 (the four "Hard problems" sections) become the case study's Hard-problems body. The §7 (production posture) and §8 (cost story) content folds into the Stack and Outcomes sections respectively. No double writing.

### 7.3 Lab (`/lab`)

Dark surface. Single-column list — one row per small project:

```
[ year ]  <project-name>             <one-line-description>
```

Up to ~10 entries. No deep pages, no links beyond an optional GitHub URL per row if public.

### 7.4 About (`/about`)

Dark surface above the fold, reading mode for the bio body.

1. **Header** — name + role + city.
2. **Bio** — 3–4 sentences. Engineer-to-engineer voice. Same voice rules as the COMPASS script (no "leverage", "passionate about", etc.).
3. **Credentials block** — one bulleted block, mono, ≤ 6 lines: years experience, current focus, languages, frameworks.
4. **Social links** — three only: LinkedIn, GitHub, email. Mono link styles.
5. **Resume PDF link** — single mono line: `→ download resume.pdf`.

No photo unless user adds one later via a single image asset in `/public/`.

### 7.5 404 (`/404`)

Terminal-themed:

```
$ cd /that-page
bash: /that-page: No such file or directory

[ home ]   [ work ]   [ contact ]
```

## 8. Interactive demos (one per marquee project)

Each demo is a React Client Component at `/components/demos/<slug>/index.tsx`. Demos run client-side only — no backend, no live API calls. Seeded with realistic mock data; never query real services.

| Slug | Demo scope |
|---|---|
| `compass` | Mock dashboard index page — three findings (CRITICAL Edge, HIGH Chrome, MEDIUM Edge) with the actual COMPASS UI styling (dark, severity columns, decision pills, ↻ Auto-decided badge). Click a row → inline expansion shows the finding's narrative + verifier evidence + CIS citation. Approve / Disapprove buttons are inert (visual only, with a toast saying "demo mode"). |
| `risk-register` | Mock risk heat map — 5×5 grid (likelihood × impact) with 6–8 seeded risks plotted. Click a risk → side panel shows risk title, owner, score, mitigation status. Interactive only at the visualization level. |
| `mail-ioc-scanner` | Paste-an-email box (textarea pre-filled with a sample phishing email). Click "Extract IOCs" → mock extraction renders cards with IPs / URLs / sender + simulated VT / urlscan / AbuseIPDB verdicts (all canned). |
| `event-planner` | Single-input form: "Plan an event for ___". Click "Plan" → animated multi-agent "thinking" log streams to a terminal-style output (mocked, not real LLM calls), then renders a sample event plan card. |
| `cyberark-sdk` | Two-column REST playground. Left: dropdown of endpoint examples (`get_safes`, `list_accounts`, `create_user`). Right: tabbed view of `python` SDK invocation, the underlying HTTP request, and the mock JSON response. Copy-to-clipboard on each. |

**Demo discipline:**
- Every demo gets a `[demo mode — seeded mock data]` badge somewhere visible.
- No real network calls.
- Demos must look real (uses the real product's color and component style where appropriate) but be obviously not-the-real-thing.
- Each demo's code is < 400 lines including data fixtures. If it grows beyond, decompose into sub-components.

## 9. Content model

All content lives as files in the repo. No CMS.

```
content/
  work/
    compass.mdx
    risk-register.mdx
    mail-ioc-scanner.mdx
    event-planner.mdx
    cyberark-sdk.mdx
  lab/
    entries.json          # array of {year, name, description, url?}
  about.mdx
```

**MDX frontmatter contract (per case study):**

```yaml
---
slug: compass
title: COMPASS — Configuration Assessment Agent
catalogId: "01"
catalogTag: llm-pipeline
oneLiner: Multi-agent LLM enrichment of CrowdStrike CIS findings ...
year: 2026
role: Solo engineer
stack: [Python, Next.js, Postgres, pgvector, Docker, OpenTelemetry]
demoComponent: compass    # resolves to /components/demos/compass
seo:
  description: ...
  ogImage: /og/compass.png    # optional, can be added later
---
```

Body of each MDX file follows the §7.2 section order (Problem / Approach / Hard problems / Stack / Outcomes).

## 10. Repo layout

```
portfolio-website/
├─ app/                          # Next.js App Router
│  ├─ layout.tsx
│  ├─ page.tsx                   # home
│  ├─ work/
│  │  ├─ page.tsx                # work index
│  │  └─ [slug]/page.tsx         # case study
│  ├─ lab/page.tsx
│  ├─ about/page.tsx
│  └─ not-found.tsx              # 404
├─ components/
│  ├─ ui/                        # nav, footer, prompt, catalog row, etc.
│  └─ demos/
│     ├─ compass/
│     ├─ risk-register/
│     ├─ mail-ioc-scanner/
│     ├─ event-planner/
│     └─ cyberark-sdk/
├─ content/
│  ├─ work/*.mdx
│  ├─ lab/entries.json
│  └─ about.mdx
├─ lib/
│  ├─ mdx.ts                     # MDX loader + frontmatter parser
│  └─ catalog.ts                 # builds the project catalog from frontmatter
├─ public/
│  ├─ resume.pdf                 # user supplies
│  └─ og/                        # social cards (optional)
├─ styles/
│  └─ globals.css                # tailwind + theme tokens
├─ docs/
│  └─ superpowers/
│     ├─ specs/
│     └─ plans/
├─ tailwind.config.ts
├─ next.config.mjs
├─ package.json
├─ tsconfig.json
└─ .gitignore
```

## 11. Build, deploy, & local dev

- **Local dev:** `npm install && npm run dev` → `http://localhost:3000`.
- **Production build:** `npm run build` → static pages where possible (each `/work/<slug>` page is statically generated at build time via `generateStaticParams`).
- **Deploy:** push to `main` of the GitHub repo → Vercel builds and deploys. Preview deploys on every PR.
- **No environment variables required** to build or run. Domain and any analytics keys are added later as Vercel env vars.

## 12. Accessibility & performance

- **Semantic HTML** throughout (`<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`).
- **Keyboard navigation** — every interactive demo control reachable via Tab; focus rings visible.
- **Color contrast** — both surface treatments meet WCAG AA (4.5:1 for body, 3:1 for large text). The neon-green `#5ee2a2` on `#0d1117` and the teal `#2d8a8a` on `#f6f1ea` both pass.
- **Image discipline** — every `<img>` has `alt` text; project demo screenshots use `next/image` with explicit dimensions.
- **Lighthouse target:** 95+ for Performance, Accessibility, Best Practices, SEO on the home page and at least one case study at build time.
- **No JS on routes that don't need it** — the home page, about, and lab routes ship near-zero JS (Server Components). Demo routes ship demo-component JS only.

## 13. Out of scope (v1)

- Blog / `/notes` index — the nav reserves the slot but doesn't link. Add post-v1 if desired.
- Talks index, newsletter signup, RSS feed.
- Dark/light theme toggle (hybrid handles both surfaces by design).
- Analytics integration (add later via Vercel Analytics or Plausible if desired).
- Social-card / Open Graph image generation (frontmatter slot exists; assets supplied later).
- Comment system on any page.
- Real LLM calls inside any demo.
- Multi-language support.
- A separate "Lessons learned" section per case study (folds into Outcomes if substantive).

## 14. Acceptance criteria

The site is shippable when:

1. All five `/work/<slug>` pages render with frontmatter populated and the five section headings (Problem / Approach / Hard problems / Stack / Outcomes) present.
2. **COMPASS case study prose is fully populated** (mined from `docs/portfolio/compass-script.md`). The other four case studies ship with skeleton prose (a 2–3 sentence Problem section + populated Stack section + placeholder Outcomes) and are filled in iteratively post-v1 — each is a follow-up task, not a v1 blocker.
3. All five interactive demos render and are operable without console errors.
4. `/`, `/work`, `/lab`, `/about`, `/404` render correctly.
5. The hybrid design is visually consistent: dark surfaces use the dark token set, reading-mode surfaces use the light token set; the transition inside `/work/<slug>` is a single visible boundary, not a gradient.
6. Lighthouse home-page run hits Performance ≥ 95, Accessibility ≥ 95, SEO ≥ 95.
7. No banned language in any prose shipped at v1 (see banned-language list from the COMPASS script spec — same rules apply here).
8. The repo deploys to Vercel from `main` on push, with the preview URL reachable.
9. `/resume.pdf` route resolves (file may be a placeholder PDF until the user supplies the real one).

## 15. Open questions for delivery (not blocking spec approval)

- **a.** GitHub repo handle and visibility (public / private).
- **b.** Domain name (`.dev` vs `.engineer` vs other).
- **c.** Whether to render a "View source on GitHub" footer link per case study (depends on which COMPASS / Risk Register repos can be made public).
- **d.** Whether to add Vercel Analytics or Plausible.
- **e.** Final bio copy (3–4 sentences) and credentials block for `/about`.
- **f.** Whether to publish a profile photo on `/about`.
- **g.** Final `currently` line on the home page (refreshed manually per deploy).
- **h.** Whether the Lab entries grow beyond ~10 (if so, add filtering / search; current spec assumes a fixed short list).

These are decided during or after implementation, not now.

## 16. Voice & style discipline

Inherits the COMPASS script's voice rules (see `C:/Workspace/configuration-assessment-agent-pg/docs/superpowers/specs/2026-05-22-portfolio-presentation-script-design.md` §5).

In short:

- First-person singular.
- Concrete nouns over abstractions.
- No claim that cannot be defended from code, commits, or specs.
- Banned: "leverage", "robust", "best-in-class", "cutting-edge", "seamless", "world-class", "AI-powered", "passionate about".
- Honest hedges over invented metrics — applies to every Outcomes section.

A prose lint pass at build time (or at PR time) greps for the banned list and fails the build on any hit. Implementation detail; documented in the plan.
