import { Container } from "@/components/containers";
import { getSiteContent } from "@/lib/content";

export function Footer() {
  const { navLinks, site } = getSiteContent();
  return (
    <footer className="border-t border-line-soft">
      <Container className="flex flex-col gap-10 py-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-display text-xl font-light uppercase tracking-[0.3em] text-paper">
            {site.name}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim">
            {site.roles.join(" · ")}
          </span>
        </div>

        <nav aria-label="Footer" className="order-3 lg:order-none">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-mono text-[10px] uppercase tracking-[0.26em] text-dim transition-colors hover:text-paper"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col items-start gap-1 lg:items-end">
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-dim">
            © {new Date().getFullYear()} {site.name} — All frames reserved
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-dim/70">
            {site.address}
          </span>
        </div>
      </Container>
    </footer>
  );
}