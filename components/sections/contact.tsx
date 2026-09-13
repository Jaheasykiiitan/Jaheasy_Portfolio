import { Container, Eyebrow, SectionTitle } from "@/components/containers";
import { MaskLine, Reveal } from "@/components/reveal";
import { getSiteContent } from "@/lib/content";

export function Contact() {
  const { site, socials } = getSiteContent();
  const mailHref = `mailto:${site.email}?subject=${encodeURIComponent(site.emailSubject)}`;

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden border-t border-line-soft py-28 sm:py-36 lg:py-48"
    >
      <Container className="flex flex-col items-center text-center">
        <Reveal>
          <Eyebrow index="08" className="justify-center">
            Contact
          </Eyebrow>
        </Reveal>

        {/* Ghost type backdrop */}
        <p
          aria-hidden="true"
          className="ghost-type pointer-events-none absolute inset-x-0 top-10 select-none text-center font-display text-[18vw] font-light uppercase leading-none lg:top-4"
        >
          Reel
        </p>

        <SectionTitle as="h2" className="mt-10 text-[clamp(2.5rem,7.5vw,6.5rem)]">
          <MaskLine>Have a Story</MaskLine>
          <MaskLine delay={0.08} className="italic">
            Worth Telling?
          </MaskLine>
        </SectionTitle>

        <Reveal delay={0.2}>
          <p className="mt-6 font-display text-2xl font-light italic text-haze sm:text-3xl">
            Let’s create something.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-dim">
            {site.availability}
          </p>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row">
            <a
              href={mailHref}
              className="group inline-flex items-center gap-3 bg-paper px-9 py-4 font-mono text-[11px] uppercase tracking-[0.3em] text-cine-black transition-colors duration-300 hover:bg-cine-panel hover:text-paper"
            >
              Start a Project
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href={mailHref}
              className="border-b border-line pb-1 font-mono text-sm tracking-wide text-paper transition-colors hover:border-paper hover:text-haze"
            >
              {site.email}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <ul className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {socials.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper transition-colors duration-300 group-hover:text-accent">
                    {social.label}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-dim">
                    {social.handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}