# Vincent Jared — Developer Portfolio

A personal developer portfolio built with React 19, Three.js, and Tailwind CSS v4. Features an interactive 3D background mesh, animated skill cards, a galaxy starfield, and a smooth scroll-driven layout.

---

## Live Sections

| Section | Description |
|---|---|
| **Hero** | Animated role cards (Software Engineering, ML/Data Science, DevOps, IT Assistant) with a live 3D room model |
| **Experience** | Vertical timeline with company logos, role descriptions, and dates |
| **Skills** | Categorised skill cards with animated progress bars and percentage counters |
| **Organisations** | 3D rotating logo showcase (React Three Fiber) for clubs and communities |
| **Contact** | Social links (LinkedIn, GitHub) and resume download |

---

## Tech Stack

| Category | Libraries / Tools |
|---|---|
| Framework | React 19 + Vite 7 |
| 3D / WebGL | Three.js, `@react-three/fiber`, `@react-three/drei` |
| Animation | GSAP 3 + ScrollTrigger, `@gsap/react` |
| Styling | Tailwind CSS v4, Space Grotesk (Google Fonts) |
| Canvas FX | HTML5 Canvas 2D API (galaxy starfield + shooting stars) |
| Build | Vite, ESLint |

---

## Project Structure

```
src/
├── App.jsx                        # Root layout, lazy section loading, galaxy zone
├── main.jsx
├── index.css                      # Global styles, font import, base theme
│
├── constants/
│   └── index.js                   # All content data (nav, experience, skills, orgs)
│
├── sections/
│   ├── Hero.jsx                   # Hero with role cards and 3D model
│   ├── Experience.jsx             # Timeline layout with company logos
│   ├── TechStack.jsx              # Skill category cards with GSAP animations
│   ├── Organisations.jsx          # Three.js rotating org logo boxes
│   ├── Contact.jsx                # Links + resume download
│   └── Footer.jsx
│
└── components/
    ├── BackgroundWeb.jsx          # Interactive Three.js node mesh background
    ├── GalaxyLayer.jsx            # Canvas starfield with twinkling + shooting stars
    ├── NavBar.jsx
    ├── TitleHeader.jsx
    ├── GlowCard.jsx
    ├── Button.jsx
    └── models/
        ├── hero_models/           # HeroExperience, Room, HeroLights, Particles
        ├── tech_logos/            # TechIconCardExperience
        └── contact/               # Computer model

public/
├── images/
│   ├── orgs/                      # Organisation logos (ColorStack, NSBE, etc.)
│   ├── textures/                  # 3D model textures
│   ├── Tuterra.png, Brandeis.png  # Experience company logos
│   └── ...                        # Section icons, social images
└── models/                        # GLTF/GLB 3D models
```

---

## Key Features

### Interactive Background Mesh
- Built with Three.js inside a React Three Fiber canvas
- Nodes connect with edges when within proximity
- **Cursor interaction** — nodes within radius are pushed by mouse movement
- **Scroll speed boost** — scrolling accelerates node drift, decays naturally
- **Node repulsion** — nodes push apart to prevent entangling

### Galaxy Starfield
- Canvas 2D API rendering 280 violet-tinted stars with drift, twinkling, and radial glow
- 4 shooting stars with gradient tails that reset on exit
- Nebula colour blobs via CSS radial gradients
- Active from the Organisations section downward

### Skill Cards (TechStack)
- 6 categories with per-category accent colours and emoji icons
- Progress bars animate from 0 → target on scroll entry (GSAP `scaleX`)
- Percentage counters count up from 0 simultaneously
- Hover glow, corner radial gradient, card entrance stagger

### Experience Timeline
- 3px gradient vertical divider
- 56px circular nodes displaying company logos
- Cards alternate sides with arrow connectors
- Dates shown on the opposite side from the card

### Organisations (3D)
- React Three Fiber scene with rotating boxes per organisation
- `MeshBasicMaterial` preserves true logo colours (unaffected by scene lighting)
- Click to expand detail, scroll-linked camera

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## Customisation

All content is centralised in [`src/constants/index.js`](src/constants/index.js):

- **`navLinks`** — navigation items and section anchors
- **`expCards`** — experience entries (title, company, date, responsibilities, logo)
- **`organisations`** — org names, colours, and logo paths
- **`counterItems`** — hero stats (projects, languages, hackathons, contributions)

Skill data lives directly in [`src/sections/TechStack.jsx`](src/sections/TechStack.jsx) in the `skillCategories` array.

---

## Resume

Place your resume PDF at `public/resume.pdf`. The Download Resume button in the Contact section links to `/resume.pdf`.

---

## Author

**Vincent Jared**
- GitHub: [github.com/jaredvincent414](https://github.com/jaredvincent414)
- LinkedIn: [linkedin.com/in/vincent-jared-1b5954265](https://www.linkedin.com/in/vincent-jared-1b5954265/)
