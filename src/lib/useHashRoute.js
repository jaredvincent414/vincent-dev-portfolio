import { useEffect, useState } from "react";

// The site is a single scrolling page whose nav uses plain anchors (#experience,
// #projects, ...). Post routes are namespaced under `#/` so the two never
// collide: `#/blogs/my-post` is a route, `#projects` is still just an anchor.
//
// Hash routing (rather than the History API) means deep links work on any static
// host with no rewrite rules to configure.
const readRoute = () => {
  const hash = window.location.hash;
  if (!hash.startsWith("#/")) return null;

  const parts = hash.slice(2).split("/").filter(Boolean);
  if (parts[0] === "blogs" && parts[1]) {
    return { name: "post", slug: decodeURIComponent(parts[1]) };
  }
  return null;
};

export const useHashRoute = () => {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  useEffect(() => {
    // A post page opens at the top, not wherever the reader had scrolled to.
    if (route?.name === "post") {
      window.scrollTo(0, 0);
      return;
    }

    // Leaving a post for an anchor (#blogs): the browser already tried to
    // scroll there and failed, because the lazy section had not mounted yet.
    // Retry for a few frames until the target exists.
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Two things fight us here. The section is lazy, so it may not exist yet;
    // and once it does, sections mounting *above* it keep shifting its offset.
    // So re-anchor on every DOM change until things settle.
    //
    // A MutationObserver rather than a rAF loop: it reacts to the actual event
    // (the section being inserted) instead of polling, and it keeps working in
    // a background tab, where rAF is throttled to roughly one frame a second.
    //
    // `instant` matters — the page sets `scroll-behavior: smooth`, and a smooth
    // scroll gets cancelled by those same layout shifts.
    const anchor = () => {
      const el = document.getElementById(id);
      if (!el) return false;
      el.scrollIntoView({ behavior: "instant", block: "start" });
      return true;
    };

    anchor();

    let settle;
    const observer = new MutationObserver(() => {
      anchor();
      // Re-anchor once more shortly after the DOM stops changing, so the last
      // word is ours rather than a late-mounting section's layout shift.
      clearTimeout(settle);
      settle = setTimeout(anchor, 150);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Stop chasing as soon as the reader scrolls themselves — never yank them
    // back — and in any case once the page has had time to settle.
    const stop = () => {
      observer.disconnect();
      clearTimeout(settle);
      clearTimeout(deadline);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", stop);
    };
    const deadline = setTimeout(stop, 2500);
    window.addEventListener("wheel", stop, { passive: true, once: true });
    window.addEventListener("touchmove", stop, { passive: true, once: true });
    window.addEventListener("keydown", stop, { once: true });

    return stop;
  }, [route]);

  return route;
};

export const postPath = (slug) => `#/blogs/${slug}`;
