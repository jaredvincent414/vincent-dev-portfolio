import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const rydeRef = useRef(null);
  const libraryRef = useRef(null);
  const ycDirectoryRef = useRef(null);

  useGSAP(() => {
    // Animation for the main section
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    // Animations for each app showcase
    const cards = [rydeRef.current, libraryRef.current, ycDirectoryRef.current];

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: 50,
          opacity: 0,
        },
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
          <div ref={rydeRef} className="first-project-wrapper">
            <div className="image-wrapper">
              <img src="/images/Viewpesa.png" alt="App home screen" />
            </div>
            <div className="text-content">
              <h2>
                ViewPesa
              </h2>
              <p className="text-white-50 md:text-xl">
                 Flutter mobile app that parses M-Pesa SMS messages with 99% accuracy, enabling real-time 
                 financial activity tracking for users and reducing manual input errors by over 80%
              </p>
            </div>
          </div>

          <div className="project-list-wrapper overflow-hidden">
            <div className="project" ref={libraryRef}>
              <div className="image-wrapper bg-[#FFEFDB]">
                <img
                  src="/images/project2.png"
                  alt="Viewpesa app image"
                />
              </div>
              <h2>SwiftDine, A restaurant Management System</h2>
              <p className="text-white-50 md:text-xl">
               SwiftDine is a digitized restaurant menu and ordering system designed to eliminate
               delays in food service. Inspired by real-life frustration with long wait times, SwiftDine 
               empowers diners to browse menus, place orders, and make payments — directly from their mobile devices.  
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShowcase;
