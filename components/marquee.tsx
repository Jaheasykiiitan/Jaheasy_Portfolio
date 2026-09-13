import { getSiteContent } from "@/lib/content";

/**
 * Sliding editorial strip that loops categories behind the hero.
 * Two identical groups make the CSS loop seamless (track is -50%).
 */
export function Marquee() {
  const { marqueeItems } = getSiteContent();
  const group = [...marqueeItems, ...marqueeItems];

  return (
    <div
      aria-hidden="true"
      className="marquee relative border-y border-line-soft bg-cine-bg py-5"
    >
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1}
          >
            {group.map((item, i) => (
              <span
                key={`${copy}-${i}`}
                className="flex items-center font-mono text-xs uppercase tracking-[0.4em] text-dim"
              >
                <span className="px-6 sm:px-10">{item}</span>
                <span className="text-accent/70">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}