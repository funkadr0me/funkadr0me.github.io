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
| Site text (label, typing roles, headline verbs and nouns, intro, about, contact, links) | `src/content/settings.json` | JSON |
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
src/pages/index.astro          home page (hero, work index, about band, writing once there are 3+ pieces, experience and awards, contact)
src/pages/work/[id].astro      case study pages
src/pages/writing/[id].astro   article pages
src/layouts/BaseLayout.astro   <head>, nav, footer, motion on-switch
src/layouts/ArticleLayout.astro  shared layout + Markdown prose styles
src/components/                Nav, Button, Tag, ProjectCard (a card of the work grid, or a compact row on the advertising page), SectionHeader, Footer
src/styles/tokens.css          design tokens + type classes
src/styles/global.css          base styles
src/styles/home.css            the home page's layout (Hallmark stamp on line 1), role tokens, 12-column grid
src/styles/motion.css          all animation (one easing curve, durations at the top)
src/scripts/motion.ts          scroll reveals, frosted nav past hero, typing roles in the label
prototypes/                    standalone HTML experiments — not part of the build
```

## Home page layout (Hallmark redesign, full depth)

Specimen shape, brand kept (tokens, fonts, palette untouched). Hero: headline, then the intro and actions under a hairline; the work index starts at the fold. Work is a grid of cards, four across on a wide screen so it fits one screen (two on a tablet, one on a phone): picture, client, title, summary and link under a hairline, no box (tags are left to the case studies to keep the screen under its word budget); the whole card is the link, the title turning claret is the one hover, and the links line up at the bottom; about is the claret band split into heading and statement, with the typing roles line moved under it; writing gets its own section and nav link only from three pieces (`WRITING_SECTION_MIN` in `site.ts`), and until then each piece is a link in an "I also write about the craft" line in the About band; experience is a table; awards four across; contact is a statement with the email set large. Nav and Footer are shared, so the case-study and article pages pick them up. On the home page the nav underline follows the section in view (script in `Nav.astro`); nav jumps land the heading just under the nav (`scroll-margin-top` in `home.css`).

- The hero no longer carries the label line (Hallmark gates 54/63 and the 80-word screen budget); "Multi-platform writer in Jakarta: <typed role>" sits in the about band.
- Gates run with `node ~/.claude/skills/hallmark/scripts/sloplint.mjs`; it only sees an `.astro` page's CSS when they share a folder, so lint a flattened copy for the static pass and `--url` for the render pass. `.hallmark/` holds the records and screenshots (ignored except `log.json`).
- Earlier work: projects with `era: earlier` (OPPO, HSBC #StartSekarang, Garuda Indonesia, Jala PRT, Jalan Sesama; real stills from the Tumblr archive) are listed on `src/pages/work/advertising-and-scriptwriting.astro` in compact rows. The home page shows one "Advertising & scriptwriting" row that links there; the page ends with a link to the full Tumblr archive. A project can carry an optional `secondLink`/`secondLinkLabel` (Jalan Sesama links to the Medium article about it).
- The road so far (experience + awards) is one section sized to fit a 1440 x 900 screen. Award logos live in `public/images/awards/` (Citra Pariwara's edition number and festival line cut off), shown in ink with a CSS filter; set per award in `awards.json` (`logo`; `detail` takes one line per win). Company logos replace the company names in the experience rows: ink PNGs in `public/images/logos/`, mapped by exact company name in `src/content/logos.json` ("Company logos" in Pages CMS); a company without a logo stays as text. `logoSize()` in `site.ts` sizes every logo to a similar area so wide and compact marks weigh the same.
- A project's `image` is its case-study cover; the home row shows `thumb` when set (an illustrated take in ink-and-wash, made outside the repo, 4:3 at 1600px), otherwise `image`.

## Motion

- Everything is gated by the `motion` class on `<html>` (set in BaseLayout unless `prefers-reduced-motion`). Without JS or with reduced motion the page is static and fully visible — keep it that way.
- Easing `cubic-bezier(0.22, 1, 0.36, 1)`; reveals rise 32px and fade; claret band wipes in (colour on a `::before` so IntersectionObserver still sees the section).
- No libraries (no GSAP/Lenis); plain CSS + a small script.

## Flipping hero headline

Ported from `prototypes/flip-headline.html` (kept as the reference; not part of the build). Structure: `[Verb] [Noun]` / `across platforms.`

- Content: `verbs`, `nouns` (two lists, any lengths) and `headlineTail` in `settings.json`, editable in Pages CMS. The static HTML shows the first verb and the first noun; the loop turns both wheels one step at a time, so with different lengths the combinations keep shifting. The longest verb plus the longest noun sets the phone size.
- Motion **"Type + flip"**, layout **"Flush left — noun steps away"**: delete the verb with a claret cursor → noun flips away → type the new verb from the left edge → noun flips in 0.5s after. The noun only moves while hidden. Timings are constants at the top of `src/scripts/flip-headline.ts`; styles are section 7 of `motion.css`.
- Verb and noun always share one line; the script fits the headline font size to the longest pair (≈99px desktop, ≈35px phone with "Strategizing content"). A shorter longest verb gives a bigger phone headline.
- Accessibility: `aria-label` on the `<h1>` holds the current full sentence; animated spans are `aria-hidden`. Without JS or with reduced motion it is the first pair, static, wrapping normally.
- Loops pause (Hallmark gate 18, WCAG 2.2.2): `src/scripts/loop-control.ts` gates the headline and the typing roles on being on screen, tab visible, pointer/focus away, and the "Pause motion" button in the hero. A change that has begun always finishes. The cursor blinks four beats after the noun lands, then rests hidden; the roles cursor blinks three beats while it rests.
- Verb and noun are two wheels: a click on the verb retypes just the verb (the noun flips out and back in as the same word), a click on the noun flips just the noun, so new combinations appear. Each word is a real button laid over its slot (`flip-hit`) with a claret hairline cue on hover/focus (always faint on touch); a visitor's click restarts the 4.5s rest; keyboard focus pauses the loop. The visible words are aria-hidden and the sentence lives in the `<h1>` aria-label plus a polite status line.
- Open: the real verbs and nouns (the current ones are placeholders), flip direction (now opposite), and whether a combination should link to a project (not built).

## Still to fill in (content)

The three Bukalapak write-ups (tone and voice, Year End Review, careers website) were rewritten in Purna's voice in November 2026, each with a `role` line. Every fact in them traces to Purna or to the project's own files (old work files in iCloud, the Web Archive); claims that couldn't be traced, such as "visits tripled", were dropped, so don't add numbers back without a source. Images live in `public/images/work/<project>/`. Several phone screens sit in a `<div class="shots">` gallery of `<figure>`s, styled in ArticleLayout; a single phone screen gets a `<figure style="max-width: 320px">` so it doesn't fill the column. careers.bukalapak.com now redirects to bukalapak.com, so that project has no external link.

Still open: a humanizer pass on the three write-ups (keep the short landing lines, the glossed Indonesian, the quotations and the HTML intact), and the other case studies, which haven't been rewritten yet.
