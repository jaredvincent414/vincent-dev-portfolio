import { useEffect, useState } from "react";

// Real paths rather than hash fragments: `/blogs/<slug>`. Each of those is a
// prerendered HTML file with its own <head>, which is what makes canonical
// URLs, Open Graph tags, and the sitemap actually work — a `#` fragment never
// reaches the server, so every post would otherwise look like one URL to a
// crawler.
//
// The homepage keeps ordinary fragment anchors (#experience, #projects). Those
// are not routes and are left to the browser, except for the re-anchoring below.

export const postPath = (slug) => `/blogs/${slug}`;

const readRoute = () => {
  const match = window.location.pathname.match(/^\/blogs\/([^/]+)\/?$/);
  return match
    ? { name: "post", slug: decodeURIComponent(match[1]) }
    : { name: "home" };
};

// `to` may carry a fragment (`/#blogs`); the route reads the pathname and the
// scroll effect below reads the hash, so both need to be pushed together.
export const navigate = (to) => {
  if (to === window.location.pathname + window.location.hash) return;
  window.history.pushState(null, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

export const useRoute = () => {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onPopState = () => setRoute(readRoute());
    window.addEventListener("popstate", onPopState);

    // Intercept in-app links so navigation stays client-side. Without this each
    // post click would be a full document load; the prerendered page would
    // still be correct, just slower. Anything modified, targeted, or
    // cross-origin is left to the browser.
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = event.target.closest?.("a");
      if (!link || link.target || link.hasAttribute("download")) return;
      if (link.origin !== window.location.origin) return;

      // A fragment on the page we are already on — a heading anchor, say. This
      // is not a route change, and letting it fall through to the browser is
      // unreliable: `scroll-behavior: smooth` plus lazily-mounting sections
      // cancels the native jump partway. Scroll it instantly instead.
      if (link.pathname === window.location.pathname && link.hash) {
        const target = document.getElementById(link.hash.slice(1));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "instant", block: "start" });
        window.history.replaceState(null, "", link.pathname + link.hash);
        return;
      }

      if (!/^\/blogs\/|^\/$/.test(link.pathname)) return;

      event.preventDefault();
      navigate(link.pathname + link.hash);
    };

    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    // A post page opens at the top, not wherever the reader had scrolled to.
    if (route.name === "post") {
      window.scrollTo(0, 0);
      return;
    }

    const id = window.location.hash.slice(1);
    if (!id) return;

    // Two things fight us here. Sections are lazy, so the target may not exist
    // yet; and once it does, sections mounting above keep shifting its offset.
    // So re-anchor on every DOM change until things settle.
    //
    // A MutationObserver rather than a rAF loop: it reacts to the section being
    // inserted instead of polling, and keeps working in a background tab, where
    // rAF is throttled to roughly one frame a second.
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
