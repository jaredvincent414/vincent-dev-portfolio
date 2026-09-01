import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { publishedPosts, categories, postsIn, latestPosts } from "../lib/posts";
import { postPath } from "../lib/useHashRoute";

gsap.registerPlugin(ScrollTrigger);

// The blog's own name, the way the HRT Beat is a masthead rather than the word
// "Blog". Change this string and the masthead changes with it.
const BLOG_NAME = "The Backline";

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const anchorFor = (category) =>
  `blog-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

// The page sets `scroll-behavior: smooth`, so a native fragment jump animates
// its way down. `useHashRoute` documents why that is unreliable here: sections
// mount lazily above the target and the resulting layout shifts cancel a smooth
// scroll partway. Jumping instantly is deterministic regardless of what is still
// mounting, and replaceState keeps the URL honest without provoking a second
// (animated, cancellable) jump.
const jumpToCategory = (event, id) => {
  const el = document.getElementById(id);
  if (!el) return;
  event.preventDefault();
  el.scrollIntoView({ behavior: "instant", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
};

// HRT gives every card a thumbnail. When a post declares no `cover`, this fills
// the slot rather than leaving a ragged grid: a blaugrana wash, labelled with
// the category. Inside a category section that label would only repeat the
// heading above it, so `label` is dropped there and the tile runs plain.
const CoverFallback = ({ label }) => (
  <div
    className="w-full h-full flex items-end p-4 bg-gradient-to-br
               from-grana-500/25 via-[#0d0d2b] to-[#0d0d2b]"
    aria-hidden="true"
  >
    {label && (
      <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/50">
        {label}
      </span>
    )}
  </div>
);

// Title over a byline in small caps — HRT's card, with the author slot given to
// date and reading time, since a single-author blog repeats its own name on
// every card otherwise.
const PostCard = ({ post, showCategory = true }) => (
  <a
    href={postPath(post.slug)}
    className="blog-card group flex flex-col rounded-lg overflow-hidden
               border border-white/[0.10] bg-white/[0.02]
               transition-colors duration-300 hover:border-grana-500/45"
  >
    <div className="aspect-[16/9] w-full overflow-hidden border-b border-white/[0.10]">
      {post.cover ? (
        <img
          src={post.cover}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500
                     group-hover:scale-[1.03]"
        />
      ) : (
        <CoverFallback label={showCategory ? post.categories[0] : ""} />
      )}
    </div>

    <div className="flex flex-col flex-1 p-5">
      <h3
        className="font-mono text-white text-base md:text-lg leading-snug mb-3
                   transition-colors duration-300 group-hover:text-grana-300"
      >
        {post.title}
      </h3>

      <p className="mt-auto font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">
        {formatDate(post.date)} · {post.readingTime} min read
      </p>
    </div>
  </a>
);

const PostGrid = ({ posts, showCategory = true }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {posts.map((post) => (
      <PostCard key={post.slug} post={post} showCategory={showCategory} />
    ))}
  </div>
);

const CategorySection = ({ category }) => {
  const posts = postsIn(category);
  if (posts.length === 0) return null;

  return (
    <section id={anchorFor(category)} className="scroll-mt-24">
      <h3 className="font-mono text-white/85 text-sm tracking-[0.22em] uppercase mb-6
                     pb-3 border-b border-white/[0.08]">
        {category}
      </h3>
      <PostGrid posts={posts} showCategory={false} />
    </section>
  );
};

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

        {publishedPosts.length === 0 ? (
          <p className="font-mono text-sm text-white/65 mt-8">
            Nothing published yet — add a markdown file to <code>src/posts/</code>.
          </p>
        ) : (
          <>
            {/* Category nav. Plain in-page anchors, so it degrades to a list of
                links with JavaScript off and needs no router state. */}
            <nav className="flex flex-wrap gap-x-6 gap-y-2 pb-8 mb-12
                            border-b border-white/[0.08]">
              {categories.map((category) => (
                <a
                  key={category}
                  href={`#${anchorFor(category)}`}
                  onClick={(e) => jumpToCategory(e, anchorFor(category))}
                  className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/55
                             hover:text-grana-300 transition-colors duration-200"
                >
                  {category}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-16">
              {/* Latest repeats posts that also appear under their categories
                  below — the same overlap the HRT Beat has. */}
              <section>
                <h3 className="font-mono text-white/85 text-sm tracking-[0.22em] uppercase mb-6
                               pb-3 border-b border-white/[0.08]">
                  Latest
                </h3>
                <PostGrid posts={latestPosts} />
              </section>

              {categories.map((category) => (
                <CategorySection key={category} category={category} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Blogs;
