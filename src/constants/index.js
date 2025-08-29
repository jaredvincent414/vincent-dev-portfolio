const navLinks = [
  {
    name: "About",
    link: "#about",
  },
  {
    name: "Experience",
    link: "#experience",
  },
  {
    name: "Skills",
    link: "#skills",
  },
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
    logoPath: "/images/codekenya.png",
    title: "Software Engineering Intern",
    date: "May - August 2025",
    responsibilities: [
      "Architected and deployed a fullstack portfolio website featuring an Agentic AI assistant capable of answering detailed questions about my professional experience.",
      "Engineered a conversational AI agent using the Vercel AI SDK. Added tools to read google doc files ensuring factual context aware responses.",
      "Developed a performant, server rendered frontend with Next.js, React, and JavaScript, styled with Tailwind CSS for a fully responsive user interface.",
      "Integrated a PostgreSQL database via Supabase and Neon to manage project content and user interaction.",
      "Managed the complete project lifecycle using professional Git workflows for version control and collaborative development.",
    ],
  },
  {
    logoPath: "/images/brandapp.png",
    title: "Software Engineer",
    date: "April 2025 - Present",
    responsibilities: [
      "Elevated student experience for 6000+ users by spearheading the creation of user-friendly interfaces for the Branda app from scratch, utilizing Swift & Restful API to enhance campus shuttle tracking, dining hour updates, interactive calendars, mapping services, & news feed integration",
      "Increased user engagement by 50% by driving team collaboration using Agile methodology with Git and Figma, steering the creation of an intuitive application."
    ],
  },
  {
    logoPath: "/images/its.png",
    title: "IT Support",
    date: "January 2025 - Present",
    responsibilities: [
      "Resolved 50+ daily hardware, software, and network issues for 300+ users, applying knowledge of Unix/Linux system administration and TCP/IP networking to troubleshoot efficiently.",
      "Deployed and maintained Windows/MacOS systems, printers, and classroom tech devices, improving system uptime by over 20%."
    ],
  },
  {
    logoPath: "/images/spaceyatech.png",
    title: "Backend Developer",
    date: "April 2025 - August 2025",
    responsibilities: [
      "Designed and implemented RESTful APIs with Django and Django REST Framework (DRF) to power mobile and web clients.",
      "Modeled relational data with PostgreSQL, wrote optimized queries, and added migrations for new features.",
      "Implemented authentication and authorization (JWT/session), request validation, and robust error handling.",
      "Wrote unit/integration tests with pytest to improve reliability and prevent regressions.",
      "Containerized services with Docker and documented API endpoints using OpenAPI/Swagger.",
    ],
  },
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
  testimonials,
  socialImgs,
  techStackIcons,
  navLinks,
};
