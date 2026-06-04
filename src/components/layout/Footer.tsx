import { Button } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";

const footerColumns = [
  {
    title: "Marketplace",
    links: ["Featured Livestock", "Bulk Grains", "Logistics & Seeds", "Agri-Tech Solutions"],
  },
  {
    title: "Consulting",
    links: ["Soil Analysis", "Crop Optimization", "Agri-Tech", "Contact Expert"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Listing Guidelines", "Cookie Policy"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-neutral">
      <Container className="grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">
            AgroConsult
          </h3>
          <p className="max-w-md text-sm text-secondary">
            Pioneering the intersection of traditional wisdom and advanced
            agriculture technology since 2012.
          </p>
          <p className="text-xs text-secondary">© 2026 AgroConsult. All rights reserved.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                {column.title}
              </p>
              <div className="space-y-2 text-sm text-secondary">
                {column.links.map((link) => (
                  <p key={link}>{link}</p>
                ))}
              </div>
            </div>
          ))}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Newsletter
            </p>
            <p className="text-sm text-secondary">
              Weekly insights on market trends and farm management.
            </p>
            <div className="flex items-center gap-2 rounded-full border border-secondary/20 px-3 py-2">
              <span className="text-xs text-secondary">Email address</span>
              <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                →
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
