import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import TitleHeader from "../components/TitleHeader";

const TechStack = () => {
  return (
    <div id="skills" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        {/* Programming Languages Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
            Programming Languages
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <img 
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" 
                alt="Python" 
                className="w-16 h-16 md:w-20 md:h-20 mb-3 hover:scale-110 transition-transform duration-300"
              />
              <span className="text-white text-sm md:text-base font-medium">Python</span>
            </div>
            <div className="flex flex-col items-center">
              <img 
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" 
                alt="Java" 
                className="w-16 h-16 md:w-20 md:h-20 mb-3 hover:scale-110 transition-transform duration-300"
              />
              <span className="text-white text-sm md:text-base font-medium">Java</span>
            </div>
            <div className="flex flex-col items-center">
              <img 
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" 
                alt="JavaScript" 
                className="w-16 h-16 md:w-20 md:h-20 mb-3 hover:scale-110 transition-transform duration-300"
              />
              <span className="text-white text-sm md:text-base font-medium">JavaScript</span>
            </div>
            <div className="flex flex-col items-center">
              <img 
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" 
                alt="C++" 
                className="w-16 h-16 md:w-20 md:h-20 mb-3 hover:scale-110 transition-transform duration-300"
              />
              <span className="text-white text-sm md:text-base font-medium">C++</span>
            </div>
            <div className="flex flex-col items-center">
              <img 
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" 
                alt="Swift" 
                className="w-16 h-16 md:w-20 md:h-20 mb-3 hover:scale-110 transition-transform duration-300"
              />
              <span className="text-white text-sm md:text-base font-medium">Swift</span>
            </div>
            <div className="flex flex-col items-center">
              <img 
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" 
                alt="Dart" 
                className="w-16 h-16 md:w-20 md:h-20 mb-3 hover:scale-110 transition-transform duration-300"
              />
              <span className="text-white text-sm md:text-base font-medium">Dart</span>
            </div>
          </div>
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
                { name: "AWS", src: "https://www.logo.wine/logo/Amazon_Web_Services" },
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
