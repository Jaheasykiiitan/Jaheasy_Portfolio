import { CardListRow } from "@/components/card-list";
import { Container, Eyebrow, SectionTitle } from "@/components/containers";
import { MaskLine, Reveal } from "@/components/reveal";
import { getSiteContent } from "@/lib/content";

export function Services() {
  const { services } = getSiteContent();
  return (
    <section id="services" className="relative scroll-mt-24 py-24 sm:py-28 lg:py-36">
      <Container>
        <div className="mb-6 lg:mb-8">
          <Reveal>
            <Eyebrow index="04">Services</Eyebrow>
          </Reveal>
          <SectionTitle className="mt-6 text-5xl sm:text-6xl lg:text-8xl">
            <MaskLine>What I</MaskLine>
            <MaskLine delay={0.08} className="italic">
              Do
            </MaskLine>
          </SectionTitle>
        </div>

        <div className="mt-4">
          {services.map((service, i) => (
            <Reveal key={service.index} delay={Math.min(i * 0.05, 0.2)}>
              <CardListRow
                index={service.index}
                title={service.title}
                description={service.description}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function Toolkit() {
  const { skills } = getSiteContent();
  return (
    <section id="toolkit" className="relative scroll-mt-24 py-24 sm:py-28 lg:py-36">
      <Container>
        <div className="mb-6 lg:mb-8">
          <Reveal>
            <Eyebrow index="05">Toolkit</Eyebrow>
          </Reveal>
          <SectionTitle className="mt-6 text-5xl sm:text-6xl lg:text-7xl">
            <MaskLine>The Edit</MaskLine>
            <MaskLine delay={0.08} className="italic">
              Bay Kit
            </MaskLine>
          </SectionTitle>
        </div>

        <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill, i) => (
            <Reveal key={skill.name} delay={i * 0.06}>
              <div className="group flex h-full flex-col justify-between gap-10 bg-cine-bg p-8 transition-colors duration-500 hover:bg-cine-panel lg:p-10">
                <div>
                  <p className="font-display text-2xl font-light leading-tight text-paper transition-colors duration-500 group-hover:text-accent sm:text-3xl">
                    {skill.name}
                  </p>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">
                  {skill.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function Experience() {
  const { experience } = getSiteContent();
  return (
    <section id="experience" className="relative scroll-mt-24 border-y border-line-soft bg-cine-bg py-24 sm:py-28 lg:py-36">
      <Container>
        <div className="mb-6 lg:mb-8">
          <Reveal>
            <Eyebrow index="06">Experience</Eyebrow>
          </Reveal>
          <SectionTitle className="mt-6 max-w-4xl text-4xl sm:text-5xl lg:text-7xl">
            <MaskLine>Trusted by Production</MaskLine>
            <MaskLine delay={0.08} className="italic">
              Houses & Creators
            </MaskLine>
          </SectionTitle>
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {experience.map((row, i) => (
            <Reveal key={row.title} delay={i * 0.08}>
              <div className="group border-t border-line pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-5 font-display text-2xl font-light leading-snug text-paper transition-colors duration-500 group-hover:text-haze">
                  {row.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-haze">
                  {row.summary}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}