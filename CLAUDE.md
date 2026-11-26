# Purna Anantha — portfolio site

Personal portfolio for Purna Anantha (multi-platform writer, Jakarta; Head of UX Writer Hub at Telkom Indonesia).
Static site built with **Astro 7**, content edited in **Pages CMS**, deployed to **GitHub Pages**.

## Commands

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # → ./dist
npm run preview
npm run resume:pdf   # rebuilds the site, then reprints public/Purna-Anantha-Resume.pdf (needs Chrome)
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
| Site text (label, roles, headline verbs and nouns, intro, about, contact, links) | `src/content/settings.json` | JSON |
| Projects | `src/content/projects/*.md` | Markdown collection |
| Writing | `src/content/writing/*.md` | Markdown collection |
| Experience, awards (the home page's short lists) | `src/content/experience.json`, `awards.json` | JSON lists |
| Resume page (summary, full job history, skills, education, awards, languages) | `src/content/resume.json` | JSON |
| Uploaded images | `public/images/` → `/images/...` | |

- Collections are defined in `src/content.config.ts` (glob loaders; `z` from `astro/zod`). The schema tolerates the CMS's empty values (`""`/`null`).
- A project/article with text below its frontmatter gets its own page (`/work/<file>/`, `/writing/<file>/`); with no text it links to `link`.
- The email is stored in two parts, `emailUser` and `emailDomain` in `settings.json`, and `src/components/Email.astro` joins them in the browser, so the address isn't one plain string in the page HTML or the repo file (light spam protection, November 2026). Without JavaScript it reads "name [at] domain". Use `<Email />` wherever the address is shown. The resume PDF still carries the full address (Chrome runs the script when printing), as it should for applications. When the custom domain is bought, the plan is a forwarding address (e.g. hello@domain) in place of the Gmail.
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
src/pages/resume.astro         the resume page (/resume/), also the source of the PDF
scripts/resume-pdf.mjs         prints /resume/ to public/Purna-Anantha-Resume.pdf with headless Chrome
src/layouts/BaseLayout.astro   <head>, nav, footer, motion on-switch
src/layouts/ArticleLayout.astro  shared layout + Markdown prose styles: a centred 680px text column in a 1100px band (`.shots` and `figure.wide` take the band; narrower pictures and the cover start on the text's left edge; `.shots.in-column` keeps a row to the text column); `<div class="shots even">` with `style="--ratio: w/h"` on each figure sets mixed-shape pictures at one height
src/components/                Nav, Button, Tag, ProjectCard (a card of the work grid, or a compact row on the advertising page), SectionHeader, Footer
src/styles/tokens.css          design tokens + type classes
src/styles/global.css          base styles
src/styles/home.css            the home page's layout (Hallmark stamp on line 1), role tokens, 12-column grid
src/styles/motion.css          all animation (one easing curve, durations at the top)
src/scripts/motion.ts          scroll reveals, frosted nav past hero, starts the split-flap headline
src/scripts/flip-headline.ts   the split-flap hero headline
prototypes/                    standalone HTML experiments — not part of the build
```

## Home page layout (Hallmark redesign, full depth)

Specimen shape, brand kept (tokens, fonts, palette untouched). Hero: exactly one screen under the sticky header (`min-height: 100svh - --header-h`; Nav.astro keeps `--header-h` current when the header wraps on a phone): the headline and its subheadline (the intro, 20-28px, no hairline) centred in the free space as one group, and a scroll cue instead of buttons, so the work index starts at the fold and never peeks in. On the narrowest or shortest phones (under 24rem wide, or 40rem tall) the hero's spacing tightens so it still fits. Every section but the contact ends in a scroll cue (`ScrollCue.astro`, a quiet 12px label with a 44px target, pinned 8px above the bottom of its screen on the left margin: "Scroll to see work", "…profile", "…experience", "Scroll to contact me"), a real link to the next section. `html.motion:has(.hero)` sets `scroll-snap-type: y proximity` so each screen settles into place without pulling anyone who stops partway; it is off with reduced motion. Work, About and Experience are each at least one screen tall (`min-height`, so every cue lands in the same place) and fit one 1440 x 900 screen (Experience rows are 8px padded to do so, with room under the last row for the cue); keep them that way when adding rows. The nav underline follows the scroll position (a section counts while any of it is between the header and 40% of the screen), not an IntersectionObserver, which left the previous section marked once the next was snapped under the header. The hero has no buttons: the nav carries Resume and Contact. Work is a grid of cards, four across on a wide screen so it fits one screen (two on a tablet, one on a phone): picture, client with a short role (`cardRole`, e.g. "Bukalapak · UX writing lead"), title, summary and link under a hairline, no box (tags are left to the case studies to keep the screen under its word budget); the whole card is the link, the title turning claret is the one hover, and the links line up at the bottom; about is the claret band split into heading and statement (the CMS text is split into paragraphs at each new line, each balanced so none ends on a short widow line; the statement steps down to 20.8px under 360px wide to stay within six lines, where balancing stops), with the roles line under it and Purna's photo under the heading (`portrait` and `portraitAlt` in `settings.json`, `public/images/about/portrait.jpg`, shown in black and white by a CSS filter so it doesn't fight the claret); writing gets its own section and nav link only from three pieces (`WRITING_SECTION_MIN` in `site.ts`), and until then each piece is a link in an "I also write about the craft" line in the About band; experience is a table; awards four across; contact is a statement with the address and LinkedIn as a pair of buttons (primary and secondary). One type scale for the home page (tokens in `home.css`): hero 52-128px (`--fs-hero`, also capped at 14svh so the headline and subheadline fit a short screen) with the subheadline at 20-28px, section titles 40-58px, About statement 24-32px, card and row titles 24-28 / 20-24px, lead 17-20px, body 16px, small 14px; one rhythm (`--rhythm`, 64-96px) between sections and inside the About band; every button 48px tall (the nav's Contact too). Nav and Footer are shared, so the case-study and article pages pick them up. On the home page the nav underline follows the section in view (script in `Nav.astro`); nav jumps land the heading just under the nav (`scroll-margin-top` in `home.css`).

- The hero no longer carries the label line (Hallmark gates 54/63 and the 80-word screen budget); the roles line ("UX writer, content strategist, copywriter and scriptwriter.", built from `roles`) sits in the about band; it used to start "Multi-platform writer in Jakarta:", taken out because the nav carries the label on every page and the footer the place. It used to type one role at a time; it became static in November 2026, because a glance showed only one role and the headline's loop is the page's one piece of looping motion.
- Gates run with `node ~/.claude/skills/hallmark/scripts/sloplint.mjs`; it only sees an `.astro` page's CSS when they share a folder, so lint a flattened copy for the static pass and `--url` for the render pass. `.hallmark/` holds the records and screenshots (ignored except `log.json`).
- Earlier work: projects with `era: earlier` (OPPO, HSBC #StartSekarang, Garuda Indonesia, Milo, Jala PRT, Jalan Sesama; real stills from the Tumblr archive; Jala PRT is back since November 25, 2026, with "I wrote the copy" in its summary, because its awards stay in the home page's awards block) are listed on `src/pages/work/advertising-and-scriptwriting.astro` in compact rows. The home page shows one "Advertising & scriptwriting" row that links there; the page ends with a link to the full Tumblr archive. A project can carry an optional `secondLink`/`secondLinkLabel` (Jalan Sesama links to the Medium article about it).
- The road so far (experience + awards) is one section sized to fit a 1440 x 900 screen. Award logos live in `public/images/awards/` (Citra Pariwara's edition number and festival line cut off), shown in ink with a CSS filter; set per award in `awards.json` (`logo`; `detail` takes one line per win). Company logos replace the company names in the experience rows: ink PNGs in `public/images/logos/`, mapped by exact company name in `src/content/logos.json` ("Company logos" in Pages CMS); a company without a logo stays as text. `logoSize()` in `site.ts` sizes every logo to a similar area so wide and compact marks weigh the same.
- A project's `image` is its case-study cover; the home row shows `thumb` when set (an illustrated take in ink-and-wash, made outside the repo, 4:3 at 1600px), otherwise `image`.

## Resume page and PDF

- `/resume/` is linked from the nav ("Resume") and from "Full resume" in the home page's road-so-far header. Content is `src/content/resume.json` (Pages CMS: "Resume"); sources were the owner's Notion resume and LinkedIn profile (November 2026). Where the two differ: Bukalapak ends March 2022 (Notion); Pluang is "Product & UX Copywriting Manager" and the Telkom chapter is "AI & Experience" (owner's call, November 2026); Citra Pariwara stays at the lower count, "1 Silver and 1 Bronze" (the owner is unsure of LinkedIn's "2 Bronze and 1 Silver"), on the resume, in `awards.json` and in the Jala PRT summary.
- On the page, email, LinkedIn and website sit in a "Contact" section at the bottom (`.no-print`), not under the name. The PDF is unchanged by that (owner's call, November 26, 2026): it keeps them under the name (`.print-only`) with the live host from `site`. `website` in `resume.json` is the page's placeholder, `purnaanantha.example`, until the domain is chosen.
- Built to be ATS-friendly: one column of real text, standard headings (Summary, Work experience, Skills, Education, Certifications, Awards, Languages), plain dates ("January 2023 - Present"), role / company / dates on separate lines, no icons, no text in images, no layout tables, no motion hooks (`data-reveal`). Keep it that way.
- The PDF is the same page printed with its `@media print` rules (A4, black on white, Georgia and Arial: the Novela and Basier webfonts are licensed for this website only, so they are not embedded). It is tagged, titled and about 150 KB. **After any change to `resume.json` or the print rules, run `npm run resume:pdf` and commit the PDF**; Pages CMS edits don't regenerate it, and the deploy workflow doesn't either.
- The home page's `.job`, `.awards`, `.contact` classes are global (home.css); the resume page's own classes are named `.entry`, `.reach` and so on to stay clear of them.

## Motion

- Everything is gated by the `motion` class on `<html>` (set in BaseLayout unless `prefers-reduced-motion`). Without JS or with reduced motion the page is static and fully visible — keep it that way.
- Easing `cubic-bezier(0.22, 1, 0.36, 1)`; reveals rise 32px and fade; claret band wipes in (colour on a `::before` so IntersectionObserver still sees the section).
- No libraries (no GSAP/Lenis); plain CSS + a small script.

## Split-flap hero headline

Ported from `prototypes/split-flap.html`, look **"C · Type"** (kept as the reference with the other two looks, paper and ink boards; not part of the build). The earlier typing version is `prototypes/flip-headline.html`. Structure: `[Verb] [Noun]` / `across platforms.`

- Content: `verbs`, `nouns` (two lists, any lengths) and `headlineTail` in `settings.json`, editable in Pages CMS. The static HTML shows the first verb and the first noun; the loop turns both wheels one step at a time, so with different lengths the combinations keep shifting.
- Motion: at rest it is plain type. When a word changes, the script has split it into letter cells, and each letter folds about its middle like an airport departure board, passing through two to five other letters before it lands (an unchanged letter stays put; a capital passes through capitals). The verb flips first, left to right; the noun starts once it has landed. A hairline shows across a letter only while it turns. Each cell is as wide as its glyph and snaps to the new letter's width as it lands (no width transition: Hallmark gate 10a). Timings are constants at the top of `src/scripts/flip-headline.ts`; styles are section 6 of `motion.css`.
- Each word keeps as many cells as its wheel's longest word; spare cells hold a blank of no width. Letter cells break Novela's ligatures (ffl), which reads fine at this size.
- Verb and noun always share one line; the script fits the headline font size to the longest pair (128px, the clamp's top, at 1440). The current words are short enough that no pair needs shrinking (36px on a 375px phone); a long word would shrink every pair, so keep them short.
- Accessibility: `aria-label` on the `<h1>` holds the current full sentence; the letter cells are `aria-hidden`. Without JS or with reduced motion it is the first pair, static, wrapping normally.
- Loops pause (Hallmark gate 18, WCAG 2.2.2): `src/scripts/loop-control.ts` gates the headline on being on screen, tab visible, pointer/focus away, and the pause button, a 44px icon (pause bars, play triangle once held; named "Pause motion" / "Play motion" by `aria-label`) at the headline's bottom right (under it on a narrow screen), not in a button row. WCAG 2.2.2 (level A) asks for a pause control on anything that moves past five seconds, so it stays; sloplint itself only warns about CSS loops without a pause state. A change that has begun always finishes.
- Verb and noun are two wheels: a click on the verb flips just the verb, a click on the noun just the noun, so new combinations appear. Each word is a real button laid over its slot (`flip-hit`) with a claret hairline cue on hover/focus (always faint on touch); a visitor's click restarts the 4.5s rest; keyboard focus pauses the loop. The sentence lives in the `<h1>` aria-label plus a polite status line.
- Words chosen November 2026: verbs Shuffling, Juggling, Trimming, Tuning, Crafting; nouns words, tone, labels, scripts, stories. Every verb has to read with every noun.
- Hero button: one, "Read the case studies" (to #work). Resume and Contact are left to the nav, which shows on every page, so the hero repeats neither; "Give me a shout." is only the contact headline, and "Full resume" stays in the road-so-far header.
- Open: whether a combination should link to a project (not built).

## Still to fill in (content)

The three Bukalapak write-ups (tone and voice, Year End Review, careers website) were rewritten in Purna's voice in November 2026, each with a `role` line. Every fact in them traces to Purna or to the project's own files (old work files in iCloud, the Web Archive); claims that couldn't be traced, such as "visits tripled", were dropped, so don't add numbers back without a source. Images live in `public/images/work/<project>/`. Several phone screens sit in a `<div class="shots">` gallery of `<figure>`s, styled in ArticleLayout; a single phone screen gets a `<figure style="max-width: 320px">` so it doesn't fill the column. careers.bukalapak.com now redirects to bukalapak.com, so that project has no external link.

Still open: a one-line description under the Telkom row in the home page's experience table (what the UX Writer Hub is, the team, the products), to write once all the Notion content is in the repo; a Telkom case study on Purna's conversation design for an AI chatbot platform (planned in its own conversation; once it exists, add "conversation designer" to the roles and the Telkom row, and only then consider AI in the hero or tab title); a humanizer pass on the three write-ups (keep the short landing lines, the glossed Indonesian, the quotations and the HTML intact), and the other case studies, which haven't been rewritten yet.
