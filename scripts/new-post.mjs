#!/usr/bin/env node
// Scaffolds a post so the only thing left to do is write.
//
//   npm run post "Why Rust finally clicked"
//   npm run post "Why Rust finally clicked" -- --category deep-dive --publish
//
// The filename is the slug, and the frontmatter shape is validated at build
// time — this gets both right up front rather than failing the build later.

import { writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

import { CATEGORIES, CATEGORY_SLUGS } from "../src/lib/categories.js";
import { CONTENT_DIR } from "./blog/posts.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const argv = process.argv.slice(2);
const flag = (name) => {
  const index = argv.indexOf(`--${name}`);
  return index === -1 ? null : argv[index + 1] ?? null;
};
const has = (name) => argv.includes(`--${name}`);

const flagNames = ["category", "tags", "summary"];
const consumed = new Set();
for (const name of flagNames) {
  const index = argv.indexOf(`--${name}`);
  if (index !== -1) consumed.add(index).add(index + 1);
}
const title = argv
  .filter((arg, index) => !consumed.has(index) && !arg.startsWith("--"))
  .join(" ")
  .trim();

if (!title) {
  console.error(`
Usage: npm run post "Your title here" [-- --category deep-dive] [--publish]

  --category   ${CATEGORIES.map((c) => `${c.slug} (${c.label})`).join(", ")}
  --tags       Comma-separated, e.g. --tags "rust, latency"
  --summary    One-line summary, shown on the index cards
  --publish    Create it published; the default is draft: true
`);
  process.exit(1);
}

const category = flag("category") ?? "notes";
if (!CATEGORY_SLUGS.includes(category)) {
  console.error(
    `\n  "${category}" is not a category.\n  Known: ${CATEGORY_SLUGS.join(", ")}\n\n` +
    `  Add it to src/lib/categories.js first if it is meant to be new.\n`
  );
  process.exit(1);
}

// Local date, not UTC — `toISOString()` on an evening in the US rolls the date
// forward and dates the post tomorrow.
const now = new Date();
const today = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, "0"),
  String(now.getDate()).padStart(2, "0"),
].join("-");

const slug = title
  .toLowerCase()
  .replace(/['']/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const path = join(root, CONTENT_DIR, `${slug}.md`);
if (await access(path).then(() => true, () => false)) {
  console.error(`\n  ${relative(root, path)} already exists — not overwriting it.\n`);
  process.exit(1);
}

// A bare colon would end the key/value split early, so quote any value that
// contains one. The parser unwraps quotes, so the real title survives.
const safe = (value) => (/[:#]/.test(value) ? `"${value.replace(/"/g, '\\"')}"` : value);

const summary = flag("summary") ?? "One line describing the post.";

await writeFile(path, [
  "---",
  `title: ${safe(title)}`,
  `date: ${today}`,
  `category: ${category}`,
  `summary: ${safe(summary)}`,
  `tags: ${flag("tags") ?? ""}`,
  `draft: ${has("publish") ? "false" : "true"}`,
  "---",
  "",
  "",
].join("\n"), "utf8");

console.log(`
  Created  ${relative(root, path)}
  Preview  http://localhost:5173/blogs/${slug}
  ${has("publish")
    ? "Published — it will appear on the index and in RSS."
    : "Draft — visible in dev only, excluded from the production build and RSS."}
`);
