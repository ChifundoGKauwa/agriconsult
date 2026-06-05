import { Button } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-secondary/20 bg-neutral/95 text-secondary backdrop-blur">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="text-base font-semibold text-primary">AgriConsult</div>
        <nav className="hidden items-center gap-6 text-xs font-medium uppercase tracking-[0.2em] lg:flex">
          <a className="hover:text-primary" href="/#services">
            Services
          </a>
          <a className="hover:text-primary" href="/advertising">
            Advertising
          </a>
          <a className="hover:text-primary" href="/consulting">
            Consulting
          </a>
          <a className="hover:text-primary" href="/consulting#qa">
            Q&amp;A
          </a>
        </nav>
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.2em]">
          <a className="hover:text-primary" href="/login">
            Login
          </a>
          <a href="/consulting">
            <Button size="sm" className="bg-accent text-primary hover:bg-tertiary">
              Schedule Consultation
            </Button>
          </a>
        </div>
      </Container>
    </header>
  );
}
