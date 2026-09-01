import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "jaredvincent18@gmail.com";

const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true" {...props}>
    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V24h-4V8.5zm7.5 0h3.8v2.1h.1c.5-.9 1.8-2.1 3.7-2.1 4 0 4.7 2.6 4.7 6V24h-4v-7.2c0-1.7 0-3.8-2.3-3.8s-2.6 1.8-2.6 3.7V24h-4V8.5z" />
  </svg>
);

const GitHubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.19-1.12-1.5-1.12-1.5-.92-.64.07-.63.07-.63 1.02.07 1.56 1.07 1.56 1.07.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.34 9.34 0 0 1 12 7.5c.85 0 1.7.12 2.5.35 1.9-1.32 2.74-1.05 2.74-1.05.56 1.42.21 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.31.68.93.68 1.88 0 1.36-.01 2.46-.01 2.79 0 .26.18.57.69.47A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
  </svg>
);

const ResumeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20" aria-hidden="true" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
  </svg>
);

const DestinationRow = ({ href, icon, label, meta, glyph, download }) => (
  <a
    href={href}
    {...(download
      ? { download: true }
      : { target: "_blank", rel: "noopener noreferrer" })}
    className="group flex items-center gap-4 px-5 py-5 md:px-6
               bg-[#0b0f1c] transition-colors duration-200 hover:bg-grana-500/[0.07]"
  >
    <span className="text-white/65 transition-colors duration-200 group-hover:text-grana-300">
      {icon}
    </span>

    <span className="flex-1 min-w-0">
      <span className="block text-white font-semibold text-sm md:text-base">{label}</span>
      <span className="block font-mono text-[11px] text-white/65 truncate">{meta}</span>
    </span>

    <span
      aria-hidden="true"
      className="font-mono text-grana-300 transition-transform duration-200 group-hover:translate-x-1"
    >
      {glyph}
    </span>
  </a>
);

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
    <section id="contact" ref={sectionRef} className="relative z-10 py-12 md:py-16 px-6 md:px-20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* Left — the ask, and the fastest way to act on it */}
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
            Let&apos;s connect.
          </h2>

          <p className="font-mono text-sm text-white/65 leading-[1.8] mb-8 max-w-md">
            Open to software engineering internships and new-grad roles.
            Email is the fastest way to reach me — I read everything.
          </p>

          <a
            href={`mailto:${EMAIL}`}
            className="inline-block font-mono text-base md:text-lg text-white
                       border-b border-grana-500/50 pb-1
                       hover:text-grana-300 hover:border-grana-300 transition-colors duration-200"
          >
            {EMAIL}
          </a>
        </div>

        {/* Right — destinations. gap-px over a light background draws the hairlines,
            matching the stat grid in the intro. */}
        <div className="grid grid-cols-1 gap-px bg-white/[0.10] border border-white/[0.10] rounded-lg overflow-hidden">
          <DestinationRow
            href="https://www.linkedin.com/in/vincent-jared-1b5954265/"
            icon={<LinkedInIcon />}
            label="LinkedIn"
            meta="in/vincent-jared"
            glyph="→"
          />
          <DestinationRow
            href="https://github.com/jaredvincent414"
            icon={<GitHubIcon />}
            label="GitHub"
            meta="@jaredvincent414"
            glyph="→"
          />
          <DestinationRow
            href="/resume/Vincent_Otieno_Jared_Resume.pdf"
            icon={<ResumeIcon />}
            label="Résumé"
            meta="PDF · 134 KB"
            glyph="↓"
            download
          />
        </div>

      </div>
    </section>
  );
};

export default Contact;
