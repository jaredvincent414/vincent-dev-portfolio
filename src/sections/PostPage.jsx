import { useEffect } from "react";

import { getPost, adjacentPosts } from "../lib/posts";
import { categoryLabel } from "../lib/categories";
import { postPath } from "../lib/useRoute";
import { SITE_URL, SITE_NAME } from "../lib/site";

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

// The prerendered page already carries the right <head>. This keeps it correct
// after a client-side navigation, where no new document is fetched.
const useDocumentMetadata = (post) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = post ? `${post.title} | ${SITE_NAME}` : `Not found | ${SITE_NAME}`;
    if (!post) return () => { document.title = previousTitle; };

    const tags = [
      ["name", "description", post.summary],
      ["property", "og:title", post.title],
      ["property", "og:description", post.summary],
      ["property", "og:type", "article"],
      ["property", "og:url", `${SITE_URL}${postPath(post.slug)}`],
      ["name", "twitter:title", post.title],
      ["name", "twitter:description", post.summary],
    ];

    const previous = tags.map(([attr, key, value]) => {
      const el = document.head.querySelector(`meta[${attr}="${key}"]`);
      const before = el?.getAttribute("content") ?? null;
      if (el) el.setAttribute("content", value);
      return [el, before];
    });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    const hadCanonical = Boolean(canonical);
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    const previousHref = canonical.getAttribute("href");
    canonical.href = `${SITE_URL}${postPath(post.slug)}`;

    return () => {
      document.title = previousTitle;
      for (const [el, before] of previous) {
        if (el && before !== null) el.setAttribute("content", before);
      }
      if (hadCanonical) canonical.setAttribute("href", previousHref);
      else canonical.remove();
    };
  }, [post]);
};

const AdjacentLink = ({ post, direction }) => (
  <a
    href={postPath(post.slug)}
    className="group flex flex-col gap-2 rounded-lg p-5 flex-1
               border border-white/[0.10] bg-white/[0.02]
               transition-colors duration-300 hover:border-grana-500/45"
  >
    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/45">
      {direction === "previous" ? "← Newer" : "Older →"}
    </span>
    <span className="font-mono text-sm text-white/85 leading-snug
                     transition-colors duration-300 group-hover:text-grana-300">
      {post.title}
    </span>
  </a>
);

const PostPage = ({ slug }) => {
  const post = getPost(slug);
  useDocumentMetadata(post);

  if (!post) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-grana-300 font-mono text-xs tracking-[0.3em] uppercase">404</p>
        <h1 className="text-white text-3xl md:text-5xl font-bold">No post at that address.</h1>
        <a href="/#blogs" className="text-white/65 hover:text-white text-sm transition-colors duration-200">
          ← Back to the blog
        </a>
      </main>
    );
  }

  const { previous, next } = adjacentPosts(slug);

  return (
    <main className="relative min-h-screen px-5 md:px-20 py-20 md:py-28">
      <article className="max-w-2xl mx-auto">
        <a
          href="/#blogs"
          className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/55
                     hover:text-grana-300 transition-colors duration-200"
        >
          ← The Backline
        </a>

        <p className="mt-10 font-mono text-[11px] tracking-[0.2em] uppercase text-grana-300">
          {categoryLabel(post.category)}
          {post.draft && <span className="text-white/45"> · Draft</span>}
        </p>

        <h1 className="mt-3 font-mono font-bold text-white text-3xl md:text-5xl
                       leading-[1.1] tracking-tight">
          {post.title}
        </h1>

        <p className="mt-5 font-mono text-[11px] tracking-[0.2em] uppercase text-white/50">
          {formatDate(post.date)} · {post.readingTime} min read
        </p>

        {post.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="font-mono text-[10px] tracking-[0.15em] uppercase
                           text-white/55 border border-white/15 rounded px-2 py-1"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {/* Compiled in Node by scripts/blog/posts.mjs — highlighting and math
            are already baked in, so nothing parses markdown in the browser. */}
        <div
          className="post-body mt-12"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {(previous || next) && (
          <nav className="mt-20 pt-10 border-t border-white/[0.08] flex flex-col sm:flex-row gap-4">
            {previous && <AdjacentLink post={previous} direction="previous" />}
            {next && <AdjacentLink post={next} direction="next" />}
          </nav>
        )}
      </article>
    </main>
  );
};

export default PostPage;
