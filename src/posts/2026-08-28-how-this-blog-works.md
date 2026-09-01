---
title: How this blog works
date: 2026-08-28
tags: meta, site
categories: Notes
excerpt: Every markdown file in src/posts becomes a page. Here is the whole system, which is smaller than you would expect.
---

This post exists to document the blog it is published on. Replace or delete it
once you have written something real.

## Adding a post

Create a file in `src/posts/`. The filename becomes the URL:

```
src/posts/2026-09-01-why-rust-clicked.md
  ->  /#/blogs/2026-09-01-why-rust-clicked
```

There is no index to update and nothing to register. The loader globs the
directory at build time, so a new file is a new post.

## Frontmatter

Every post starts with a fenced block of metadata:

```markdown
---
title: Why Rust finally clicked
date: 2026-09-01
tags: rust, systems
categories: Systems, Engineering
cover: /blog/rust-clicked.png
excerpt: One sentence that shows up in the post list.
draft: true
---
```

Only `title` and `date` really matter. `date` must be `YYYY-MM-DD` — the index
sorts on it, newest first. `tags` and `categories` are both comma-separated
lists. `excerpt` is one line of summary. `cover` is the card thumbnail.

`draft: true` keeps a post out of the published list while leaving it reachable
at its direct URL, so you can read it in place before committing to it.

## Categories

The index is organised into sections: a **Latest** row, then one section per
category. `categories` decides which sections a post appears in — and a post can
sit in more than one, so "Why Rust finally clicked" shows up under both Systems
and Engineering rather than having to pick.

The section order is fixed in `src/lib/posts.js`:

```js
export const CATEGORY_ORDER = ["Systems", "Engineering", "Machine Learning", "Notes"];
```

A category is declared there so the nav stays stable as posts come and go. File a
post under something not on that list and it still gets a section, appended at
the end — a typo becomes a visible heading rather than a post that quietly
disappears. Omit `categories` entirely and the post lands in Notes.

`cover` is optional. Without one the card draws a claret gradient tile with the
category name on it, so the grid stays even whether or not you made an image.

## What you can write

Standard markdown: **bold**, headings, lists, links, images, and code.

> Block quotes render with a claret rule down the left side.

- Lists work
- `Inline code` works
- Images go in `public/` and are referenced as `/my-image.png`

That is the entire system — a glob, a frontmatter parser, and `marked`. About
150 lines all in, with no CMS, no database, and no third party holding your
writing.
