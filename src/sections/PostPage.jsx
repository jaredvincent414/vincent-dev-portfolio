import { useEffect, useState } from "react";

import { getPost } from "../lib/posts";

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const PostPage = ({ slug }) => {
  const post = getPost(slug);
  const [html, setHtml] = useState("");

  // `marked` is loaded on demand so it never reaches the main bundle.
  useEffect(() => {
    if (!post) return;
    let cancelled = false;
    import("marked").then(({ marked }) => {
      if (!cancelled) setHtml(marked.parse(post.body));
    });
    return () => { cancelled = true; };
  }, [post]);

  useEffect(() => {
    document.title = post
      ? `${post.title} | Vincent Jared`
      : "Not found | Vincent Jared";
    return () => { document.title = "Vincent Jared | Software Engineer"; };
  }, [post]);

  if (!post) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-grana-300 text-xs tracking-[0.3em] uppercase">404</p>
        <h1 className="text-white text-3xl md:text-5xl font-bold">No post at that address.</h1>
        <a href="#blogs"
           className="text-white/65 hover:text-white text-sm transition-colors duration-200">
          ← Back to blogs
        </a>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-5 md:px-20 py-20 md:py-28">
      <article className="max-w-2xl mx-auto">

        <a
          href="#blogs"
          className="inline-block text-white/65 hover:text-grana-300 text-sm mb-12
                     transition-colors duration-200"
        >
          ← All blogs
        </a>

        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <time className="text-white/60 text-xs tracking-widest uppercase">
              {formatDate(post.date)}
            </time>
            <span className="text-white/55">·</span>
            <span className="text-white/60 text-xs">{post.readingTime} min read</span>
          </div>

          <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight mb-5">
            {post.title}
          </h1>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-grana-500/10
                             border border-grana-500/20 text-grana-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Markdown is authored by me, in this repo — not user input. */}
        <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />

        <footer className="mt-16 pt-8 border-t border-white/[0.08]">
          <a
            href="#blogs"
            className="text-white/65 hover:text-grana-300 text-sm transition-colors duration-200"
          >
            ← All blogs
          </a>
        </footer>

      </article>
    </main>
  );
};

export default PostPage;
