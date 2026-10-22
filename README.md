# Purna Anantha — portfolio

Built with [Astro](https://astro.build) on the Purna Anantha design system (Paper background, Novela + Basier Circle, claret / oxford / teal).

## Run it

Needs Node.js 22.23.4 or newer (`node -v`).

```sh
npm install      # once
npm run dev      # local site at http://localhost:4321
npm run build    # production build into ./dist
npm run preview  # preview the build
```

## Where things live

```text
public/
  fonts/              Novela + Basier Circle webfonts (licensed for this one website only)
  favicon.svg
src/
  content/*.json      ALL page copy: site text, projects, writing, experience, awards (edited via Pages CMS)
  data/site.ts        loads the JSON and adds types
  styles/tokens.css   design tokens (mirror of the design system's tokens.json)
  styles/global.css   base styles
  layouts/BaseLayout.astro
  components/         Nav, Button, Tag, ProjectCard, SectionHeader, Footer
  pages/index.astro   the home page → "/"
```

- Edit copy in Pages CMS (below) or directly in `src/content/*.json`.
- Project images go in `public/images/` (the CMS uploads them there).
- A new file in `src/pages/` becomes a new page (`about.astro` → `/about`).

## Publishing (GitHub Pages)

The site deploys to https://funkadr0me.github.io from the repository `funkadr0me/funkadr0me.github.io`.
`.github/workflows/deploy.yml` builds and publishes on every push to `main`.

One-time setup:

1. On GitHub (signed in as funkadr0me), create a **public** repository named exactly `funkadr0me.github.io` (empty — no README).
2. Push this folder to it:
   ```sh
   cd ~/github.com/purna-portfolio
   git init -b main
   git add .
   git commit -m "First version of the portfolio"
   git remote add origin https://github.com/funkadr0me/funkadr0me.github.io.git
   git push -u origin main
   ```
3. On GitHub: repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Watch the **Actions** tab; when the run is green the site is live.

### Later: moving to your own domain

Same repository, no other code changes:

1. Set `site` in `astro.config.mjs` to `https://yourdomain.com`.
2. Add `public/CNAME` containing only `yourdomain.com`.
3. At your registrar: four A records for the bare domain → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153; a CNAME for `www` → `funkadr0me.github.io` (check GitHub's Pages docs for the current addresses).
4. Repository **Settings → Pages → Custom domain**: enter the domain, then tick **Enforce HTTPS** once offered. Optionally verify the domain under your account's **Settings → Pages**.

## Editing content (Pages CMS)

1. Go to https://app.pagescms.org and sign in with GitHub.
2. Install the Pages CMS GitHub App on the `funkadr0me.github.io` repository.
3. Open the repository — the editor reads `.pages.yml` and shows Site text, Projects, Writing, Experience and Awards.
4. Edit and save. Each save is a commit to `main`, which triggers a new deploy (about a minute).

## To do

- Project images for the three Bukalapak cards
- Summaries for Career website and Year End Review 2018
- Link for Year End Review 2018
