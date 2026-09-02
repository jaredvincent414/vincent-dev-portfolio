// The hero's event stream: real activity, fetched and normalised at build time.
//
// GitHub is queried from Node, never the browser — the API is rate-limited per
// IP and a token must never reach the client bundle. The virtual module this
// feeds carries only the normalised events.
//
// Everything here degrades to silence. A failed fetch, a rate limit, or too
// little activity returns fewer events rather than throwing, because the hero
// is designed to look correct with no panel at all.

import { loadPosts } from "./blog/posts.mjs";

const GITHUB_USER = "jaredvincent414";
const MAX_EVENTS = 12;
// Below this the panel reads as a sparse afterthought, so it renders nothing.
const MIN_EVENTS = 4;
// One busy repository would otherwise fill the feed and say nothing about the
// range of the work.
const MAX_EVENTS_PER_REPO = 3;
const LOOKBACK_DAYS = 90;
// GitHub caps the public feed at 300 events / 90 days; three pages reaches it.
const EVENT_PAGES = 3;
const FETCH_TIMEOUT_MS = 5000;

const shortRepoName = (fullName) => fullName?.split("/").pop() ?? "unknown";
const branchOf = (ref) => ref?.replace(/^refs\/heads\//, "") ?? "";

// Walks the feed newest-first and merges runs of pushes that belong together.
//
// Grouped by repo + day + branch. The brief for this panel says repo + day, but
// the rendered detail is "N commits · <branch>" — a single branch — and this
// account pushes to a feature branch and its default branch on the same day.
// Including the branch is what keeps that label true.
const groupConsecutivePushes = (pushes) => {
  const groups = [];
  for (const push of pushes) {
    const previous = groups.at(-1);
    const sameRun =
      previous &&
      previous.repo === push.repo &&
      previous.branch === push.branch &&
      previous.day === push.day &&
      previous.actor === push.actor;

    if (sameRun) {
      // Newest-first, so the run's earliest push keeps moving backwards.
      previous.earliestBefore = push.before;
      previous.pushCount += 1;
    } else {
      groups.push({
        timestamp: push.timestamp,
        repo: push.repo,
        branch: push.branch,
        day: push.day,
        actor: push.actor,
        latestHead: push.head,
        earliestBefore: push.before,
        pushCount: 1,
      });
    }
  }
  return groups;
};

const capPerRepo = (groups) => {
  const used = new Map();
  const kept = [];
  for (const group of groups) {
    const count = used.get(group.repo) ?? 0;
    // Skip this repo's remainder and carry on with the others, so the feed
    // spreads across projects instead of stopping at the busiest one.
    if (count >= MAX_EVENTS_PER_REPO) continue;
    used.set(group.repo, count + 1);
    kept.push(group);
  }
  return kept;
};

const fetchPushGroups = async (request) => {
  const raw = [];
  for (let page = 1; page <= EVENT_PAGES; page++) {
    const response = await request(
      `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=100&page=${page}`
    );
    if (!response.ok) {
      if (page === 1) {
        throw new Error(`GitHub responded ${response.status} ${response.statusText}`);
      }
      break;
    }
    const events = await response.json();
    if (!Array.isArray(events) || events.length === 0) break;
    raw.push(...events);
    if (events.length < 100) break;
  }

  const cutoff = Date.now() - LOOKBACK_DAYS * 86400000;

  const pushes = raw
    .filter((event) => event.type === "PushEvent" && event.payload?.head)
    .filter((event) => new Date(event.created_at).getTime() >= cutoff)
    .map((event) => ({
      timestamp: event.created_at,
      day: event.created_at.slice(0, 10),
      repo: event.repo?.name ?? "",
      branch: branchOf(event.payload.ref),
      actor: event.actor?.login ?? "",
      head: event.payload.head,
      before: event.payload.before,
    }))
    // The feed is not strictly monotonic; sorting makes "consecutive" mean
    // consecutive in time rather than in whatever order GitHub returned.
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return capPerRepo(groupConsecutivePushes(pushes));
};

// Enrichment runs only on the groups that survived the cap, so the request
// count is bounded by what is displayed (at most MAX_EVENTS) rather than by how
// much the account has pushed. That keeps it affordable without a token.
const enrichGroups = async (groups, request) => {
  const defaultBranches = new Map();

  const defaultBranchFor = async (repo) => {
    if (defaultBranches.has(repo)) return defaultBranches.get(repo);
    let branch = null;
    try {
      const response = await request(`https://api.github.com/repos/${repo}`);
      if (response.ok) branch = (await response.json()).default_branch ?? null;
    } catch {
      // Falls back to the main/master heuristic in toEvent.
    }
    defaultBranches.set(repo, branch);
    return branch;
  };

  // Sequential: repos repeat across groups, and running in parallel would race
  // several lookups for the same repo before any of them populates the cache.
  for (const group of groups) {
    group.defaultBranch = await defaultBranchFor(group.repo);
  }

  await Promise.all(
    groups.map(async (group) => {
      // One request spans the whole run and returns both the commit count and
      // the messages, which two separate endpoints would not.
      try {
        const response = await request(
          `https://api.github.com/repos/${group.repo}/compare/` +
          `${group.earliestBefore}...${group.latestHead}`
        );
        if (!response.ok) return;
        const comparison = await response.json();
        if (Number.isInteger(comparison.total_commits)) {
          group.commitCount = comparison.total_commits;
        }
        // `commits` is oldest-first, so the run's newest commit is last.
        const newest = comparison.commits?.at(-1);
        const subject = newest?.commit?.message?.split("\n")[0].trim();
        if (subject) group.message = subject;
      } catch {
        // Keep the unenriched fallbacks. A missing subject is not worth a
        // failed build.
      }
    })
  );
};

const toEvent = (group) => {
  // Without the compare call we can only say that each push happened.
  const commitCount = group.commitCount ?? group.pushCount;

  // A repo whose default branch could not be read: main and master are the
  // overwhelmingly likely answers, and guessing wrong only costs a suffix.
  const isDefaultBranch = group.defaultBranch
    ? group.branch === group.defaultBranch
    : group.branch === "main" || group.branch === "master";

  const base = {
    timestamp: group.timestamp,
    target: shortRepoName(group.repo),
    status: group.latestHead.slice(0, 7),
  };

  if (commitCount > 1) {
    return { ...base, kind: "push", detail: `${commitCount} commits · ${group.branch}` };
  }

  // A lone commit shows its message; the branch is only worth the space when
  // work landed somewhere other than where it normally does.
  const message = group.message || group.branch;
  return {
    ...base,
    kind: "commit",
    detail: isDefaultBranch || !group.message ? message : `${message} · ${group.branch}`,
  };
};

const blogEvents = async (root) => {
  const posts = await loadPosts({ includeDrafts: false, root });
  return posts.map((post) => ({
    // Frontmatter dates carry no time; anchor them to UTC midnight so they sort
    // against GitHub's real timestamps without drifting a day either way.
    timestamp: `${post.date}T00:00:00Z`,
    kind: "post",
    target: post.category,
    detail: post.title,
  }));
};

const githubEvents = async (token) => {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    // GitHub rejects requests without one.
    "User-Agent": `${GITHUB_USER}-portfolio-build`,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const request = (url) =>
    fetch(url, { headers, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });

  const groups = (await fetchPushGroups(request)).slice(0, MAX_EVENTS);
  await enrichGroups(groups, request);
  return groups.map(toEvent);
};

/**
 * @param {object} options
 * @param {string} [options.token]  GITHUB_TOKEN, if the environment has one.
 * @param {string} [options.root]   Repo root, for reading content/blog.
 */
export const loadHeroEvents = async ({ token, root = process.cwd() } = {}) => {
  // Each source fails on its own. Losing GitHub should not cost us the posts.
  const [commits, posts] = await Promise.all([
    githubEvents(token).catch((error) => {
      console.warn(`hero-events: GitHub unavailable — ${error.message}`);
      return [];
    }),
    blogEvents(root).catch((error) => {
      console.warn(`hero-events: posts unavailable — ${error.message}`);
      return [];
    }),
  ]);

  const events = [...commits, ...posts]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, MAX_EVENTS);

  // A handful of rows reads as an unfinished widget rather than a signal.
  return events.length >= MIN_EVENTS ? events : [];
};
