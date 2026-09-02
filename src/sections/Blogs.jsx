import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { posts, latestPosts, postsInCategory } from "../lib/posts";
import { CATEGORIES } from "../lib/categories";
import { postPath } from "../lib/useRoute";

gsap.registerPlugin(ScrollTrigger);

// The blog's own name, the way the HRT Beat is a masthead rather than the word
// "Blog". Change this string and the masthead changes with it.
const BLOG_NAME = "The Backline";

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const sectionId = (categorySlug) => `blog-${categorySlug}`;

// The page sets `scroll-behavior: smooth`, so a native fragment jump animates
// its way down. `useRoute` documents why that is unreliable here: sections
// mount lazily above the target and the resulting layout shifts cancel a smooth
// scroll partway. Jumping instantly is deterministic regardless of what is
// still mounting.
//
// Deliberately leaves the URL alone. Writing `#blog-<category>` here would arm
// every later reload to jump back to that category — a browsing click is not a
// navigation the reader asked to persist. Post links and the nav's own anchors
// still set the URL, because those the reader did choose.
const jumpToCategory = (event, id) => {
  const el = document.getElementById(id);
  if (!el) return;
  // preventDefault also stops the click interceptor in `useRoute`, which bails
  // on an already-defaulted event — so no hash is written from either side.
  event.preventDefault();
  el.scrollIntoView({ behavior: "instant", block: "start" });
};

const PostCard = ({ post, featured = false }) => (
  <a
    href={postPath(post.slug)}
    className={`blog-card group flex flex-col rounded-lg
                border border-white/[0.10] bg-white/[0.02]
                transition-colors duration-300 hover:border-grana-500/45
                ${featured ? "p-7 md:p-10" : "p-5"}`}
  >
    <h3
      className={`font-mono text-white leading-snug mb-3
                  transition-colors duration-300 group-hover:text-grana-300
                  ${featured ? "text-xl md:text-3xl" : "text-base md:text-lg"}`}
    >
      {post.title}
      {post.draft && (
        <span className="ml-2 align-middle font-mono text-[10px] tracking-[0.18em]
                         uppercase text-grana-300 border border-grana-500/40
                         rounded px-1.5 py-0.5">
          Draft
        </span>
      )}
    </h3>

    {/* Capped rather than full-bleed: a summary running the whole width of a
        featured card is a 150-character line, which is past comfortable reading. */}
    <p className={`font-mono text-white/65 leading-[1.7] mb-5
                   ${featured ? "text-base max-w-2xl" : "text-sm"}`}>
      {post.summary}
    </p>

    <p className="mt-auto font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">
      {formatDate(post.date)} · {post.readingTime} min read
    </p>
  </a>
);

// Columns follow how many posts there are, so a lone post fills its row instead
// of sitting in a third of one, and the grid tightens as the archive grows.
//
// Written out in full rather than composed: Tailwind scans source for literal
// class strings, so an interpolated `grid-cols-${n}` would never be generated.
const columnsForCount = (count) => {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
};

const PostGrid = ({ posts: gridPosts }) => {
  // One card carries the row on its own, so it gets room to look deliberate
  // rather than stretched.
  const featured = gridPosts.length === 1;

  return (
    <div className={`grid gap-5 ${columnsForCount(gridPosts.length)}`}>
      {gridPosts.map((post) => (
        <PostCard key={post.slug} post={post} featured={featured} />
      ))}
    </div>
  );
};

const SectionHeading = ({ children }) => (
  <h3 className="font-mono text-white/85 text-sm tracking-[0.22em] uppercase mb-6
                 pb-3 border-b border-white/[0.08]">
    {children}
  </h3>
);

const Blogs = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".blog-card",
      { y: 24, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.07, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      }
    );
  }, []);

  // Only categories that actually have posts get a heading and a nav entry.
  const populated = CATEGORIES
    .map((category) => ({ ...category, posts: postsInCategory(category.slug) }))
    .filter((category) => category.posts.length > 0);

  return (
    <section id="blogs" ref={sectionRef} className="relative z-10 py-12 md:py-16 px-5 md:px-20">
      <div className="max-w-6xl mx-auto">

        {/* Masthead — eyebrow over the blog's name, as on the HRT Beat. */}
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-grana-300 mb-3">
          Tech Blog
        </p>
        <h2 className="font-mono font-bold text-white text-4xl md:text-6xl tracking-tighter mb-6">
          {BLOG_NAME}
        </h2>

        {posts.length === 0 ? (
          <p className="font-mono text-sm text-white/65 mt-8">
            Nothing published yet — add a markdown file to <code>content/blog/</code>.
          </p>
        ) : (
          <>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 pb-8 mb-12
                            border-b border-white/[0.08]">
              {populated.map((category) => (
                <a
                  key={category.slug}
                  href={`#${sectionId(category.slug)}`}
                  onClick={(event) => jumpToCategory(event, sectionId(category.slug))}
                  className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/55
                             hover:text-grana-300 transition-colors duration-200"
                >
                  {category.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-16">
              {/* Latest repeats posts that also appear under their category
                  below — the same overlap the HRT Beat has. */}
              <section>
                <SectionHeading>Latest</SectionHeading>
                <PostGrid posts={latestPosts} />
              </section>

              {populated.map((category) => (
                <section
                  key={category.slug}
                  id={sectionId(category.slug)}
                  className="scroll-mt-24"
                >
                  <SectionHeading>{category.label}</SectionHeading>
                  <PostGrid posts={category.posts} />
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Blogs;
