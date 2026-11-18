# Naksha site

The website for Naksha: every component live, the foundations, the brand book, the changelog and the roadmap, plus `llms.txt` for agents. It is a static Next.js export built from this repo: the component pages read `artifact/components/<Name>/README.md` and its `preview.html`, the doc pages read `README.md`, `CHANGELOG.md`, `docs/ROADMAP.md` and the Agent Skill. Nothing on the site is written by hand twice.

Art direction: direction D in `docs/site-directions/DESIGN.md`.

## Run it

```sh
cd site
npm install
npm run build    # builds Naksha first if ../dist is missing, then writes ./out
npm start        # serves ./out on http://127.0.0.1:4401
```

`npm run dev` runs the dev server on the same port.

## Deploy on Vercel

1. Import `shreeraj301/naksha` in Vercel.
2. Set **Root Directory** to `site`. Keep "Include files outside the root directory in the Build Step" on (the default), because the site reads the rest of the repo.
3. Leave the framework as Next.js and the build command as `npm run build`. On Vercel the build always rebuilds Naksha from source first, so the site never ships a stale copy.
4. Optional: set `SITE_URL` to the final address (for example `https://naksha.example`) so links in shared previews use it. Without it, Vercel's production address is used.

## How it is put together

| Path | What it does |
| --- | --- |
| `lib/content.ts` | Reads the READMEs, previews, changelog and roadmap at build time |
| `lib/groups.ts` | The seven groups (from each card's `@dsCard group`) and the section colour each one wears |
| `components/Giant.tsx` | The breathing NAKSHA on the home page |
| `components/Fit.tsx` | Fits each page title to the measure on Archivo's width axis |
| `components/Index.tsx` | Group bands and the stretching component list |
| `components/Ask.tsx` | Ask Naksha, a scripted demo that answers from the docs |
| `components/Nk.tsx` | Renders Naksha components from data, and mounts the README previews |
| `public/fonts/` | Archivo with its width axis (OFL), used by the site only |
