// Post data, compiled at build time by the Vite plugin in vite.config.js.
// See scripts/blog/posts.mjs for the pipeline itself.
import { posts } from "virtual:blog-posts";

export { posts };

export const getPost = (slug) => posts.find((post) => post.slug === slug);

export const postsInCategory = (categorySlug) =>
  posts.filter((post) => post.category === categorySlug);

export const latestPosts = posts.slice(0, 3);

// Adjacent posts for the prev/next links, in the index's own order: `previous`
// is the newer neighbour, `next` the older one.
export const adjacentPosts = (slug) => {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: posts[index - 1] ?? null,
    next: posts[index + 1] ?? null,
  };
};
