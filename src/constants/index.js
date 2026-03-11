const navLinks = [
  { name: "Experience",    link: "#experience" },
  { name: "Projects",      link: "#projects" },
  { name: "Skills",        link: "#skills" },
  { name: "Organisations", link: "#organisations" },
  { name: "Contact",       link: "#contact" },
];

const expCards = [
  {
    logoPath: "/images/Tuterra.png",
    title: "Software Engineer Intern",
    company: "Tuterra",
    date: "Jan 2026 – Present",
    responsibilities: [
      "Engineered scalable ML and LLM data pipelines processing 10,000+ datasets, increasing throughput by 30%.",
      "Increased multimedia processing throughput by 45% by implementing asynchronous Rust services using non-blocking I/O and multithreaded execution to handle 1,000+ concurrent audio and video moderation streams.",
      "Reduced harmful content detection latency by 38% by designing event-driven moderation pipelines with parallel task execution and fault-isolated microservice boundaries on Linux-based infrastructure.",
      "Improved system reliability to 99.9% uptime by decomposing monolithic workflows into stateless, horizontally scalable services with retry logic and observability-driven debugging.",
    ],
  },
  {
    logoPath: "/images/brandapp.png",
    title: "Mobile Software Engineer",
    company: "Branda",
    date: "Apr 2025 – Present",
    responsibilities: [
      "Built and maintained backend microservices using TypeScript and Node.js, serving 800+ users.",
      "Scaled a production campus mobile platform to 10,000+ users by leading 6 engineers with structured Agile sprint cycles and deterministic CI/CD release workflows.",
      "Reduced application load time and memory footprint by 18% by profiling SwiftUI rendering performance and eliminating redundant state recomputation across navigation layers.",
      "Reduced API response latency by 41% by refactoring networking layers to use asynchronous request handling and structured concurrency.",
    ],
  },
  {
    logoPath: "/images/Brandeis.png",
    title: "Undergraduate ML Research Assistant",
    company: "Brandeis University",
    date: "Nov 2025 – Present",
    responsibilities: [
      "Increased ML experiment throughput by 30% by engineering distributed preprocessing pipelines over 10,000+ datasets using parallelized batch execution across Linux-based compute environments.",
      "Reduced prototype-to-production deployment time by 25% by converting research models into modular backend services with standardized API contracts and containerized deployment.",
      "Improved long-context LLM consistency by 20% by implementing deterministic memory handling and structured context window management mechanisms.",
    ],
  },
  {
    logoPath: "/images/Brandeis.png",
    title: "Student Technology Assistant",
    company: "Brandeis University",
    date: "Jan 2024 – Present",
    responsibilities: [
      "Resolved 50+ support cases per day across hardware, software, networking, and authentication for 300+ users using systematic debugging and root-cause analysis.",
      "Diagnosed Windows, macOS, and Linux issues including VPN, DNS, TCP/IP, printing, and A/V systems, improving reliability and reducing repeat incidents.",
    ],
  },
];

const organisations = [
  { name: "ColorStack",                initials: "CS", color: "#6366f1", logoPath: "/images/orgs/colorstack.png" },
  { name: "CodePath",                  initials: "CP", color: "#10b981", logoPath: "/images/orgs/codepath.png" },
  { name: "Blacks In Technology",      initials: "BT", color: "#8b5cf6", logoPath: "/images/orgs/bit.png" },
  { name: "NSBE",                      initials: "NS", color: "#f59e0b", logoPath: "/images/orgs/nsbe.png" },
  { name: "KenSAP",                    initials: "KS", color: "#3b82f6", logoPath: "/images/orgs/kensap.png" },
  { name: "Education For All Children",initials: "EA", color: "#ec4899", logoPath: "/images/orgs/efac.png" },
  { name: "Tamid",                     initials: "TM", color: "#14b8a6", logoPath: "/images/orgs/tamid.png" },
];

const projects = [
  {
    title: "The Conspectus",
    description:
      "A digital publication platform for long-form journalism and editorial content. Built and deployed as a full production web application.",
    image: "/projects/theconspectus.png",
    gradient: null,
    tags: ["Web", "Full Stack"],
    liveUrl: "https://theconspectus.com/",
    repoUrl: null,
  },
  {
    title: "Digital Tools & Health Outcomes",
    description:
      "A Tableau data analysis exploring how differences in broadband access and telehealth adoption across U.S. states correlate with health outcomes such as life expectancy and mortality rates.",
    image: "/projects/Techaccess_healthoutcome.png",
    gradient: null,
    tags: ["Tableau", "Data Analysis", "Public Health"],
    liveUrl: "https://public.tableau.com/shared/6ZKCQGNWK?:display_count=n&:origin=viz_share_link",
    repoUrl: null,
  },
  {
    title: "Swiftdine",
    description:
      "An iOS food discovery and ordering app built with SwiftUI. Features real-time menu browsing, location-based restaurant search, and a smooth checkout flow with async networking.",
    image: "/images/Swiftdine.png",
    tags: ["SwiftUI", "iOS", "Swift"],
    liveUrl: null,
    repoUrl: "https://github.com/jaredvincent414/swiftdine",
  },
  {
    title: "Branda",
    description:
      "A campus mobile platform scaled to 10,000+ users. Built with TypeScript, Node.js microservices, and SwiftUI. Led 6 engineers using Agile sprints and CI/CD release workflows.",
    image: "/images/brandapp.png",
    tags: ["TypeScript", "Node.js", "SwiftUI"],
    liveUrl: "https://apps.apple.com/us/app/branda/id1437022581",
    repoUrl: "https://github.com/jaredvincent414",
  },
  {
    title: "Developer Portfolio",
    description:
      "This portfolio — built with React 19, Three.js, and Tailwind CSS v4. Features an interactive 3D background mesh with cursor and scroll physics, a galaxy starfield, and GSAP scroll animations.",
    image: null,
    gradient: "linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #1a0533 100%)",
    tags: ["React", "Three.js", "GSAP"],
    liveUrl: null,
    repoUrl: "https://github.com/jaredvincent414",
  },
];

export { navLinks, expCards, organisations, projects };
