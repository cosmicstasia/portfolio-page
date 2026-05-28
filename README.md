# acoffman.dev

Personal portfolio site for Anastasia Coffman. Built with Astro 6, Tailwind CSS v4, and a dark terminal aesthetic using the Catppuccin Mocha color palette.

## Stack

- **[Astro 6](https://astro.build)** — static site generation
- **[Tailwind CSS v4](https://tailwindcss.com)** — via `@tailwindcss/vite`, no config file
- **[lucide-astro](https://github.com/lucide-icons/lucide)** — icons
- **[@formspree/ajax](https://formspree.io)** — contact form
- **Shiki** — syntax highlighting with `catppuccin-mocha` theme
- **JetBrains Mono** — monospace font throughout

## Pages

| Route | Description |
| :--- | :--- |
| `/` | Homepage — whoami hero, pinned projects, latest posts |
| `/about` | Terminal-style bio block |
| `/projects` | Project card grid |
| `/experience` | Work history timeline + education |
| `/skills` | Skills grouped by category |
| `/blog` | Post list with client-side tag filter |
| `/blog/[id]` | Individual blog post with reading time and prev/next nav |
| `/contact` | Contact form via Formspree |

## Development

```sh
bun install       # install dependencies
bun dev           # start dev server at localhost:4321
bun run build     # production build to ./dist/
bun preview       # preview production build
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
