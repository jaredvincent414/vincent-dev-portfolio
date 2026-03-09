import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const rydeRef = useRef(null);
  const libraryRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    const cards = [rydeRef.current, libraryRef.current];
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
          },
        }
      );
    });
  }, []);

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        <div className="showcaselayout">
          {/* ViewPesa — placeholder until screenshot is added */}
          <div ref={rydeRef} className="first-project-wrapper">
            <div className="image-wrapper">
              <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-br from-[#0f5132] via-[#1a3a5c] to-[#0d0d1a]">
                <span className="text-white/40 text-lg font-semibold tracking-wide">ViewPesa</span>
              </div>
            </div>
            <div className="text-content">
              <h2>ViewPesa</h2>
              <p className="text-white-50 md:text-xl">
                Flutter mobile app that parses M-Pesa SMS messages with 99% accuracy, enabling real-time
                financial activity tracking for users and reducing manual input errors by over 80%.
              </p>
            </div>
          </div>

          {/* SwiftDine */}
          <div className="project-list-wrapper overflow-hidden">
            <div className="project" ref={libraryRef}>
              <div className="image-wrapper bg-[#FFEFDB]">
                <img
                  src="/images/Swiftdine.png"
                  alt="SwiftDine restaurant management system"
                  loading="lazy"
                />
              </div>
              <h2>SwiftDine — Restaurant Management System</h2>
              <p className="text-white-50 md:text-xl">
                SwiftDine is a digitized restaurant menu and ordering system designed to eliminate
                delays in food service. Empowers diners to browse menus, place orders, and make
                payments directly from their mobile devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShowcase;
