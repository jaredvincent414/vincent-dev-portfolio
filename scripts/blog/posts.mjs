// The blog's content pipeline: read content/blog, parse frontmatter, compile
// markdown to HTML.
//
// This runs in Node and is the single source of truth for post data. The Vite
// plugin serves it to the browser as a virtual module; the prerender step reads
// it directly to emit static pages, RSS, and the sitemap. Compiling in one
// place is what keeps the prerendered HTML and the client's HTML identical.
//
// Because compilation happens here rather than in the browser, `marked`,
// `shiki`, and `katex` never reach the client bundle.

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import { Marked } from "marked";
import { createHighlighter } from "shiki";
import katex from "katex";

import { CATEGORY_SLUGS } from "../../src/lib/categories.js";

export const CONTENT_DIR = "content/blog";

// Loaded once. `codeToHtml` is synchronous once the highlighter exists, which
// is what lets the marked renderer below stay synchronous.
const HIGHLIGHT_LANGUAGES = [
  "rust", "python", "typescript", "javascript", "sql",
  "bash", "json", "yaml", "toml", "markdown", "jsx", "tsx",
];

let highlighterPromise;
const getHighlighter = () => {
  highlighterPromise ??= createHighlighter({
    themes: ["github-dark-default"],
    langs: HIGHLIGHT_LANGUAGES,
  });
  return highlighterPromise;
};

// `## A heading` -> `a-heading`, for anchor links.
const headingId = (text) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const escapeHtml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;");

// Math. Written as a marked extension rather than pulled in as another
// dependency: `$$...$$` on its own lines is display math, `$...$` inline.
const displayMath = {
  name: "displayMath",
  level: "block",
  start: (src) => src.indexOf("$$"),
  tokenizer(src) {
    const match = /^\$\$([\s\S]+?)\$\$(?:\n|$)/.exec(src);
    if (match) return { type: "displayMath", raw: match[0], text: match[1].trim() };
  },
  renderer: (token) =>
    katex.renderToString(token.text, { displayMode: true, throwOnError: false }),
};

const inlineMath = {
  name: "inlineMath",
  level: "inline",
  start: (src) => src.indexOf("$"),
  tokenizer(src) {
    // Require a non-space next to the delimiters so prices ("$5 and $10") are
    // not swallowed as math.
    const match = /^\$(?!\s)([^$\n]+?)(?<!\s)\$/.exec(src);
    if (match) return { type: "inlineMath", raw: match[0], text: match[1] };
  },
  renderer: (token) =>
    katex.renderToString(token.text, { displayMode: false, throwOnError: false }),
};

const createMarked = (highlighter) => {
  const marked = new Marked({ gfm: true });

  marked.use({
    extensions: [displayMath, inlineMath],
    renderer: {
      code({ text, lang }) {
        const language = HIGHLIGHT_LANGUAGES.includes(lang) ? lang : "text";
        if (language === "text") {
          return `<pre class="shiki-plain"><code>${escapeHtml(text)}</code></pre>`;
        }
        return highlighter.codeToHtml(text, {
          lang: language,
          theme: "github-dark-default",
        });
      },

      // Anchor links. The heading itself is the link, so the whole line is a
      // click target, with a visible marker on hover.
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = headingId(text);
        return `<h${depth} id="${id}"><a class="heading-anchor" href="#${id}">` +
               `${text}<span class="heading-anchor-marker" aria-hidden="true">#</span>` +
               `</a></h${depth}>\n`;
      },
    },
  });

  return marked;
};

// Frontmatter: `key: value` between two `---` fences. Values may be quoted, and
// `tags` accepts either an inline comma list or a YAML block list, because
// Decap CMS writes the latter.
const stripQuotes = (value) => {
  const quoted = value.match(/^(['"])([\s\S]*)\1$/);
  return quoted ? quoted[2] : value;
};

const parseFrontmatter = (raw, filename) => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`${filename}: missing frontmatter block`);
  }

  const [, block, body] = match;
  const lines = block.split(/\r?\n/);
  const meta = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const inline = line.slice(separator + 1).trim();

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
    meta[key] = key === "tags"
      ? value.split(",").map((tag) => tag.trim()).filter(Boolean)
      : value;
  }

  return { meta, body };
};

// A malformed post is a build failure, not a post that quietly renders wrong.
const validate = (meta, filename) => {
  for (const field of ["title", "date", "category", "summary"]) {
    if (!meta[field]) throw new Error(`${filename}: missing required "${field}"`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) {
    throw new Error(`${filename}: date must be YYYY-MM-DD, got "${meta.date}"`);
  }
  if (!CATEGORY_SLUGS.includes(meta.category)) {
    throw new Error(
      `${filename}: category "${meta.category}" is not one of ${CATEGORY_SLUGS.join(", ")}`
    );
  }
};

const readingTime = (body) =>
  Math.max(1, Math.round(body.trim().split(/\s+/).length / 220));

/**
 * @param {object} options
 * @param {boolean} options.includeDrafts  Dev builds keep drafts; production drops them.
 * @param {string}  options.root           Repo root.
 */
export const loadPosts = async ({ includeDrafts, root = process.cwd() }) => {
  const dir = join(root, CONTENT_DIR);
  const filenames = (await readdir(dir)).filter((name) => name.endsWith(".md"));

  const highlighter = await getHighlighter();
  const marked = createMarked(highlighter);

  const posts = [];
  for (const filename of filenames) {
    const raw = await readFile(join(dir, filename), "utf8");
    const { meta, body } = parseFrontmatter(raw, filename);
    validate(meta, filename);

    const draft = String(meta.draft).toLowerCase() === "true";
    if (draft && !includeDrafts) continue;

    posts.push({
      // Filename is the slug, so the URL is stable regardless of the date.
      slug: filename.replace(/\.md$/, ""),
      title: meta.title,
      date: meta.date,
      category: meta.category,
      summary: meta.summary,
      tags: meta.tags ?? [],
      draft,
      readingTime: readingTime(body),
      html: marked.parse(body),
    });
  }

  // Dates are ISO, so a string compare orders them correctly.
  return posts.sort((a, b) => b.date.localeCompare(a.date));
};
