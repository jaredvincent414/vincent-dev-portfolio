// The fixed category set. Frontmatter carries the slug; the index renders the
// label. Order here is the order sections appear on the blog index, and it is
// declared rather than derived so publishing a post never reorders the page.
//
// Adding a category means adding it here — `scripts/blog/posts.mjs` fails the
// build on any category not in this list, so a typo cannot reach production.
export const CATEGORIES = [
  { slug: "deep-dive", label: "Deep Dive" },
  { slug: "build-log", label: "Build Log" },
  { slug: "research", label: "Research" },
  { slug: "notes", label: "Notes" },
];

export const CATEGORY_SLUGS = CATEGORIES.map((category) => category.slug);

export const categoryLabel = (slug) =>
  CATEGORIES.find((category) => category.slug === slug)?.label ?? slug;
