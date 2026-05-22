# portfolio-website

Personal portfolio site. Next.js 16 + Tailwind v4 + MDX, deployed on Vercel.

- Live: TBD (Vercel preview URL once connected)
- Spec: `docs/superpowers/specs/2026-05-22-portfolio-website-design.md`
- Plan: `docs/superpowers/plans/2026-05-22-portfolio-website.md`

## Local dev

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

## Quality gates

```bash
npm run check:prose   # banned-language lint
npm run test          # vitest
npm run typecheck     # tsc --noEmit
npm run build         # production build (runs check:prose first)
```

## Going live

1. Create a new public (or private) GitHub repo via https://github.com/new — do NOT initialize with README/.gitignore/license.
2. Add it as origin: `git remote add origin <url>` then `git branch -M main` then `git push -u origin main`.
3. Connect via https://vercel.com/new — import the new GitHub repo; defaults are correct.
4. (Later) point a custom domain at Vercel via Settings → Domains.

## Pre-launch checklist

- [ ] Replace `public/resume.pdf` placeholder with the real PDF.
- [ ] Fill the four non-COMPASS case studies' Approach / Hard problems / Outcomes sections in `content/work/*.mdx`.
- [ ] Update social link URLs in `app/about/page.tsx` (LinkedIn, GitHub, email).
- [ ] Update `metadataBase` in `app/layout.tsx` to the real domain once chosen.
- [ ] Update `BASE` in `app/sitemap.ts` to the real domain.
- [ ] Re-run Lighthouse manually post-deploy to confirm scores hold on the Vercel preview URL.
