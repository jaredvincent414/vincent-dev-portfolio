import { CATEGORY_ORDER, UNCATEGORISED } from "./categories";

// Every .md file in src/posts is a blog post. Add a file, it shows up —
// no registration, no index to keep in sync.
const files = import.meta.glob("../posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

// Minimal frontmatter parser. Handles `key: value` lines between two `---`
// fences — enough for title/date/tags/excerpt without pulling in gray-matter.
//
// It also has to read what Decap CMS writes, which is real YAML rather than the
// single-line shorthand you get by hand. So list keys are accepted in both
// forms, and quoted values are unwrapped — Decap quotes anything containing a
// colon, which is exactly the case that would otherwise truncate at the colon.
//
//   tags: rust, latency        →  ["rust", "latency"]
//   tags:                      →  ["rust", "latency"]
//     - rust
//     - latency
const LIST_KEYS = new Set(["tags", "categories"]);

const stripQuotes = (value) => {
  const quoted = value.match(/^(['"])([\s\S]*)\1$/);
  return quoted ? quoted[2] : value;
};

const parseFrontmatter = (raw) => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const [, block, body] = match;
  const lines = block.split(/\r?\n/);
  const meta = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const idx = line.indexOf(":");
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    const inline = line.slice(idx + 1).trim();

    // An empty value may be a YAML block list on the following lines.
    if (!inline) {
      const items = [];
      while (i + 1 < lines.length && /^\s*-\s+/.test(lines[i + 1])) {
        items.push(stripQuotes(lines[++i].replace(/^\s*-\s+/, "").trim()));
      }
      if (items.length) {
        meta[key] = items;
        continue;
      }
    }

    const value = stripQuotes(inline);
    meta[key] = LIST_KEYS.has(key)
      ? value.split(",").map((t) => t.trim()).filter(Boolean)
      : value;
  }

  return { meta, body };
};

const slugOf = (path) => path.split("/").pop().replace(/\.md$/, "");

const readingTime = (body) => {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
};

const posts = Object.entries(files)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw);
    return {
      slug: slugOf(path),
      title: meta.title || slugOf(path),
      date: meta.date || "",
      tags: meta.tags || [],
      categories: meta.categories?.length ? meta.categories : [UNCATEGORISED],
      cover: meta.cover || "",
      excerpt: meta.excerpt || "",
      draft: String(meta.draft).toLowerCase() === "true",
      readingTime: readingTime(body),
      // Raw markdown. Rendering is deliberately deferred: `marked` is ~40 kB and
      // is only needed on a post page, so PostPage imports it dynamically. This
      // keeps it out of the main bundle even though the hero reads post metadata.
      body,
    };
  })
  // Newest first. Dates are ISO (YYYY-MM-DD), so string compare is enough.
  .sort((a, b) => b.date.localeCompare(a.date));

// Drafts stay out of the published list but remain reachable by direct link,
// so you can preview one before you publish it.
export const publishedPosts = posts.filter((p) => !p.draft);
export const getPost = (slug) => posts.find((p) => p.slug === slug);
export default posts;

// ── Categories ───────────────────────────────────────────────────────────────
// The blog index is organised the way the HRT Beat is: a "Latest" row, then one
// section per category. A post may sit in several categories at once, so these
// sections overlap by design rather than partitioning the archive.

// Declaring the order here (rather than deriving it from the posts) keeps the
// category nav stable as posts come and go — otherwise publishing a post could
// silently reorder the whole index.
export { CATEGORY_ORDER };

export const LATEST_COUNT = 3;

// Anything a post files itself under that is not in CATEGORY_ORDER still gets a
// section, appended after the declared ones — a typo shows up as its own
// heading instead of vanishing from the page.
export const categories = (() => {
  const seen = new Set();
  for (const post of publishedPosts) for (const c of post.categories) seen.add(c);

  const known = CATEGORY_ORDER.filter((c) => seen.has(c));
  const extra = [...seen].filter((c) => !CATEGORY_ORDER.includes(c)).sort();
  return [...known, ...extra];
})();

export const postsIn = (category) =>
  publishedPosts.filter((p) => p.categories.includes(category));

export const latestPosts = publishedPosts.slice(0, LATEST_COUNT);
