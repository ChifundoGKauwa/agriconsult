import { Container } from "@/src/components/ui/container";

const footerColumns = [
  {
    title: "Marketplace",
    links: [
      { label: "Advertising", href: "/advertising" },
      { label: "Consulting", href: "/consulting" },
      { label: "Q&A", href: "/qa" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Login", href: "/login" },
      { label: "Sign Up", href: "/signup" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-secondary/20 bg-neutral">
      <Container className="grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <a href="/" className="text-lg font-semibold text-primary">AgriConsult</a>
          <p className="max-w-md text-sm text-secondary">
            Bridging traditional agricultural wisdom with data-driven strategic consulting.
          </p>
          <p className="text-xs text-secondary">© {new Date().getFullYear()} AgriConsult.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {footerColumns.map((column) => (
            <div key={column.title} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                {column.title}
              </p>
              <div className="space-y-2 text-sm text-secondary">
                {column.links.map((link) => (
                  <a key={link.href} href={link.href} className="block hover:text-primary">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </footer>
  );
}
