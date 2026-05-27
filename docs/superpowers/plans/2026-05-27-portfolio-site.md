# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-page static portfolio site with dark terminal aesthetic, Catppuccin Mocha colors, JetBrains Mono font, Astro content collections for blog, and Formspree contact form.

**Architecture:** Pure Astro static site (no React/Vue). Blog posts are Markdown files in `src/content/blog/` using Astro content collections with a typed frontmatter schema. Portfolio data (projects, experience, skills) is hardcoded in page frontmatter as TypeScript arrays. Tailwind v4 CSS custom properties define the design system via `@theme` in `global.css`.

**Tech Stack:** Astro 6, Tailwind CSS v4 (`@tailwindcss/vite`), `lucide-astro`, `@formspree/ajax`, Shiki (`catppuccin-mocha` theme, bundled with Astro)

---

## File Map

**New files:**
- `src/content/config.ts` — Blog collection schema
- `src/content/blog/hello-world.md` — Sample post for development
- `src/components/NavBar.astro` — Sticky nav with `~/` links + mobile hamburger
- `src/components/ProjectCard.astro` — Project card (title, description, tech, links)
- `src/components/BlogPostCard.astro` — Post list item (title, date, description, tags)
- `src/components/SkillBadge.astro` — Single skill tag
- `src/pages/about.astro` — Extended whoami terminal block
- `src/pages/projects.astro` — Full project grid
- `src/pages/experience.astro` — Vertical timeline + education
- `src/pages/skills.astro` — Skills grouped by category
- `src/pages/blog/index.astro` — Post list with client-side tag filter
- `src/pages/blog/[slug].astro` — Individual post with prev/next nav
- `src/pages/contact.astro` — Formspree contact form

**Modified files:**
- `src/styles/global.css` — Catppuccin Mocha `@theme` tokens + JetBrains Mono import
- `src/layouts/Layout.astro` — Rebuild: NavBar + `<slot />` + footer
- `src/pages/index.astro` — Rebuild: whoami hero + pinned projects + latest posts
- `astro.config.mjs` — Add Shiki `catppuccin-mocha` theme config

**Deleted files:**
- `src/components/Welcome.astro` — Replaced by homepage
- `src/assets/astro.svg`, `src/assets/background.svg` — Unused

---

## Task 1: Install dependencies and configure Shiki

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Install packages**

```bash
bun add lucide-astro @formspree/ajax
```

Expected output: packages added to `node_modules/` and `bun.lock` updated.

- [ ] **Step 2: Configure Shiki in astro.config.mjs**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    shikiConfig: {
      theme: 'catppuccin-mocha'
    }
  }
});
```

- [ ] **Step 3: Verify Astro still starts**

```bash
bun astro check
```

Expected: no type errors.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs bun.lock package.json
git commit -m "feat: install lucide-astro and @formspree/ajax, configure shiki"
```

---

## Task 2: Design system — global CSS

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Replace global.css with Catppuccin Mocha theme**

```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

@theme {
  --color-base: #1e1e2e;
  --color-mantle: #181825;
  --color-crust: #11111b;
  --color-surface0: #313244;
  --color-surface1: #45475a;
  --color-overlay0: #6c7086;
  --color-overlay1: #7f849c;
  --color-subtext: #a6adc8;
  --color-text: #cdd6f4;
  --color-green: #a6e3a1;
  --color-blue: #89b4fa;
  --color-mauve: #cba6f7;
  --color-peach: #fab387;
  --color-red: #f38ba8;
  --color-yellow: #f9e2af;
  --color-teal: #94e2d5;

  --font-mono: 'JetBrains Mono', monospace;
  --font-sans: system-ui, -apple-system, sans-serif;
}

html, body {
  margin: 0;
  width: 100%;
  min-height: 100%;
  background-color: #1e1e2e;
  color: #cdd6f4;
  font-family: 'JetBrains Mono', monospace;
}

/* Prose styles for blog posts */
.prose {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.8;
  color: #cdd6f4;
}

.prose h1, .prose h2, .prose h3, .prose h4 {
  font-family: 'JetBrains Mono', monospace;
  color: #cdd6f4;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.prose a {
  color: #89b4fa;
  text-decoration: underline;
}

.prose code {
  font-family: 'JetBrains Mono', monospace;
  background: #313244;
  padding: 0.15em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

.prose pre {
  border-radius: 8px;
  border: 1px solid #313244;
  overflow-x: auto;
}

.prose pre code {
  background: transparent;
  padding: 0;
}

.prose blockquote {
  border-left: 3px solid #cba6f7;
  padding-left: 1rem;
  color: #a6adc8;
  font-style: italic;
}
```

- [ ] **Step 2: Verify type check passes**

```bash
bun astro check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add catppuccin mocha design system and JetBrains Mono"
```

---

## Task 3: NavBar and base Layout

**Files:**
- Create: `src/components/NavBar.astro`
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Create NavBar.astro**

```astro
---
const pathname = Astro.url.pathname;

const links = [
  { href: '/projects', label: 'projects' },
  { href: '/experience', label: 'experience' },
  { href: '/skills', label: 'skills' },
  { href: '/blog', label: 'blog' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
];

function isActive(href: string) {
  return pathname === href || pathname.startsWith(href + '/');
}
---

<nav class="sticky top-0 z-50 bg-mantle border-b border-surface0">
  <div class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
    <a href="/" class="font-mono text-sm text-overlay0 hover:text-text transition-colors">
      <span class="text-green">anastasia</span><span class="text-overlay0">@portfolio</span><span class="text-overlay0">:~$</span>
    </a>

    <!-- Desktop nav -->
    <div class="hidden md:flex items-center gap-6">
      {links.map(({ href, label }) => (
        <a
          href={href}
          class={`font-mono text-sm transition-colors hover:text-text ${
            isActive(href) ? 'text-mauve' : 'text-overlay0'
          }`}
        >
          <span class="text-overlay0">~/</span>{label}
        </a>
      ))}
    </div>

    <!-- Mobile hamburger -->
    <button
      id="nav-toggle"
      class="md:hidden text-overlay0 hover:text-text transition-colors"
      aria-label="Toggle navigation"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
  </div>

  <!-- Mobile menu -->
  <div id="nav-menu" class="hidden md:hidden border-t border-surface0 bg-mantle">
    <div class="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-4">
      {links.map(({ href, label }) => (
        <a
          href={href}
          class={`font-mono text-sm transition-colors hover:text-text ${
            isActive(href) ? 'text-mauve' : 'text-overlay0'
          }`}
        >
          <span class="text-overlay0">~/</span>{label}
        </a>
      ))}
    </div>
  </div>
</nav>

<script>
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  toggle?.addEventListener('click', () => {
    menu?.classList.toggle('hidden');
  });
</script>
```

- [ ] **Step 2: Rebuild Layout.astro**

```astro
---
import '../styles/global.css';
import NavBar from '../components/NavBar.astro';

interface Props {
  title?: string;
  description?: string;
}

const {
  title = 'Anastasia Coffman',
  description = 'Software engineer — projects, writing, and experience.',
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <NavBar />
    <main class="max-w-5xl mx-auto px-6 py-12">
      <slot />
    </main>
    <footer class="border-t border-surface0 mt-24">
      <div class="max-w-5xl mx-auto px-6 py-8 font-mono text-sm text-overlay0 flex justify-between items-center">
        <span>anastasia@portfolio:~$</span>
        <span>built with astro</span>
      </div>
    </footer>
  </body>
</html>
```

- [ ] **Step 3: Type check**

```bash
bun astro check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/NavBar.astro src/layouts/Layout.astro
git commit -m "feat: add NavBar and rebuild Layout with Catppuccin Mocha"
```

---

## Task 4: Shared leaf components

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/components/BlogPostCard.astro`
- Create: `src/components/SkillBadge.astro`

- [ ] **Step 1: Create SkillBadge.astro**

```astro
---
interface Props {
  name: string;
  variant?: 'default' | 'tag';
}
const { name, variant = 'default' } = Astro.props;
---

<span class={`font-mono text-xs px-2 py-1 rounded border ${
  variant === 'tag'
    ? 'bg-surface0 text-peach border-surface0'
    : 'bg-surface0 text-subtext border-surface0'
}`}>
  {name}
</span>
```

- [ ] **Step 2: Create ProjectCard.astro**

```astro
---
import SkillBadge from './SkillBadge.astro';
import { Github, ExternalLink } from 'lucide-astro';

interface Props {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
}
const { title, description, tech, github, live } = Astro.props;
---

<div class="bg-mantle border border-surface0 rounded-lg p-6 flex flex-col gap-4 hover:border-surface1 transition-colors">
  <div class="flex items-start justify-between gap-4">
    <h3 class="font-mono text-base font-semibold text-text">{title}</h3>
    <div class="flex items-center gap-3 shrink-0">
      {github && (
        <a href={github} target="_blank" rel="noopener noreferrer" class="text-overlay0 hover:text-text transition-colors" aria-label="GitHub repository">
          <Github size={16} />
        </a>
      )}
      {live && (
        <a href={live} target="_blank" rel="noopener noreferrer" class="text-overlay0 hover:text-text transition-colors" aria-label="Live site">
          <ExternalLink size={16} />
        </a>
      )}
    </div>
  </div>
  <p class="text-sm text-subtext leading-relaxed" style="font-family: system-ui, -apple-system, sans-serif;">{description}</p>
  <div class="flex flex-wrap gap-2 mt-auto">
    {tech.map(t => <SkillBadge name={t} />)}
  </div>
</div>
```

- [ ] **Step 3: Create BlogPostCard.astro**

```astro
---
import SkillBadge from './SkillBadge.astro';

interface Props {
  title: string;
  date: Date;
  description: string;
  tags: string[];
  slug: string;
}
const { title, date, description, tags, slug } = Astro.props;

const formatted = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<a href={`/blog/${slug}`} class="block group">
  <div class="border-b border-surface0 py-6 hover:border-surface1 transition-colors">
    <div class="flex items-baseline justify-between gap-4 mb-2">
      <h3 class="font-mono text-base font-semibold text-text group-hover:text-blue transition-colors">{title}</h3>
      <time class="font-mono text-xs text-overlay0 shrink-0">{formatted}</time>
    </div>
    <p class="text-sm text-subtext leading-relaxed mb-3" style="font-family: system-ui, -apple-system, sans-serif;">{description}</p>
    <div class="flex flex-wrap gap-2">
      {tags.map(t => <SkillBadge name={t} variant="tag" />)}
    </div>
  </div>
</a>
```

- [ ] **Step 4: Type check**

```bash
bun astro check
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/SkillBadge.astro src/components/ProjectCard.astro src/components/BlogPostCard.astro
git commit -m "feat: add ProjectCard, BlogPostCard, and SkillBadge components"
```

---

## Task 5: Blog content collection + sample post

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/hello-world.md`

- [ ] **Step 1: Create src/content/config.ts**

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Create src/content/blog/hello-world.md**

```markdown
---
title: "Hello World"
date: 2026-05-27
description: "First post — what this blog is about and what to expect."
tags: ["meta", "writing"]
---

## Why I'm writing

This is the first post on my engineering blog. I plan to write about technical decisions, things I learn on the job, and occasionally the broader experience of working as a software engineer.

## What to expect

A mix of:

- **Technical deep-dives** — how I approached a tricky problem, what I learned from a production incident, notes on a new tool
- **Career reflections** — job searching, growth, things I wish I'd known earlier

No particular schedule. I'll write when I have something worth saying.

```ts
// A taste of what code blocks look like
const greet = (name: string): string => `Hello, ${name}`;
console.log(greet('world'));
```

See you in the next one.
```

- [ ] **Step 3: Type check**

```bash
bun astro check
```

Expected: no errors. The content collection schema will now be validated.

- [ ] **Step 4: Commit**

```bash
git add src/content/config.ts src/content/blog/hello-world.md
git commit -m "feat: add blog content collection schema and sample post"
```

---

## Task 6: Homepage

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Rewrite index.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import ProjectCard from '../components/ProjectCard.astro';
import BlogPostCard from '../components/BlogPostCard.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 3);

const pinnedProjects = [
  {
    title: 'Project Alpha',
    description: 'A brief description of what this project does and why it matters.',
    tech: ['TypeScript', 'Node.js', 'PostgreSQL'],
    github: 'https://github.com/anastasiacoffman',
  },
  {
    title: 'Project Beta',
    description: 'A brief description of what this project does and why it matters.',
    tech: ['Go', 'Docker', 'Redis'],
    github: 'https://github.com/anastasiacoffman',
    live: 'https://example.com',
  },
  {
    title: 'Project Gamma',
    description: 'A brief description of what this project does and why it matters.',
    tech: ['Python', 'FastAPI', 'AWS'],
    github: 'https://github.com/anastasiacoffman',
  },
];
---

<Layout>
  <!-- whoami hero -->
  <section class="mb-20">
    <div class="bg-mantle border border-surface0 rounded-lg p-8 font-mono">
      <div class="text-overlay0 text-sm mb-6">● ● ●</div>
      <div class="text-sm text-overlay0 mb-3">
        anastasia@portfolio:~$ <span class="text-text">whoami</span>
      </div>
      <div class="text-sm leading-loose mt-4">
        <div>
          <span class="text-mauve">name</span>
          <span class="text-overlay0">:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span class="text-text">Anastasia Coffman</span>
        </div>
        <div>
          <span class="text-mauve">role</span>
          <span class="text-overlay0">:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span class="text-text">Software Engineer</span>
        </div>
        <div>
          <span class="text-mauve">focus</span>
          <span class="text-overlay0">:&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span class="text-text">["backend", "systems", "web"]</span>
        </div>
        <div>
          <span class="text-mauve">writing</span>
          <span class="text-overlay0">:&nbsp;&nbsp;&nbsp;</span>
          <span class="text-blue">true</span>
        </div>
        <div>
          <span class="text-mauve">status</span>
          <span class="text-overlay0">:&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span class="text-green">open_to_work</span>
        </div>
      </div>
      <div class="mt-6 text-sm text-overlay0">
        anastasia@portfolio:~$ <span class="text-green animate-pulse">▌</span>
      </div>
      <div class="mt-8 flex flex-wrap gap-4 items-center">
        <a
          href="/projects"
          class="font-mono text-sm border border-green text-green px-4 py-2 rounded hover:bg-green hover:text-base transition-colors"
        >
          ./projects
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-sm text-blue hover:text-text transition-colors"
        >
          resume ↗
        </a>
      </div>
    </div>
  </section>

  <!-- Pinned projects -->
  <section class="mb-20">
    <div class="flex items-baseline justify-between mb-6">
      <h2 class="font-mono text-sm text-overlay0">// projects</h2>
      <a href="/projects" class="font-mono text-xs text-blue hover:text-text transition-colors">view all →</a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pinnedProjects.map(p => <ProjectCard {...p} />)}
    </div>
  </section>

  <!-- Latest posts -->
  <section>
    <div class="flex items-baseline justify-between mb-2">
      <h2 class="font-mono text-sm text-overlay0">// writing</h2>
      <a href="/blog" class="font-mono text-xs text-blue hover:text-text transition-colors">read more →</a>
    </div>
    {posts.map(post => (
      <BlogPostCard
        title={post.data.title}
        date={post.data.date}
        description={post.data.description}
        tags={post.data.tags}
        slug={post.slug}
      />
    ))}
  </section>
</Layout>
```

- [ ] **Step 2: Delete unused files**

```bash
rm src/components/Welcome.astro src/assets/astro.svg src/assets/background.svg
```

- [ ] **Step 3: Start dev server and verify homepage renders correctly**

```bash
bun dev
```

Open http://localhost:4321. Verify: whoami hero renders, project cards show, sample blog post appears.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git rm src/components/Welcome.astro src/assets/astro.svg src/assets/background.svg
git commit -m "feat: build homepage with whoami hero, pinned projects, and latest posts"
```

---

## Task 7: About page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create about.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="About — Anastasia Coffman" description="About Anastasia Coffman, software engineer.">
  <section>
    <h1 class="font-mono text-sm text-overlay0 mb-8">// about</h1>

    <div class="bg-mantle border border-surface0 rounded-lg p-8 font-mono text-sm">
      <div class="text-overlay0 mb-6">● ● ●</div>

      <div class="text-overlay0 mb-3">
        anastasia@portfolio:~$ <span class="text-text">cat about.txt</span>
      </div>

      <div class="mt-6 space-y-6">
        <div>
          <div class="text-green mb-2">## bio</div>
          <p class="text-subtext leading-relaxed" style="font-family: system-ui, -apple-system, sans-serif;">
            I'm a software engineer with a passion for building reliable, well-tested systems.
            I care about clean code, good abstractions, and the craft of writing software that
            other people can understand and maintain.
          </p>
        </div>

        <div>
          <div class="text-green mb-2">## currently</div>
          <p class="text-subtext leading-relaxed" style="font-family: system-ui, -apple-system, sans-serif;">
            Looking for my next role. I'm particularly interested in backend and systems work,
            though I'm comfortable across the stack.
          </p>
        </div>

        <div>
          <div class="text-green mb-2">## interests</div>
          <p class="text-subtext leading-relaxed" style="font-family: system-ui, -apple-system, sans-serif;">
            Distributed systems, developer tooling, open source, and writing about all of the above.
          </p>
        </div>

        <div>
          <div class="text-green mb-2">## links</div>
          <div class="space-y-2">
            <div>
              <span class="text-overlay0">github   → </span>
              <a href="https://github.com/anastasiacoffman" target="_blank" rel="noopener noreferrer" class="text-blue hover:text-text transition-colors">github.com/anastasiacoffman</a>
            </div>
            <div>
              <span class="text-overlay0">linkedin → </span>
              <a href="https://linkedin.com/in/anastasiacoffman" target="_blank" rel="noopener noreferrer" class="text-blue hover:text-text transition-colors">linkedin.com/in/anastasiacoffman</a>
            </div>
            <div>
              <span class="text-overlay0">email    → </span>
              <a href="mailto:anastasiacoffman7@gmail.com" class="text-blue hover:text-text transition-colors">anastasiacoffman7@gmail.com</a>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 text-overlay0">
        anastasia@portfolio:~$ <span class="text-green animate-pulse">▌</span>
      </div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Verify in browser**

Navigate to http://localhost:4321/about. Verify terminal block renders, links are correct.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add about page"
```

---

## Task 8: Projects page

**Files:**
- Create: `src/pages/projects.astro`

- [ ] **Step 1: Create projects.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import ProjectCard from '../components/ProjectCard.astro';

const projects = [
  {
    title: 'Project Alpha',
    description: 'A brief description of what this project does and why it matters to its users.',
    tech: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/anastasiacoffman',
  },
  {
    title: 'Project Beta',
    description: 'A brief description of what this project does and why it matters to its users.',
    tech: ['Go', 'gRPC', 'Redis', 'Kubernetes'],
    github: 'https://github.com/anastasiacoffman',
    live: 'https://example.com',
  },
  {
    title: 'Project Gamma',
    description: 'A brief description of what this project does and why it matters to its users.',
    tech: ['Python', 'FastAPI', 'AWS Lambda', 'DynamoDB'],
    github: 'https://github.com/anastasiacoffman',
  },
  {
    title: 'Project Delta',
    description: 'A brief description of what this project does and why it matters to its users.',
    tech: ['Rust', 'WebAssembly', 'JavaScript'],
    github: 'https://github.com/anastasiacoffman',
    live: 'https://example.com',
  },
];
---

<Layout title="Projects — Anastasia Coffman" description="Software projects by Anastasia Coffman.">
  <section>
    <h1 class="font-mono text-sm text-overlay0 mb-8">// projects</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map(p => <ProjectCard {...p} />)}
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Verify in browser**

Navigate to http://localhost:4321/projects. Verify card grid renders correctly at all breakpoints.

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects.astro
git commit -m "feat: add projects page"
```

---

## Task 9: Experience page

**Files:**
- Create: `src/pages/experience.astro`

- [ ] **Step 1: Create experience.astro**

```astro
---
import Layout from '../layouts/Layout.astro';

const experience = [
  {
    role: 'Software Engineer',
    company: 'Company Name',
    dates: '2023 – present',
    bullets: [
      'Built and maintained X, reducing Y by Z%.',
      'Led the migration of legacy service to modern stack.',
      'Collaborated with cross-functional team to ship feature on time.',
    ],
  },
  {
    role: 'Junior Software Engineer',
    company: 'Previous Company',
    dates: '2021 – 2023',
    bullets: [
      'Implemented new API endpoints serving N requests per day.',
      'Improved test coverage from X% to Y%.',
      'Participated in on-call rotation, resolving P0 incidents.',
    ],
  },
];

const education = [
  {
    degree: 'B.S. Computer Science',
    school: 'University Name',
    dates: '2017 – 2021',
  },
];
---

<Layout title="Experience — Anastasia Coffman" description="Professional experience of Anastasia Coffman.">
  <section>
    <h1 class="font-mono text-sm text-overlay0 mb-10">// experience</h1>

    <!-- Timeline -->
    <div class="relative">
      <div class="absolute left-0 top-0 bottom-0 w-px bg-surface0 ml-1"></div>

      <div class="space-y-10 pl-8">
        {experience.map(job => (
          <div class="relative">
            <div class="absolute -left-8 top-1.5 w-2 h-2 rounded-full bg-green border-2 border-base"></div>
            <div class="font-mono">
              <div class="text-mauve text-base font-semibold">{job.role}</div>
              <div class="text-overlay0 text-sm mt-1">{job.company} <span class="text-surface1">·</span> {job.dates}</div>
            </div>
            <ul class="mt-4 space-y-2">
              {job.bullets.map(bullet => (
                <li class="text-sm text-subtext leading-relaxed pl-4 relative before:absolute before:left-0 before:text-overlay0 before:content-['▸']"
                    style="font-family: system-ui, -apple-system, sans-serif;">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <!-- Education -->
    <div class="mt-16">
      <h2 class="font-mono text-sm text-overlay0 mb-8">// education</h2>
      <div class="relative">
        <div class="absolute left-0 top-0 bottom-0 w-px bg-surface0 ml-1"></div>
        <div class="space-y-6 pl-8">
          {education.map(edu => (
            <div class="relative">
              <div class="absolute -left-8 top-1.5 w-2 h-2 rounded-full bg-blue border-2 border-base"></div>
              <div class="font-mono">
                <div class="text-text text-base font-semibold">{edu.degree}</div>
                <div class="text-overlay0 text-sm mt-1">{edu.school} <span class="text-surface1">·</span> {edu.dates}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Verify in browser**

Navigate to http://localhost:4321/experience. Verify timeline renders with green dots and correct spacing.

- [ ] **Step 3: Commit**

```bash
git add src/pages/experience.astro
git commit -m "feat: add experience page with timeline"
```

---

## Task 10: Skills page

**Files:**
- Create: `src/pages/skills.astro`

- [ ] **Step 1: Create skills.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import SkillBadge from '../components/SkillBadge.astro';

const categories = [
  {
    name: 'Languages',
    skills: ['TypeScript', 'JavaScript', 'Go', 'Python', 'Rust', 'SQL'],
  },
  {
    name: 'Frameworks & Libraries',
    skills: ['Node.js', 'FastAPI', 'React', 'Astro', 'Express'],
  },
  {
    name: 'Data & Storage',
    skills: ['PostgreSQL', 'Redis', 'DynamoDB', 'SQLite'],
  },
  {
    name: 'Infrastructure & Tools',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'GitHub Actions', 'Linux'],
  },
  {
    name: 'Practices',
    skills: ['TDD', 'CI/CD', 'REST APIs', 'gRPC', 'Agile', 'Code Review'],
  },
];
---

<Layout title="Skills — Anastasia Coffman" description="Technical skills of Anastasia Coffman.">
  <section>
    <h1 class="font-mono text-sm text-overlay0 mb-10">// skills</h1>

    <div class="space-y-10">
      {categories.map(cat => (
        <div>
          <div class="font-mono text-sm text-overlay0 mb-4">
            <span class="text-surface1">// </span>{cat.name.toLowerCase()}
          </div>
          <div class="flex flex-wrap gap-2">
            {cat.skills.map(skill => <SkillBadge name={skill} />)}
          </div>
        </div>
      ))}
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Verify in browser**

Navigate to http://localhost:4321/skills. Verify categories and badges render correctly.

- [ ] **Step 3: Commit**

```bash
git add src/pages/skills.astro
git commit -m "feat: add skills page"
```

---

## Task 11: Blog index

**Files:**
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: Create src/pages/blog/index.astro**

```astro
---
import Layout from '../../layouts/Layout.astro';
import BlogPostCard from '../../components/BlogPostCard.astro';
import SkillBadge from '../../components/SkillBadge.astro';
import { getCollection } from 'astro:content';

const allPosts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const allTags = [...new Set(allPosts.flatMap(p => p.data.tags))].sort();
---

<Layout title="Blog — Anastasia Coffman" description="Writing on engineering and career by Anastasia Coffman.">
  <section>
    <h1 class="font-mono text-sm text-overlay0 mb-8">// writing</h1>

    <!-- Tag filter -->
    <div class="mb-8 flex flex-wrap gap-2 items-center">
      <span class="font-mono text-xs text-overlay0 mr-2">filter:</span>
      <button
        data-tag=""
        class="tag-btn font-mono text-xs px-2 py-1 rounded border bg-surface0 text-subtext border-surface0 hover:border-overlay0 transition-colors"
      >
        all
      </button>
      {allTags.map(tag => (
        <button
          data-tag={tag}
          class="tag-btn font-mono text-xs px-2 py-1 rounded border bg-surface0 text-peach border-surface0 hover:border-overlay0 transition-colors"
        >
          {tag}
        </button>
      ))}
    </div>

    <!-- Post list -->
    <div id="post-list">
      {allPosts.map(post => (
        <div data-tags={JSON.stringify(post.data.tags)} class="post-item">
          <BlogPostCard
            title={post.data.title}
            date={post.data.date}
            description={post.data.description}
            tags={post.data.tags}
            slug={post.slug}
          />
        </div>
      ))}
    </div>
  </section>
</Layout>

<script>
  function applyFilter(tag: string) {
    const items = document.querySelectorAll<HTMLElement>('.post-item');
    items.forEach(item => {
      const tags: string[] = JSON.parse(item.dataset.tags || '[]');
      item.style.display = (!tag || tags.includes(tag)) ? '' : 'none';
    });

    document.querySelectorAll<HTMLElement>('.tag-btn').forEach(btn => {
      const active = btn.dataset.tag === tag;
      btn.classList.toggle('border-mauve', active);
      btn.classList.toggle('text-mauve', active);
    });

    const url = new URL(window.location.href);
    if (tag) {
      url.searchParams.set('tag', tag);
    } else {
      url.searchParams.delete('tag');
    }
    window.history.replaceState({}, '', url.toString());
  }

  // Initialize from URL param
  const initialTag = new URL(window.location.href).searchParams.get('tag') || '';
  applyFilter(initialTag);

  document.querySelectorAll<HTMLElement>('.tag-btn').forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.tag || ''));
  });
</script>
```

- [ ] **Step 2: Verify in browser**

Navigate to http://localhost:4321/blog. Verify posts list renders, tags show, clicking a tag filters posts, URL param updates.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: add blog index with client-side tag filter"
```

---

## Task 12: Blog post page

**Files:**
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Create src/pages/blog/[slug].astro**

```astro
---
import Layout from '../../layouts/Layout.astro';
import SkillBadge from '../../components/SkillBadge.astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return sorted.map((post, index) => ({
    params: { slug: post.slug },
    props: {
      post,
      prev: sorted[index + 1] ?? null,
      next: sorted[index - 1] ?? null,
    },
  }));
}

interface Props {
  post: CollectionEntry<'blog'>;
  prev: CollectionEntry<'blog'> | null;
  next: CollectionEntry<'blog'> | null;
}

const { post, prev, next } = Astro.props;
const { Content } = await post.render();

const wordCount = post.body.split(/\s+/).length;
const readingTime = Math.ceil(wordCount / 200);

const formatted = post.data.date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<Layout title={`${post.data.title} — Anastasia Coffman`} description={post.data.description}>
  <article>
    <!-- Header -->
    <header class="mb-10">
      <a href="/blog" class="font-mono text-xs text-overlay0 hover:text-text transition-colors mb-6 inline-block">← /blog</a>
      <h1 class="font-mono text-2xl font-bold text-text mb-4">{post.data.title}</h1>
      <div class="flex items-center gap-4 font-mono text-xs text-overlay0 mb-4">
        <time>{formatted}</time>
        <span>·</span>
        <span>{readingTime} min read</span>
      </div>
      <div class="flex flex-wrap gap-2">
        {post.data.tags.map(tag => <SkillBadge name={tag} variant="tag" />)}
      </div>
    </header>

    <!-- Content -->
    <div class="prose max-w-none">
      <Content />
    </div>

    <!-- Prev / Next -->
    <nav class="mt-16 pt-8 border-t border-surface0 grid grid-cols-2 gap-4 font-mono text-sm">
      <div>
        {prev && (
          <a href={`/blog/${prev.slug}`} class="group flex flex-col gap-1 hover:text-text transition-colors">
            <span class="text-overlay0 text-xs">← older</span>
            <span class="text-subtext group-hover:text-text transition-colors">{prev.data.title}</span>
          </a>
        )}
      </div>
      <div class="text-right">
        {next && (
          <a href={`/blog/${next.slug}`} class="group flex flex-col gap-1 items-end hover:text-text transition-colors">
            <span class="text-overlay0 text-xs">newer →</span>
            <span class="text-subtext group-hover:text-text transition-colors">{next.data.title}</span>
          </a>
        )}
      </div>
    </nav>
  </article>
</Layout>
```

- [ ] **Step 2: Verify in browser**

Navigate to http://localhost:4321/blog/hello-world. Verify post renders with correct title, date, reading time, tags, and code block syntax highlighting in Catppuccin Mocha.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/[slug].astro
git commit -m "feat: add blog post page with reading time and prev/next nav"
```

---

## Task 13: Contact page

**Files:**
- Create: `src/pages/contact.astro`

- [ ] **Step 1: Create contact.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import { Mail } from 'lucide-astro';
---

<Layout title="Contact — Anastasia Coffman" description="Get in touch with Anastasia Coffman.">
  <section class="max-w-xl">
    <h1 class="font-mono text-sm text-overlay0 mb-8">// contact</h1>

    <p class="text-sm text-subtext mb-8 leading-relaxed" style="font-family: system-ui, -apple-system, sans-serif;">
      Have a role in mind, want to collaborate, or just want to say hello? Send me a message.
    </p>

    <div data-fs-success class="hidden bg-mantle border border-green text-green font-mono text-sm p-4 rounded mb-6">
      message sent — I'll get back to you soon.
    </div>

    <div data-fs-error class="hidden bg-mantle border border-red text-red font-mono text-sm p-4 rounded mb-6"></div>

    <form id="contact-form" class="space-y-6">
      <div>
        <label for="name" class="font-mono text-xs text-overlay0 block mb-2">name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          data-fs-field
          class="w-full bg-mantle border border-surface0 rounded px-4 py-3 font-mono text-sm text-text placeholder-overlay0 focus:outline-none focus:border-blue transition-colors"
          placeholder="Your name"
        />
        <span data-fs-error="name" class="font-mono text-xs text-red mt-1 block"></span>
      </div>

      <div>
        <label for="email" class="font-mono text-xs text-overlay0 block mb-2">email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          data-fs-field
          class="w-full bg-mantle border border-surface0 rounded px-4 py-3 font-mono text-sm text-text placeholder-overlay0 focus:outline-none focus:border-blue transition-colors"
          placeholder="you@example.com"
        />
        <span data-fs-error="email" class="font-mono text-xs text-red mt-1 block"></span>
      </div>

      <div>
        <label for="message" class="font-mono text-xs text-overlay0 block mb-2">message</label>
        <textarea
          id="message"
          name="message"
          required
          rows="5"
          data-fs-field
          class="w-full bg-mantle border border-surface0 rounded px-4 py-3 font-mono text-sm text-text placeholder-overlay0 focus:outline-none focus:border-blue transition-colors resize-none"
          placeholder="What's on your mind?"
        ></textarea>
        <span data-fs-error="message" class="font-mono text-xs text-red mt-1 block"></span>
      </div>

      <button
        type="submit"
        data-fs-submit-btn
        class="flex items-center gap-2 bg-green text-base font-mono text-sm font-semibold px-6 py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Mail size={14} />
        send message
      </button>
    </form>
  </section>
</Layout>

<script>
  import { initForm } from '@formspree/ajax';
  initForm({ formElement: '#contact-form', formId: 'xjgzjgpq' });
</script>
```

- [ ] **Step 2: Verify in browser**

Navigate to http://localhost:4321/contact. Verify form renders with correct styles. Submit with an empty field and confirm validation feedback appears (the `data-fs-error` spans show).

- [ ] **Step 3: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat: add contact page with Formspree ajax integration"
```

---

## Task 14: Final build verification

- [ ] **Step 1: Run full type check**

```bash
bun astro check
```

Expected: zero errors or warnings.

- [ ] **Step 2: Run production build**

```bash
bun build
```

Expected: build completes without errors. Output in `dist/` with all pages generated.

- [ ] **Step 3: Preview production build**

```bash
bun preview
```

Open http://localhost:4321. Walk through each route and verify:
- `/` — whoami hero, project cards, blog posts
- `/about` — terminal bio block
- `/projects` — card grid
- `/experience` — timeline
- `/skills` — badge categories
- `/blog` — post list, tag filter works
- `/blog/hello-world` — post renders, code block has Catppuccin Mocha syntax highlighting
- `/contact` — form renders
- Nav active state highlights correctly on each page
- Mobile hamburger menu opens/closes

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete portfolio site — all pages, blog, contact form"
```
