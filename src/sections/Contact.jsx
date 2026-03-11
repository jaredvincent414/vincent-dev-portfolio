import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      }
    );
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="relative z-10 py-20 md:py-28 px-6 md:px-20">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* Let's connect */}
        <div className="w-full md:w-1/2">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0f0e24] px-6 py-8 md:px-10 md:py-10 relative overflow-hidden
                          hover:border-white/20 transition-all duration-300"
               style={{ boxShadow: "0 0 32px rgba(168,85,247,0.08)" }}>
            {/* Corner glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none opacity-[0.15]"
                 style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)", filter: "blur(20px)" }} />

            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Let's connect.</h2>
            <div className="flex items-center gap-4">

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/vincent-jared-1b5954265/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex items-center justify-center w-14 h-14 rounded-xl border border-white/[0.08] bg-white/[0.04]
                           hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-200 text-white/70 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V24h-4V8.5zm7.5 0h3.8v2.1h.1c.5-.9 1.8-2.1 3.7-2.1 4 0 4.7 2.6 4.7 6V24h-4v-7.2c0-1.7 0-3.8-2.3-3.8s-2.6 1.8-2.6 3.7V24h-4V8.5z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/jaredvincent414"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex items-center justify-center w-14 h-14 rounded-xl border border-white/[0.08] bg-white/[0.04]
                           hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-200 text-white/70 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.19-1.12-1.5-1.12-1.5-.92-.64.07-.63.07-.63 1.02.07 1.56 1.07 1.56 1.07.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.34 9.34 0 0 1 12 7.5c.85 0 1.7.12 2.5.35 1.9-1.32 2.74-1.05 2.74-1.05.56 1.42.21 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.31.68.93.68 1.88 0 1.36-.01 2.46-.01 2.79 0 .26.18.57.69.47A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>

            </div>
          </div>
        </div>

        {/* Resume */}
        <div className="w-full rounded-2xl border border-white/[0.08] bg-[#0f0e24] overflow-hidden relative
                        hover:border-white/20 transition-all duration-300"
             style={{ boxShadow: "0 0 32px rgba(168,85,247,0.08)" }}>
          {/* Corner glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none opacity-[0.12]"
               style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)", filter: "blur(30px)" }} />

          <div className="px-6 py-8 md:px-10 md:py-10 text-center">
            <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-3">For Employers</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">Resume.</h2>
          </div>
          <div className="border-t border-white/[0.06] px-6 py-5 md:px-10 md:py-6 flex justify-center">
            <a
              href="/resume/Vincent_Otieno_Jared_Resume.pdf"
              download
              className="px-10 py-3 rounded-xl border border-purple-500/40 bg-purple-500/10
                         hover:bg-purple-500/20 hover:border-purple-500/70
                         text-white font-semibold text-sm tracking-wide transition-all duration-200"
              style={{ boxShadow: "0 0 16px rgba(168,85,247,0.15)" }}
            >
              Download Resume
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
