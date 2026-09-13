import { Eyebrow, SectionTitle, Container } from "@/components/containers";
import { MaskLine, Reveal } from "@/components/reveal";
import { getSiteContent } from "@/lib/content";

export function About() {
  const { aboutText, site, stats } = getSiteContent();
  const [lead, ...rest] = aboutText;

  return (
    <section id="about" className="relative scroll-mt-24 py-24 sm:py-28 lg:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Portrait / frame column */}
          <Reveal className="lg:col-span-5" y={40}>
            <div className="flex flex-col gap-6">
              <figure className="relative aspect-[4/5] overflow-hidden border border-line bg-cine-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={site.aboutFrame.poster}
                  alt={site.aboutFrame.caption}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="vignette absolute inset-0" aria-hidden="true" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cine-black/90 to-transparent p-5 font-mono text-[10px] uppercase tracking-[0.28em] text-paper/90">
                  {site.aboutFrame.caption}
                </figcaption>
              </figure>
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-dim">
                <span>Owner & Operator</span>
                <span className="text-accent">On camera since 2022</span>
              </div>
            </div>
          </Reveal>

          {/* Bio column */}
          <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
            <Reveal>
              <Eyebrow index="03">About</Eyebrow>
            </Reveal>

            <SectionTitle className="mt-6 text-4xl sm:text-5xl lg:text-[3.4rem]">
              <MaskLine>The Storyteller</MaskLine>
              <MaskLine delay={0.08} className="italic">
                Behind the Lens
              </MaskLine>
            </SectionTitle>

            <Reveal delay={0.15}>
              <p className="mt-6 font-display text-2xl font-light leading-[1.5] text-paper sm:text-[1.7rem]">
                {lead}
              </p>
            </Reveal>

            {rest.map((paragraph, i) => (
              <Reveal key={i} delay={0.1 * (i + 2)}>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-haze">
                  {paragraph}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.3}>
              <dl className="mt-8 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col gap-2 bg-cine-bg p-5 sm:p-6"
                  >
                    <dt className="order-2 font-mono text-[10px] uppercase tracking-[0.24em] text-dim">
                      {stat.label}
                    </dt>
                    <dd className="order-1 font-display text-4xl font-light leading-none text-paper">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.35}>
              <a
                href="#process"
                className="group mt-10 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-paper"
              >
                <span className="border-b border-line pb-1 transition-colors group-hover:border-paper">
                  See how I work
                </span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}