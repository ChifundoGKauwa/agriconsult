"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/advertising", label: "Advertising" },
  { href: "/consulting", label: "Consulting" },
  { href: "/consulting#qa", label: "Q&A" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-secondary/20 bg-neutral/95 text-secondary backdrop-blur">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
        <a href="/" className="text-base font-semibold text-primary hover:text-primary/80">
          AgriConsult
        </a>

        <nav className="hidden items-center gap-6 text-xs font-medium uppercase tracking-[0.2em] lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} className="hover:text-primary" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 text-xs uppercase tracking-[0.2em] lg:flex">
          <a className="hover:text-primary" href="/login">Login</a>
          <a href="/consulting">
            <Button size="sm" className="bg-accent text-primary hover:bg-tertiary">
              Schedule Consultation
            </Button>
          </a>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/20 text-primary lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          )}
        </button>
      </Container>

      {menuOpen && (
        <div className="border-t border-secondary/20 bg-white px-4 pb-6 pt-3 lg:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium uppercase tracking-[0.2em] text-secondary">
            {navLinks.map((link) => (
              <a key={link.href} className="hover:text-primary" href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <hr className="border-secondary/20" />
            <a className="hover:text-primary" href="/login" onClick={() => setMenuOpen(false)}>Login</a>
            <a href="/consulting" onClick={() => setMenuOpen(false)}>
              <Button size="sm" className="w-full bg-accent text-primary hover:bg-tertiary">Schedule Consultation</Button>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
