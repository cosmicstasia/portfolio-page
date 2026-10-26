# acoffman.dev

Personal portfolio site for Anastasia Coffman. Built with Astro 7, Tailwind CSS v4, and a dark terminal aesthetic with six switchable themes (Catppuccin, Tokyo Night, Gruvbox, Nord, Rosé Pine, Flexoki Light) — press `t` anywhere on the site to cycle through them.

## Stack

- **[Astro 7](https://astro.build)** — static site generation (Rust compiler, Vite 8/Rolldown, queued rendering)
- **[Bun](https://bun.sh)** — package manager + runtime; `scripts/serve-dist.ts` uses `Bun.serve`/`Bun.file` natively for local preview instead of a Node/Express server
- **[Tailwind CSS v4](https://tailwindcss.com)** — via `@tailwindcss/vite`, no config file
- **[lucide-astro](https://github.com/lucide-icons/lucide)** — icons
- **[@formspree/ajax](https://formspree.io)** — contact form
- **Shiki** — syntax highlighting with `catppuccin-mocha` theme
- **JetBrains Mono** — monospace font throughout

## Pages

| Route | Description |
| :--- | :--- |
| `/` | Homepage — animated `whoami` terminal hero, pinned projects, latest posts |
| `/about` | Terminal-style bio block |
| `/projects` | Project card grid with hover lift/glow |
| `/experience` | Work history timeline + education |
| `/skills` | Skills grouped by category |
| `/blog` | Post list with client-side tag filter |
| `/blog/[id]` | Individual blog post with reading time and prev/next nav |
| `/contact` | Contact form via Formspree |

## Interactive design

- **Theme switcher** — six Omarchy-inspired themes, each restyling the whole page (background, cards, nav, accents) via a `data-theme` attribute and CSS custom properties. Press `t` anywhere (outside form fields) to cycle, or pick one from the palette icon in the nav. Persisted to `localStorage`.
- **Animated hero** — the homepage terminal types out `whoami` character-by-character before revealing the output block.
- **Scroll reveals** — sections and cards fade/slide in via `IntersectionObserver` as they enter the viewport (`.reveal` class in `global.css`), with staggered delays across grids.
- **Ambient wallpaper** — a slow-drifting radial-gradient background that re-colors with the active theme.
- **Card micro-interactions** — project cards lift and glow on hover; tags get a border highlight.

## Development

```sh
bun install       # install dependencies
bun dev           # start dev server at localhost:4321
bun run build     # production build to ./dist/
bun preview       # preview production build via Bun's native static server
bun astro check   # type-check .astro files
```

## Content

Blog posts live in `src/content/blog/` as Markdown files. Frontmatter schema:

```yaml
title: string
date: YYYY-MM-DD
description: string
tags: [string]
draft: boolean  # optional, defaults to false
```

## Deployment

Deployed to Vercel. Pushes to `main` trigger automatic deploys.
