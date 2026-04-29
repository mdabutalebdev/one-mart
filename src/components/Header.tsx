"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 36);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "MENS", href: "/mens" },
    { name: "WOMENS", href: "/womens" },
    { name: "ACCESSORIES", href: "/accessories" },
    { name: "OUR STORY", href: "/story" },
  ];

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 bg-white ${isScrolled ? "shadow-md py-6" : "py-6"
        }`}
    >
      <div className="container mx-auto px-10 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <div className="md:hidden flex-1">
          <button className="text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center gap-8">
          {navLinks.slice(0, 2).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[11px] font-montserrat font-bold tracking-[0.15em] hover:opacity-60 transition-opacity"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="text-2xl font-montserrat font-extrabold tracking-[0.3em] pl-[0.3em]">
            MVMT
          </Link>
        </div>

        {/* Icons */}
        <div className="flex-1 flex items-center justify-end gap-5">
          <nav className="hidden md:flex items-center gap-8 mr-8">
            {navLinks.slice(2).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[11px] font-montserrat font-bold tracking-[0.15em] hover:opacity-60 transition-opacity"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <button className="hover:opacity-60 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <button className="hover:opacity-60 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
