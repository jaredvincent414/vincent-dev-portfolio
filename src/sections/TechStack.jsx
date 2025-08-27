import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import TitleHeader from "../components/TitleHeader";
import TechIconCardExperience from "../components/models/tech_logos/TechIconCardExperience";
import { techStackIcons } from "../constants";
// import { techStackImgs } from "../constants";

const TechStack = () => {
  // Animate the tech cards in the skills section
  useGSAP(() => {
    // This animation is triggered when the user scrolls to the #skills wrapper
    // The animation starts when the top of the wrapper is at the center of the screen
    // The animation is staggered, meaning each card will animate in sequence
    // The animation ease is set to "power2.inOut", which is a slow-in fast-out ease
    gsap.fromTo(
      ".tech-card",
      {
        // Initial values
        y: 50, // Move the cards down by 50px
        opacity: 0, // Set the opacity to 0
      },
      {
        // Final values
        y: 0, // Move the cards back to the top
        opacity: 1, // Set the opacity to 1
        duration: 1, // Duration of the animation
        ease: "power2.inOut", // Ease of the animation
        stagger: 0.2, // Stagger the animation by 0.2 seconds
        scrollTrigger: {
          trigger: "#skills", // Trigger the animation when the user scrolls to the #skills wrapper
          start: "top center", // Start the animation when the top of the wrapper is at the center of the screen
        },
      }
    );
  });

  return (
    <div id="skills" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">

        <div className="tech-grid">
          {/* Loop through the techStackIcons array and create a component for each item. 
              The key is set to the name of the tech stack icon, and the classnames are set to 
              card-border, tech-card, overflow-hidden, and group. The xl:rounded-full and rounded-lg 
              classes are only applied on larger screens. */}
          {techStackIcons.map((techStackIcon) => (
            <div
              key={techStackIcon.name}
              className="card-border tech-card overflow-hidden group xl:rounded-full rounded-lg"
            >
              {/* The tech-card-animated-bg div is used to create a background animation when the 
                  component is hovered. */}
              <div className="tech-card-animated-bg" />
              <div className="tech-card-content">
                {/* The tech-icon-wrapper div contains the TechIconCardExperience component, 
                    which renders the 3D model of the tech stack icon. */}
                <div className="tech-icon-wrapper">
                  <TechIconCardExperience model={techStackIcon} />
                </div>
                {/* The padding-x and w-full classes are used to add horizontal padding to the 
                    text and make it take up the full width of the component. */}
                <div className="padding-x w-full">
                  {/* The p tag contains the name of the tech stack icon. */}
                  <p>{techStackIcon.name}</p>
                </div>
              </div>
            </div>
          ))}

          {/* This is for the img part */}
          {/* {techStackImgs.map((techStackIcon, index) => (
            <div
              key={index}
              className="card-border tech-card overflow-hidden group xl:rounded-full rounded-lg"
            >
              <div className="tech-card-animated-bg" />
              <div className="tech-card-content">
                <div className="tech-icon-wrapper">
                  <img src={techStackIcon.imgPath} alt="" />
                </div>
                <div className="padding-x w-full">
                  <p>{techStackIcon.name}</p>
                </div>
              </div>
            </div>
          ))} */}
        </div>

        {/* Scrolling logos marquee (left to right) */}
        <div className="mt-16">
          <div className="overflow-hidden relative">
            <div className="marquee-track flex items-center gap-10 will-change-transform">
              {[
                { name: "Git", src: "https://cdn.simpleicons.org/git" },
                { name: "Postman", src: "https://cdn.simpleicons.org/postman" },
                { name: "PostgreSQL", src: "https://cdn.simpleicons.org/postgresql" },
                { name: "MySQL", src: "https://cdn.simpleicons.org/mysql" },
                { name: "Figma", src: "https://cdn.simpleicons.org/figma" },
                { name: "Node.js", src: "https://cdn.simpleicons.org/nodedotjs" },
                { name: "Next.js", src: "https://cdn.simpleicons.org/nextdotjs" },
                { name: "Express", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
                { name: "Django", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
                { name: "Three.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg" },
                { name: "Email", src: "https://cdn.simpleicons.org/gmail/EA4335" },
                { name: "Tailwind CSS", src: "https://cdn.simpleicons.org/tailwindcss" },
                { name: "Flutter", src: "https://cdn.simpleicons.org/flutter" },
                { name: "HTML", src: "https://cdn.simpleicons.org/html5" },
                { name: "CSS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
                { name: "NumPy", src: "https://cdn.simpleicons.org/numpy" },
                { name: "MongoDB", src: "https://cdn.simpleicons.org/mongodb" },
                { name: "Docker", src: "https://cdn.simpleicons.org/docker" },
                { name: "JUnit", src: "https://cdn.simpleicons.org/junit5" },
                { name: "AWS", src: "https://cdn.simpleicons.org/amazonaws/FF9900" },
                { name: "Microsoft Azure", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
              ].map((logo, idx) => (
                <img
                  key={`${logo.name}-${idx}`}
                  src={logo.src}
                  alt={`${logo.name} logo`}
                  className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Local styles for marquee animation */}
        <style>{`
          .marquee-track {
            animation: marquee-left-right 25s linear infinite;
            width: max-content;
          }
          @keyframes marquee-left-right {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .marquee-track { animation: none; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default TechStack;
