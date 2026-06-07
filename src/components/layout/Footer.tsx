import { Container } from "@/src/components/ui/container";

const footerLinks = [
  { label: "Advertising", href: "/advertising" },
  { label: "Consulting", href: "/consulting" },
  { label: "Q&A", href: "/consulting#qa" },
  { label: "Login", href: "/login" },
];

export default function Footer() {
  return (
    <footer className="border-t border-secondary/20 bg-neutral">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:justify-start">
          <a href="/" className="font-semibold text-primary">
            AgriConsult
          </a>
          {footerLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-secondary hover:text-primary">
              {link.label}
            </a>
          ))}
        </div>
        <p className="text-xs text-secondary">© {new Date().getFullYear()} AgriConsult.</p>
      </Container>
    </footer>
  );
}
