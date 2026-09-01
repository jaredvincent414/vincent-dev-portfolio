import { navLinks } from "../constants";

const Footer = () => (
  <footer className="relative z-10 border-t border-white/8 bg-[#09091a]">
    {/* Main footer body */}
    <div className="px-5 md:px-20 py-12 flex flex-col md:flex-row justify-between gap-10">

      {/* Brand */}
      <div className="flex flex-col gap-3 max-w-xs">
        <p className="text-white font-black text-xl tracking-tight">Vincent Jared</p>
        <p className="text-white/65 text-sm leading-relaxed">
          Software Engineer · Brandeis University CS &amp; Quantitative Economics · Building backend systems that hold up under load.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-3">
        <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-1">Navigation</p>
        {navLinks.map(({ name, link }) => (
          <a
            key={name}
            href={link}
            className="text-white/65 hover:text-white text-sm transition-colors duration-200"
          >
            {name}
          </a>
        ))}
      </div>

      {/* Contact & Socials */}
      <div className="flex flex-col gap-3">
        <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-1">Get In Touch</p>
        <a
          href="mailto:jaredvincent18@gmail.com"
          className="text-white/65 hover:text-white text-sm transition-colors duration-200"
        >
          jaredvincent18@gmail.com
        </a>
        <a
          href="tel:+16179877542"
          className="text-white/65 hover:text-white text-sm transition-colors duration-200"
        >
          +1 (617) 987-7542
        </a>
        <div className="flex items-center gap-4 mt-2">
          <a
            href="https://www.linkedin.com/in/vincent-jared-1b5954265/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-white/65 hover:text-white transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V24h-4V8.5zm7.5 0h3.8v2.1h.1c.5-.9 1.8-2.1 3.7-2.1 4 0 4.7 2.6 4.7 6V24h-4v-7.2c0-1.7 0-3.8-2.3-3.8s-2.6 1.8-2.6 3.7V24h-4V8.5z" />
            </svg>
          </a>
          <a
            href="https://github.com/jaredvincent414"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-white/65 hover:text-white transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.19-1.12-1.5-1.12-1.5-.92-.64.07-.63.07-.63 1.02.07 1.56 1.07 1.56 1.07.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.34 9.34 0 0 1 12 7.5c.85 0 1.7.12 2.5.35 1.9-1.32 2.74-1.05 2.74-1.05.56 1.42.21 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.31.68.93.68 1.88 0 1.36-.01 2.46-.01 2.79 0 .26.18.57.69.47A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-white/5 px-5 md:px-20 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
      <p className="text-white/55 text-xs">
        © {new Date().getFullYear()} Vincent Jared. All rights reserved.
      </p>
      <p className="text-white/55 text-xs">
        Built with React &amp; Tailwind CSS
      </p>
    </div>
  </footer>
);

export default Footer;
