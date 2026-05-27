# Portfolio Site Design Spec

**Date:** 2026-05-27
**Project:** Personal portfolio site — Anastasia Coffman
**Stack:** Astro 6, Tailwind CSS v4, lucide-astro, @formspree/ajax

---

## Goal

A static, multi-page personal portfolio for a software engineer. Showcases projects, professional experience, and skills. Includes a blog for technical and career writing. Styled with a dark terminal aesthetic using Catppuccin Mocha colors and JetBrains Mono font.

---

## Routes

| Route | File | Description |
|---|---|---|
| `/` | `src/pages/index.astro` | Homepage: whoami hero, 3 pinned projects, 3 latest posts |
| `/about` | `src/pages/about.astro` | Extended terminal-style bio block |
| `/projects` | `src/pages/projects.astro` | Full project card grid |
| `/experience` | `src/pages/experience.astro` | Vertical timeline of roles + education |
| `/skills` | `src/pages/skills.astro` | Skills grouped by category, badge style |
| `/blog` | `src/pages/blog/index.astro` | Post list, newest first, filterable by tag |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` | Individual blog post, prev/next nav |
| `/contact` | `src/pages/contact.astro` | Contact form via Formspree |

---

## Architecture

### Content

Blog posts live in `src/content/blog/` as Markdown files, managed via Astro content collections. Frontmatter schema:

```ts
// src/content/config.ts
title: string
date: Date
description: string
tags: string[]
draft?: boolean  // excluded from production build
```

Portfolio data (projects, experience, skills) is hardcoded in `.astro` files — no CMS, no separate data files needed at this stage.

### Shared Components

| Component | Purpose |
|---|---|
| `src/layouts/Layout.astro` | Base layout: nav + footer, imports global CSS |
| `src/components/NavBar.astro` | Fixed top nav with `~/` prefixed links, mobile hamburger |
| `src/components/ProjectCard.astro` | Card with title, description, tech stack badges, GitHub/live links |
| `src/components/BlogPostCard.astro` | Post title, date, description, tags |
| `src/components/SkillBadge.astro` | Single skill tag/badge |

### Icons

`lucide-astro` — named imports only, no barrel imports:
```astro
import { Github, ExternalLink, Mail, ArrowRight } from 'lucide-astro'
```

---

## Design System

### Colors — Catppuccin Mocha

| Token | Hex | Usage |
|---|---|---|
| Base | `#1e1e2e` | Page background |
| Mantle | `#181825` | Nav, cards, surface elements |
| Surface0 | `#313244` | Borders, code blocks, skill badges |
| Overlay0 | `#6c7086` | Muted text, comments, secondary labels |
| Text | `#cdd6f4` | Primary text |
| Green | `#a6e3a1` | Prompt symbol, open-to-work status, primary CTA border |
| Blue | `#89b4fa` | Links, secondary accents |
| Mauve | `#cba6f7` | Active nav link, key names in whoami output |
| Peach | `#fab387` | Blog tags |
| Red | `#f38ba8` | Error states, form validation |
| Yellow | `#f9e2af` | Warnings |

### Typography

- **JetBrains Mono** (Google Fonts) — all headings, labels, nav, code, terminal chrome
- **System sans-serif** (`system-ui, -apple-system, sans-serif`) — blog post body text, longer descriptions
- Syntax highlighting: Shiki with `catppuccin-mocha` theme (built into Astro)

### Interactive Elements

- **Outlined CTA:** `border-1 border-green text-green` — primary action (e.g. `./view-projects`)
- **Ghost link:** `text-blue` — secondary action (e.g. `resume ↗`)
- **Filled CTA:** `bg-green text-base` — form submit button
- **Skill badge:** `bg-surface0 text-text` — neutral; tags use `text-peach`
- **Blog tag:** `bg-surface0 text-peach`

---

## Page Designs

### Homepage (`/`)

Three sections:
1. **whoami hero** — terminal block with `name`, `role`, `focus` (array), `writing`, `status` fields. Mauve key names, text values, green for `open_to_work`. Blinking cursor. Two CTAs: `./projects` (outlined green) and `resume ↗` (blue ghost link).
2. **Pinned projects** — 3-column card grid (1-col on mobile). "View all →" link to `/projects`.
3. **Latest posts** — 3 recent blog post cards. "Read more →" link to `/blog`.

### About (`/about`)

Terminal-style output block. Longer than the homepage hero — includes bio paragraph, what you're working on, interests, links to GitHub/LinkedIn. Same monospace formatting as the whoami block.

### Projects (`/projects`)

Responsive card grid (1-col mobile, 2-col tablet, 3-col desktop). Each `ProjectCard`:
- Project title
- Short description
- Tech stack badges (`SkillBadge`)
- GitHub icon link + optional live site icon link (`lucide-astro`: `Github`, `ExternalLink`)

### Experience (`/experience`)

Vertical timeline. Each entry:
- Role title (mauve, JetBrains Mono)
- Company · date range (muted text)
- Bullet points (body text)

Education section below the timeline, same styling.

### Skills (`/skills`)

Skills grouped into categories (e.g. Languages, Frameworks, Tools, Platforms). Each category has a `//` comment header in JetBrains Mono, followed by a flex-wrap row of `SkillBadge` components.

### Blog Index (`/blog`)

Flat list of posts, newest first. Each row: title, date, description excerpt, tags. Tag filter via URL param (`/blog?tag=engineering`) — client-side filtering, no JS framework, shareable URLs.

### Blog Post (`/blog/[slug]`)

- Frontmatter renders as: title (h1), date + reading time (muted), tags
- Body: system sans-serif, comfortable line-height
- Code blocks: JetBrains Mono, Catppuccin Mocha via Shiki
- Footer: prev/next post links

### Contact (`/contact`)

Formspree endpoint: `https://formspree.io/f/xjgzjgpq`

Integration: `@formspree/ajax` (ESM, bundler). Fields: name, email, message. Uses `data-fs-*` attributes for declarative error/success handling — no custom JS state needed. Styled to match the terminal aesthetic (dark inputs with Surface0 background, green focus ring).

---

## Navigation

Fixed top bar (`position: sticky`), Mantle background, bottom border in Surface0.

- Left: `anastasia@portfolio:~$` in JetBrains Mono (links to `/`)
- Right: `~/projects · ~/experience · ~/skills · ~/blog · ~/about · ~/contact`
- Active route: text color Mauve
- Mobile: hamburger icon (lucide `Menu`) collapses links to a dropdown

---

## Out of Scope

- Server-side rendering / dynamic routes (beyond blog `[slug]`)
- Search
- Comments on blog posts
- Analytics (can be added later via a `<script>` in Layout)
- Dark/light mode toggle (Catppuccin Mocha only)
