# Vincent Jared — Developer Portfolio

A personal developer portfolio built with React 19 and Tailwind CSS v4, with a markdown blog. Deliberately light: no 3D, no WebGL, one Canvas 2D starfield, and a ~326 KB JS bundle.

---

## Live Sections

| Section | Description |
|---|---|
| **Hero** | Typographic hero with a rotating multilingual greeting and blaugrana name |
| **Experience** | Vertical timeline with company logos, role descriptions, and dates |
| **Projects** | Project cards with screenshots, tags, and live / repo links |
| **Blogs** | Markdown blog — posts live in `src/posts/`, rendered as pages |
| **Skills** | Categorised skill cards with animated progress bars and percentage counters |
| **Contact** | Social links (LinkedIn, GitHub) and resume download |

---

## Tech Stack

| Category | Libraries / Tools |
|---|---|
| Framework | React 19 + Vite 7 |
| Animation | GSAP 3 + ScrollTrigger, `@gsap/react` |
| Styling | Tailwind CSS v4, Space Grotesk (Google Fonts) |
| Blog | `marked`, markdown files in `src/posts/`, hash routing |
| Canvas FX | HTML5 Canvas 2D API (galaxy starfield + shooting stars) |
| Build | Vite, ESLint |

---

## Project Structure

```
src/
├── App.jsx                        # Root layout, hash route split, lazy sections
├── main.jsx
├── index.css                      # Global styles, @theme tokens, post prose styles
│
├── constants/
│   └── index.js                   # Content data (nav links, experience, projects)
│
├── lib/
│   ├── posts.js                   # Globs src/posts, parses frontmatter, renders markdown
│   └── useHashRoute.js            # #/blogs/<slug> routing
│
├── posts/                         # Blog posts — one .md file per post
│
├── sections/
│   ├── Hero.jsx                   # Typographic hero + Overview
│   ├── Experience.jsx             # Timeline layout with company logos
│   ├── Projects.jsx               # Project cards with tags and live / repo links
│   ├── Blogs.jsx                  # Post list
│   ├── PostPage.jsx               # Single post reading view
│   ├── TechStack.jsx              # Skill category cards with GSAP animations
│   ├── Contact.jsx                # Links + resume download
│   └── Footer.jsx
│
└── components/
    ├── GalaxyLayer.jsx            # Canvas starfield with twinkling + shooting stars
    ├── NavBar.jsx
    └── TitleHeader.jsx

public/
├── images/
│   └── ...                        # Experience company logos, project images
├── projects/                      # Project screenshots
└── resume/                        # Resume PDF
```

---

## Key Features

### Blogs (markdown blog)
- Every `.md` file in `src/posts/` becomes a post — no index to maintain
- Frontmatter: `title`, `date` (YYYY-MM-DD), `tags`, `excerpt`, `draft`
- `draft: true` hides a post from the list but keeps it at its direct URL
- Reading time computed from word count
- Routes are namespaced under `#/blogs/<slug>` so they never collide with the
  page's own `#projects`-style anchors — and deep links work on any static host
  with no rewrite rules

### Galaxy Starfield
- Canvas 2D API rendering 280 stars with drift, twinkling, and radial glow
- 4 shooting stars with gradient tails that reset on exit
- Nebula colour blobs via CSS radial gradients
- Active behind the closing sections
- The only animation loop on the page

### Skill Cards (TechStack)
- 6 categories with per-category accent colours and emoji icons
- Progress bars animate from 0 → target on scroll entry (GSAP `scaleX`)
- Percentage counters count up from 0 simultaneously
- Hover glow, corner radial gradient, card entrance stagger

### Experience Timeline
- 3px gradient vertical divider
- 56px circular nodes displaying company logos
- Cards alternate sides with arrow connectors
- Dates shown on the opposite side from the card

---

## Writing a post

Create a markdown file in `src/posts/`. The filename becomes the slug.

```markdown
---
title: Why Rust finally clicked
date: 2026-09-01
tags: rust, systems
excerpt: One sentence shown under the title in the post list.
draft: true
---

Your post body here.
```

Set `draft: false` (or remove the line) to publish it.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```
## Author

**Vincent Jared**
- GitHub: [github.com/jaredvincent414](https://github.com/jaredvincent414)
- LinkedIn: [linkedin.com/in/vincent-jared-1b5954265](https://www.linkedin.com/in/vincent-jared-1b5954265/)
