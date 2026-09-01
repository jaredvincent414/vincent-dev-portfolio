#!/usr/bin/env node
// Scaffolds a post so the only thing left to do is write.
//
//   npm run post "Why Rust finally clicked"
//   npm run post "Why Rust finally clicked" -- --category Systems --publish
//
// The filename convention (YYYY-MM-DD-slug.md) and the frontmatter shape are
// the two things easy to get subtly wrong by hand — a bad `date` silently
// misorders the index, and a category typo quietly opens a new section. This
// gets both right and validates the category against the real list.

import { writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

import { CATEGORY_ORDER, UNCATEGORISED } from "../src/lib/categories.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = join(root, "src", "posts");

const argv = process.argv.slice(2);

const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? null : argv[i + 1] ?? null;
};
const has = (name) => argv.includes(`--${name}`);

// Everything that isn't a flag or a flag's value is the title.
const flagNames = ["category", "tags", "excerpt"];
const consumed = new Set();
for (const name of flagNames) {
  const i = argv.indexOf(`--${name}`);
  if (i !== -1) consumed.add(i).add(i + 1);
}
const title = argv
  .filter((arg, i) => !consumed.has(i) && !arg.startsWith("--"))
  .join(" ")
  .trim();

if (!title) {
  console.error(`
Usage: npm run post "Your title here" [-- --category Systems] [--publish]

  --category   One of: ${CATEGORY_ORDER.join(", ")}   (default: ${UNCATEGORISED})
  --tags       Comma-separated, e.g. --tags "rust, latency"
  --excerpt    One-line summary for the card
  --publish    Create it published; the default is draft: true
`);
  process.exit(1);
}

const category = flag("category") ?? UNCATEGORISED;
if (!CATEGORY_ORDER.includes(category)) {
  console.error(
    `\n  "${category}" is not a known category.\n` +
    `  Known: ${CATEGORY_ORDER.join(", ")}\n\n` +
    `  Add it to src/lib/categories.js first if it is meant to be new.\n`
  );
  process.exit(1);
}

// Local date, not UTC — `toISOString()` on an evening in the US rolls the date
// forward and files the post under tomorrow.
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

const filename = `${today}-${slug}.md`;
const path = join(POSTS_DIR, filename);

const exists = await access(path).then(() => true, () => false);
if (exists) {
  console.error(`\n  ${relative(root, path)} already exists — not overwriting it.\n`);
  process.exit(1);
}

// A bare colon would end the key/value split early, so quote any value that
// contains one — the parser unwraps quotes, the same way it does for the YAML
// Decap CMS writes. Quoting preserves the real title; escaping would not.
const safe = (value) =>
  /[:#]/.test(value) ? `"${value.replace(/"/g, '\\"')}"` : value;

const frontmatter = [
  "---",
  `title: ${safe(title)}`,
  `date: ${today}`,
  `tags: ${flag("tags") ?? ""}`,
  `categories: ${category}`,
  `excerpt: ${safe(flag("excerpt") ?? "")}`,
  ...(has("publish") ? [] : ["draft: true"]),
  "---",
  "",
  "",
].join("\n");

await writeFile(path, frontmatter, "utf8");

console.log(`
  Created  ${relative(root, path)}
  Preview  http://localhost:5173/#/blogs/${today}-${slug}
  ${has("publish")
    ? "Published — it will appear on the index."
    : "Draft — reachable at that URL, hidden from the index. Remove `draft: true` to publish."}
`);
