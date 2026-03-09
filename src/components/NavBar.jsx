import { useState, useEffect } from "react";

import { navLinks } from "../constants";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="inner">
        <a href="#hero" className="logo">
          Vincent Jared
        </a>

        <nav className="desktop">
          <ul>
            {navLinks.map(({ link, name }) => (
              <li key={name} className="group">
                <a href={link}>
                  <span>{name}</span>
                  <span className="underline" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#contact" className="contact-btn group hidden lg:flex">
          <div className="inner">
            <span>Contact me</span>
          </div>
        </a>

        {/* Hamburger — mobile only */}
        <button
          type="button"
          className="lg:hidden p-2 text-white"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="lg:hidden bg-black border-t border-black-50 py-4 px-5"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map(({ link, name }) => (
              <li key={name}>
                <a
                  href={link}
                  onClick={closeMenu}
                  className="block py-3 text-white-50 hover:text-white transition-colors duration-200"
                >
                  {name}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={closeMenu}
                className="block py-3 text-white-50 hover:text-white transition-colors duration-200"
              >
                Contact me
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default NavBar;
