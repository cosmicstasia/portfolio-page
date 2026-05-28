# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the project root using `bun`:

| Command | Action |
| :--- | :--- |
| `bun dev` | Start dev server at `localhost:4321` |
| `bun build` | Build production site to `./dist/` |
| `bun preview` | Preview production build locally |
| `bun astro check` | Type-check `.astro` files |
| `bun astro add <integration>` | Add an Astro integration |

## Architecture

This is an [Astro](https://astro.build) personal page using **Tailwind CSS v4** (integrated via `@tailwindcss/vite`, not the legacy Astro integration).

**Key conventions:**
- Pages live in `src/pages/` — each `.astro` file becomes a route
- Shared layout wraps all pages via `src/layouts/Layout.astro` using `<slot />`
- Tailwind is imported globally in `src/styles/global.css` via `@import "tailwindcss"` and pulled into the layout
- No framework components (React/Vue/Svelte) are configured — pure Astro components only unless integrations are added

**Tailwind note:** This project uses Tailwind v4, which has breaking changes from v3. Config is not in `tailwind.config.*` — it's handled through CSS and the Vite plugin.
