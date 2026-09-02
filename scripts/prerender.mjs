// Runs after `vite build`. Emits one real HTML file per post, plus rss.xml and
// sitemap.xml.
//
// This is what makes the blog's metadata true rather than decorative: Open
// Graph scrapers and crawlers do not execute JavaScript, so a per-post <head>
// only counts if it is already in the document the server returns.
//
// Drafts never reach this step — `loadPosts({ includeDrafts: false })` drops
// them — so they get no page, no feed entry, and no sitemap entry.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

import { loadPosts } from "./blog/posts.mjs";
import { SITE_URL, SITE_NAME, BLOG_TITLE, BLOG_DESCRIPTION } from "../src/lib/site.js";

const DIST = "dist";

const escapeXml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const escapeAttribute = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Swap the shell's site-wide tags for this post's. The tags exist in
// index.html, so this replaces rather than appends — two og:title tags would
// leave the scraper to pick one.
const withPostMetadata = (shell, post) => {
  const url = `${SITE_URL}/blogs/${post.slug}`;
  const title = `${post.title} | ${SITE_NAME}`;

  const replacements = [
    [/<title>[\s\S]*?<\/title>/, `<title>${escapeXml(title)}</title>`],
    [
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeAttribute(post.summary)}" />`,
    ],
    [
      /<meta property="og:type" content="[^"]*" \/>/,
      `<meta property="og:type" content="article" />`,
    ],
    [
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${escapeAttribute(post.title)}" />`,
    ],
    [
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${escapeAttribute(post.summary)}" />`,
    ],
    [
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${escapeAttribute(post.title)}" />`,
    ],
    [
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${escapeAttribute(post.summary)}" />`,
    ],
  ];

  let html = shell;
  for (const [pattern, replacement] of replacements) {
    if (!pattern.test(html)) {
      throw new Error(
        `prerender: index.html no longer matches ${pattern}. ` +
        `The shell and this script have drifted apart.`
      );
    }
    html = html.replace(pattern, replacement);
  }

  // Canonical and og:url have no placeholder in the shell, so they are added.
  return html.replace(
    "</head>",
    `  <link rel="canonical" href="${url}" />\n` +
    `    <meta property="og:url" content="${url}" />\n` +
    `    <meta property="article:published_time" content="${post.date}" />\n` +
    `  </head>`
  );
};

// The crawler reads this; React replaces it on mount with the identical markup
// it compiles from the same source.
const withPrerenderedBody = (html, post) => {
  const body =
    `<main><article>` +
    `<p>${escapeXml(post.category)}</p>` +
    `<h1>${escapeXml(post.title)}</h1>` +
    `<p>${escapeXml(post.date)}</p>` +
    `<p>${escapeXml(post.summary)}</p>` +
    post.html +
    `</article></main>`;

  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
};

const buildRss = (posts) => {
  const items = posts.map((post) => {
    const url = `${SITE_URL}/blogs/${post.slug}`;
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <description>${escapeXml(post.summary)}</description>
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(BLOG_TITLE)}</title>
    <link>${SITE_URL}/#blogs</link>
    <description>${escapeXml(BLOG_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>
`;
};

const buildSitemap = (posts) => {
  const urls = [
    `  <url>\n    <loc>${SITE_URL}/</loc>\n  </url>`,
    ...posts.map(
      (post) =>
        `  <url>\n    <loc>${SITE_URL}/blogs/${post.slug}</loc>\n` +
        `    <lastmod>${post.date}</lastmod>\n  </url>`
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
};

const posts = await loadPosts({ includeDrafts: false });
const shell = await readFile(join(DIST, "index.html"), "utf8");

for (const post of posts) {
  const directory = join(DIST, "blogs", post.slug);
  await mkdir(directory, { recursive: true });
  const html = withPrerenderedBody(withPostMetadata(shell, post), post);
  await writeFile(join(directory, "index.html"), html, "utf8");
}

await writeFile(join(DIST, "rss.xml"), buildRss(posts), "utf8");
await writeFile(join(DIST, "sitemap.xml"), buildSitemap(posts), "utf8");

console.log(
  `prerender: ${posts.length} post page(s), rss.xml, sitemap.xml` +
  (posts.length ? `\n  ${posts.map((p) => `/blogs/${p.slug}`).join("\n  ")}` : "")
);
