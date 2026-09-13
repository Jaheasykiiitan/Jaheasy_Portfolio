import { Container, Eyebrow, SectionTitle } from "@/components/containers";
import { MaskLine, Reveal } from "@/components/reveal";
import { getSiteContent } from "@/lib/content";

export function Process() {
  const { process } = getSiteContent();
  return (
    <section id="process" className="relative scroll-mt-24 py-24 sm:py-28 lg:py-36">
      <Container>
        <div className="mb-6 lg:mb-8">
          <Reveal>
            <Eyebrow index="07">Process</Eyebrow>
          </Reveal>
          <SectionTitle className="mt-6 text-5xl sm:text-6xl lg:text-8xl">
            <MaskLine>From First Note</MaskLine>
            <MaskLine delay={0.08} className="italic">
              to Final Frame
            </MaskLine>
          </SectionTitle>
        </div>

        <ol className="grid grid-cols-1 border-t border-line md:grid-cols-2 lg:grid-cols-5">
          {process.map((step, i) => (
            <Reveal key={step.index} delay={i * 0.08} y={24}>
              <li className="group relative flex flex-col gap-5 py-9 lg:min-h-[320px] lg:border-l lg:border-line lg:py-0 lg:pr-8 lg:pt-11 lg:first:border-l-0">
                <span className="pointer-events-none absolute inset-x-0 top-0 hidden h-px origin-left scale-x-0 bg-accent transition-transform duration-700 group-hover:scale-x-100 lg:block" />
                <span className="font-display text-6xl font-light leading-none text-paper/15 transition-colors duration-700 group-hover:text-accent/60 lg:text-7xl">
                  {step.index}
                </span>
                <div className="flex flex-col gap-3 lg:mb-6">
                  <h3 className="font-mono text-sm uppercase tracking-[0.3em] text-paper">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-haze">
                    {step.description}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-dim transition-opacity duration-500 group-hover:opacity-100 lg:mt-auto lg:block lg:opacity-0"
                >
                  Step {step.index} of {process.length}
                </span>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}