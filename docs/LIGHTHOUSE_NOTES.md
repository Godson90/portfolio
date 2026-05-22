# Lighthouse pass — 2026-05-22

Scores captured via programmatic Lighthouse run against `npm run start` (production build).

| URL | Perf | A11y | BP | SEO |
|---|---|---|---|---|
| / | 91 | 90 | 100 | 100 |
| /work/compass | 95 | 96 | 100 | 100 |
| /about | 97 | 95 | 100 | 100 |

Acceptance criterion §14.6: Perf ≥ 95 / A11y ≥ 95 / SEO ≥ 95 — **FAIL** (home page misses Perf at 91 and A11y at 90).

Notes:
- Run via: `npx lighthouse@latest <url> --chrome-flags="--headless --no-sandbox" --quiet --only-categories=performance,accessibility,best-practices,seo`
- JSON reports saved to lh-home.json, lh-compass.json, lh-about.json (gitignored)
- Lighthouse exits with a Windows EPERM error on temp-dir cleanup — this is a known lighthouse/chrome-launcher issue on Windows with restricted temp permissions. The audit data is fully written before the error; scores are valid.

## Accessibility concerns (home page — a11y 90)

Two failing audits on `/`:

1. **color-contrast** — Elements with class `text-text-dark-mute` (the `tracking-widest uppercase` label above the hero) and at least two `<span>` elements do not meet the 4.5:1 contrast ratio. Fix: raise the `--text-dark-mute` token value to pass WCAG AA against the dark surface background.

2. **link-in-text-block** — The `/lab` anchor (`<a class="text-accent-dark">`) relies solely on colour to distinguish itself from surrounding body text. Fix: add `underline` decoration (or a visible border-bottom) to links within prose paragraphs on the dark surface.

## Performance concerns (home page — perf 91)

- **Total Blocking Time: 360 ms** — main-thread work during page load; investigate React hydration cost and defer non-critical JS.
- **Unused JavaScript: ~51 KiB savings** — tree-shake or code-split bundles loaded on the home route.
- **Legacy JavaScript: ~12 KiB savings** — ensure `@babel/preset-env` / Next.js target is `es2017+`; remove transpiled polyfills for modern browsers.
- **Render-blocking requests: ~30 ms savings** — any synchronous `<link rel="stylesheet">` or `<script>` in `<head>` should be deferred or inlined.

## Pages that meet all targets

| URL | Perf | A11y | SEO | Status |
|---|---|---|---|---|
| /work/compass | 95 | 96 | 100 | PASS |
| /about | 97 | 95 | 100 | PASS |

## Re-running after fixes

```bash
npm run build && npm run start &
npx lighthouse@latest http://localhost:3000/ --chrome-flags="--headless --no-sandbox" --quiet --only-categories=performance,accessibility,best-practices,seo
```
