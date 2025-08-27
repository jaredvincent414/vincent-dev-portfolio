import { useGSAP } from "@gsap/react";
import gsap from "gsap";


import Button from "../components/Button";
import { words } from "../constants";
import HeroExperience from "../components/models/hero_models/HeroExperience";

const Hero = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.inOut" }
    );
  });

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute top-0 left-0 z-0">
        <img src="/images/bg.png" alt="" />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen text-center pt-32">
        <div className="flex flex-col gap-6">
          <div className="hero-text">
          </div>

          <h1 className="text-white md:text-6xl text-4xl font-extrabold tracking-tight relative z-10 max-w-3xl mx-auto">
            Hi, I'm <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #0f5132 0%, #4ea8de 35%, #ff6fa5 65%, #ff9f45 100%)",
              }}
            >
              Vincent
            </span>
          </h1>
          <p className="text-white md:text-xl font-bold relative z-10 pointer-events-none max-w-2xl mx-auto">
            Let's Connect!
          </p>


        </div>

        {/* 3D Model - Centered below text */}
        <div className="mt-6 w-full h-[90vh]">
          <HeroExperience />
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Introduction
            </h2>
            <h3 className="text-2xl font-semibold text-blue-400 mb-6">
              Overview
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Hi, I am Vincent. I am currently a sophomore at Brandeis University studying Computer Science. I am aspiring to a technically challenging and cutting-edge career that allows me to contribute immensely to the progress of technology and the ability to use technology to help people, especially the marginalized. My interests include software design and development, machine learning, natural language processing as well as artificial intelligence.
            </p>
          </div>
          

        </div>
      </section>
    </section>
  );
};

export default Hero;
