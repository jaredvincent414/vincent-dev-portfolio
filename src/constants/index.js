const navLinks = [
  { name: "Experience",   link: "#experience" },
  { name: "Skills",       link: "#skills" },
  { name: "Organisations",link: "#organisations" },
  { name: "Contact",      link: "#contact" },
];

const words = [
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
];
const counterItems = [
  { value: 15, suffix: "+", label: "Projects Built" },
  { value: 8, suffix: "+", label: "Programming Languages & Tools" },
  { value: 5, suffix: "+", label: "Hackathons & Internships" },
  { value: 3, suffix: "+", label: "Open Source Contributions" },
];

const logoIconsList = [
  {
    imgPath: "/images/logos/company-logo-1.png",
  },
  {
    imgPath: "/images/logos/company-logo-2.png",
  },
  {
    imgPath: "/images/logos/company-logo-3.png",
  },
  {
    imgPath: "/images/logos/company-logo-4.png",
  },
  {
    imgPath: "/images/logos/company-logo-5.png",
  },
  {
    imgPath: "/images/logos/company-logo-6.png",
  },
  {
    imgPath: "/images/logos/company-logo-7.png",
  },
  {
    imgPath: "/images/logos/company-logo-8.png",
  },
  {
    imgPath: "/images/logos/company-logo-9.png",
  },
  {
    imgPath: "/images/logos/company-logo-10.png",
  },
  {
    imgPath: "/images/logos/company-logo-11.png",
  },
];

const abilities = [
  {
    imgPath: "/images/seo.png",
    title: "Quality Focus",
    desc: "Delivering high-quality results while maintaining attention to every detail.",
  },
  {
    imgPath: "/images/chat.png",
    title: "Reliable Communication",
    desc: "Keeping you updated at every step to ensure transparency and clarity.",
  },
  {
    imgPath: "/images/time.png",
    title: "On-Time Delivery",
    desc: "Making sure projects are completed on schedule, with quality & attention to detail.",
  },
];


const techStackIcons = [
  {
    name: "JavaScript",
    modelPath: "/models/react_logo-transformed.glb",
    scale: 1,
    rotation: [0, 0, 0],
  },
  {
    name: "Python",
    modelPath: "/models/python-transformed.glb",
    scale: 0.8,
    rotation: [0, 0, 0],
  },

  {
    name: "Interactive Developer",
    modelPath: "/models/three.js-transformed.glb",
    scale: 0.05,
    rotation: [0, 0, 0],
  },
  {
    name: "Project Manager",
    modelPath: "/models/git-svg-transformed.glb",
    scale: 0.05,
    rotation: [0, -Math.PI / 4, 0],
  },
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
];

const organisations = [
  { name: "ColorStack",               initials: "CS", color: "#6366f1", logoPath: "/images/orgs/colorstack.png" },
  { name: "CodePath",                 initials: "CP", color: "#10b981", logoPath: "/images/orgs/codepath.png" },
  { name: "Blacks In Technology",     initials: "BT", color: "#8b5cf6", logoPath: "/images/orgs/bit.png" },
  { name: "NSBE",                     initials: "NS", color: "#f59e0b", logoPath: "/images/orgs/nsbe.png" },
  { name: "KenSAP",                   initials: "KS", color: "#3b82f6", logoPath: "/images/orgs/kensap.png" },
  { name: "Education For All Children", initials: "EA", color: "#ec4899", logoPath: "/images/orgs/efac.png" },
  { name: "Tamid",                    initials: "TM", color: "#14b8a6", logoPath: "/images/orgs/tamid.png" },
];

const expLogos = [
  {
    name: "brandapp",
    imgPath: "/images/brandapp.png",
  },
  {
    name: "codekenya",
    imgPath: "/images/codekenya.png",
  },
  {
    name: "its",
    imgPath: "/images/its.png",
  },
];

const testimonials = [
  {
    name: "Esther Howard",
    mentions: "@estherhoward",
    review:
      "I can’t say enough good things about Adrian. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.",
    imgPath: "/images/client1.png",
  },
  {
    name: "Wade Warren",
    mentions: "@wadewarren",
    review:
      "Working with Adrian was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.",
    imgPath: "/images/client3.png",
  },
  {
    name: "Guy Hawkins",
    mentions: "@guyhawkins",
    review:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    imgPath: "/images/client2.png",
  },
  {
    name: "Marvin McKinney",
    mentions: "@marvinmckinney",
    review:
      "Adrian was a pleasure to work with. He turned our outdated website into a fresh, intuitive platform that’s both modern and easy to navigate. Fantastic work overall.",
    imgPath: "/images/client5.png",
  },
  {
    name: "Floyd Miles",
    mentions: "@floydmiles",
    review:
      "Adrian’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional!",
    imgPath: "/images/client4.png",
  },
  {
    name: "Albert Flores",
    mentions: "@albertflores",
    review:
      "Adrian was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend and backend dev are top-notch.",
    imgPath: "/images/client6.png",
  },
];

const socialImgs = [
  {
    name: "insta",
    imgPath: "/images/insta.png",
  },
  {
    name: "fb",
    imgPath: "/images/fb.png",
  },
  {
    name: "x",
    imgPath: "/images/x.png",
  },
  {
    name: "linkedin",
    imgPath: "/images/linkedin.png",
  },
];

export {
  words,
  abilities,
  logoIconsList,
  counterItems,
  expCards,
  expLogos,
  organisations,
  testimonials,
  socialImgs,
  techStackIcons,
  navLinks,
};
