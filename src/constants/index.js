const navLinks = [
  { name: "Experience",    link: "#experience" },
  { name: "Projects",      link: "#projects" },
  { name: "Blogs",         link: "#blogs" },
  { name: "Skills",        link: "#skills" },
  { name: "Contact",       link: "#contact" },
];

const expCards = [
  {
    logoPath: "/images/efac.png",
    title: "Software Engineer Intern",
    company: "Education For All Children (EFAC)",
    date: "May 2026 – Aug 2026",
    responsibilities: [
      "Built an alumni-to-job recommendation service on PostgreSQL with pgvector embedding retrieval and LLM re-ranking across 200+ profiles, raising staff-validated match relevance 55% over the prior keyword baseline.",
      "Automated career-profile creation for 200+ alumni with a document-parsing pipeline (PyMuPDF + LLM extraction) emitting schema-validated, strongly-typed JSON, replacing 25 hours of manual data entry.",
      "Held projected inference cost under $50/month through model tiering and response caching.",
    ],
  },
  {
    logoPath: "/images/Tuterra.png",
    title: "Backend Engineer Intern",
    company: "Tutterra (TAMID Tech)",
    date: "Jan 2026 – May 2026",
    responsibilities: [
      "Held p95 room-state update latency under 10ms across 500+ concurrent sessions using Redis Pub/Sub broadcasting in an event-driven architecture.",
      "Cut content-detection latency 38% by re-architecting analysis into event-driven ASP.NET Core microservices containerized with Docker and deployed on AWS Lambda (C#, Rust, Python).",
      "Built a Rust state-synchronization engine using structural diffing, cutting sync payloads 83% (12KB to under 2KB) and keeping sessions stable on degraded networks.",
    ],
  },
  {
    logoPath: "/images/brandapp.png",
    title: "Lead Backend Developer",
    company: "Branda",
    date: "Apr 2025 – Present",
    responsibilities: [
      "Own backend infrastructure in Node.js and MongoDB for a campus app with 7,000+ downloads; lead a 6-developer team through sprint planning and code review.",
      "Added automated API contract tests to the CI/CD pipeline, cutting manual pre-release QA from 2 to 0.5 hours per deploy.",
      "Improved laundry-availability accuracy 40% by redesigning the machine-state polling model and the REST APIs behind a Kotlin Android client.",
    ],
  },
  {
    logoPath: "/images/Brandeis.png",
    title: "Student IT Manager",
    company: "Brandeis ITS",
    date: "Jan 2024 – Present",
    responsibilities: [
      "Auto-resolved 60% of routine support calls across 1,000+ monthly tickets by co-building a voice agent with Zoom APIs, OpenAI, Node.js, and TeamDynamix.",
      "Directed daily support operations for a 24-person student technician team, triaging and escalating live incidents each semester.",
      "Cut new-technician ramp-up from 4 to 2 weeks by designing and leading 2 technical training sessions per semester.",
    ],
  },
];

const projects = [
  {
    title: "Event-Sourced Financial Compliance Engine",
    description:
      "An event-sourced ledger that recomputes compliance state from an immutable event log with periodic snapshotting, surfaced through a React/TypeScript operator dashboard. Instrumented with Prometheus and Grafana against a p99 latency SLO; crash recovery verified with kill -9 mid-recompute.",
    image: null,
    tags: ["Rust", "PostgreSQL", "Event Sourcing"],
    liveUrl: null,
    repoUrl: null,
  },
  {
    title: "Grindarr",
    description:
      "A code-execution tracer — Chrome MV3 extension plus a Go HTTP service — that isolates per-language tracing subprocesses in sandboxes and manages process lifecycle across concurrent runs. Captures per-line variable state via a Python sys.settrace tracer, with Claude API structured output under JSON-schema validation.",
    image: null,
    tags: ["Go", "Python", "Chrome MV3"],
    liveUrl: null,
    repoUrl: null,
  },
  {
    title: "Branda",
    description:
      "A campus mobile platform with 7,000+ downloads. I own the Node.js and MongoDB backend and lead a 6-developer team through sprint planning and code review, with automated API contract tests gating every release.",
    image: "/images/brandapp.png",
    tags: ["Node.js", "MongoDB", "CI/CD"],
    liveUrl: "https://apps.apple.com/us/app/branda/id1437022581",
    repoUrl: "https://github.com/jaredvincent414",
  },
  {
    title: "The Conspectus",
    description:
      "A collaborative study and note-sharing platform used by 800+ users, built with TypeScript, Node.js, and Express. Rewrote slow request flows into smaller services, and secured accounts with JWT auth and role-based access.",
    image: "/projects/theconspectus.png",
    tags: ["TypeScript", "Express", "PostgreSQL"],
    liveUrl: "https://theconspectus.com/",
    repoUrl: null,
  },
  {
    title: "Campus Marketplace",
    description:
      "A student marketplace for buying, selling, and trading on campus, built with React Native and Express. Real-time chat over Socket.IO keeps conversations in sync, and indexed MongoDB queries with pagination cut listing load time 40%.",
    image: "/projects/campus-marketplace.png",
    tags: ["React Native", "Socket.IO", "MongoDB"],
    liveUrl: null,
    repoUrl: "https://github.com/jaredvincent414/Campus-Marketplace",
  },
  {
    title: "Developer Portfolio",
    description:
      "This site — React 19, Tailwind CSS v4, and GSAP scroll animations, with a markdown blog compiled straight from files in the repo. Deliberately rebuilt away from a heavier 3D version toward something that loads fast and reads well.",
    image: "/projects/portfolio.png",
    tags: ["React", "Tailwind", "GSAP"],
    liveUrl: "https://vincentjared.com/",
    repoUrl: "https://github.com/jaredvincent414/vincent-dev-portfolio",
  },
];

export { navLinks, expCards, projects };
