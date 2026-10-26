# Purna Anantha — portfolio site

Personal portfolio for Purna Anantha (multi-platform writer, Jakarta; Head of UX Writer Hub at Telkom Indonesia).
Static site built with **Astro 7**, content edited in **Pages CMS**, deployed to **GitHub Pages**.

## Commands

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # → ./dist
npm run preview
```

Node 22.23.4 or newer is required (Astro 7). In zsh, don't paste commands with trailing `# comments` — they're passed as arguments.

## Deploy

- Repo: `funkadr0me/funkadr0me.github.io`, branch `main`. Live at https://funkadr0me.github.io.
- `.github/workflows/deploy.yml` (withastro/action) builds and publishes on every push to `main`.
- `site` in `astro.config.mjs` is `https://funkadr0me.github.io`; no `base` (user site, served from root).
- A custom domain is planned but not bought yet. When it is: change `site`, add `public/CNAME`, set DNS, set the domain in repo Settings → Pages (steps in README).
- **Pages CMS commits straight to `main`.** Always `git pull` before editing locally.

## Content (Pages CMS)

Content and code are separate; the CMS only touches `src/content/` and `public/images/`.

| What | Where | Format |
|---|---|---|
| Site text (label, typing roles, headline pairs, intro, about, contact, links) | `src/content/settings.json` | JSON |
| Projects | `src/content/projects/*.md` | Markdown collection |
| Writing | `src/content/writing/*.md` | Markdown collection |
| Experience, awards | `src/content/experience.json`, `awards.json` | JSON lists |
| Uploaded images | `public/images/` → `/images/...` | |

- Collections are defined in `src/content.config.ts` (glob loaders; `z` from `astro/zod`). The schema tolerates the CMS's empty values (`""`/`null`).
- A project/article with text below its frontmatter gets its own page (`/work/<file>/`, `/writing/<file>/`); with no text it links to `link`.
- `src/data/site.ts` loads everything for the pages (`getProjects`, `getWriting`, `settings`, …).
- **When adding or renaming a content field, update both `src/content.config.ts` and `.pages.yml`.**

## Design system

The look comes from the "Purna Anantha" design system (a claude.ai Design System artifact). `src/styles/tokens.css` mirrors its tokens by hand — change both together.

- Palette: Paper `#FFF1E5` background (FT Origami "paper"), ink `#1A1A1A`, warm hairline `#CCC1B7`; hues `claret #990F3D` (lead: links, active nav, about band), `oxford #0F5499` (content strategy), `teal #0D7680` (UX copywriting). `error #B00020` is close to claret — always pair with words.
- Contrast on Paper: ink 15.7:1, claret 7.6:1, oxford 6.9:1, teal 4.8:1 (keep teal off text under 14px).
- Type: `display` = Novela Regular (headlines), `sans` = Basier Circle Regular (everything else). Only weight 400 exists — never bold or italic.
- Editorial and quiet: flat surfaces, 1px hairlines, no shadows, no gradients, square-ish corners (`radius-sm` buttons, `radius-md` cards), generous space. Copy is plain, no emoji.

### Font licence (important)

Novela and Basier Circle are Atipo Foundry **webfont** licences: one website only (this portfolio), no desktop installation, no redistribution/modification/conversion. The repo is public (free GitHub Pages), which arguably exposes the font files — the owner knows; options are GitHub Pro (private repo) or asking info@atipo.es. Don't copy the fonts into any other project.

## Code map

```text
src/pages/index.astro          home page (hero, work, about band, writing, experience, contact)
src/pages/work/[id].astro      case study pages
src/pages/writing/[id].astro   article pages
src/layouts/BaseLayout.astro   <head>, nav, footer, motion on-switch
src/layouts/ArticleLayout.astro  shared layout + Markdown prose styles
src/components/                Nav, Button, Tag, ProjectCard, SectionHeader, Footer
src/styles/tokens.css          design tokens + type classes
src/styles/global.css          base styles
src/styles/motion.css          all animation (one easing curve, durations at the top)
src/scripts/motion.ts          scroll reveals, frosted nav past hero, typing roles in the label
prototypes/                    standalone HTML experiments — not part of the build
```

## Motion

- Everything is gated by the `motion` class on `<html>` (set in BaseLayout unless `prefers-reduced-motion`). Without JS or with reduced motion the page is static and fully visible — keep it that way.
- Easing `cubic-bezier(0.22, 1, 0.36, 1)`; reveals rise 32px and fade; claret band wipes in (colour on a `::before` so IntersectionObserver still sees the section).
- No libraries (no GSAP/Lenis); plain CSS + a small script.

## Flipping hero headline

Ported from `prototypes/flip-headline.html` (kept as the reference; not part of the build). Structure: `[Verb] [Noun]` / `across platforms.`

- Content: `pairs` (list of `verb` + `noun`) and `headlineTail` in `settings.json`, editable in Pages CMS. The static HTML shows the first pair.
- Motion **"Type + flip"**, layout **"Flush left — noun steps away"**: delete the verb with a claret cursor → noun flips away → type the new verb from the left edge → noun flips in 0.5s after. The noun only moves while hidden. Timings are constants at the top of `src/scripts/flip-headline.ts`; styles are section 7 of `motion.css`.
- Verb and noun always share one line; the script fits the headline font size to the longest pair (≈99px desktop, ≈35px phone with "Strategizing content"). A shorter longest verb gives a bigger phone headline.
- Accessibility: `aria-label` on the `<h1>` holds the current full sentence; animated spans are `aria-hidden`. Without JS or with reduced motion it is the first pair, static, wrapping normally.
- Open: the real pairs (current ones are placeholders), flip direction (now opposite), cursor colour (claret) and whether the cursor keeps blinking after the noun lands (it does), and whether the label's typing roles are now redundant (still there).

## Still to fill in (content)

Project images for the three Bukalapak cards, summaries for "Career website" and "Year End Review 2018", and a link for "Year End Review 2018".
