import type { ReactNode } from "react";

/* Page-width gutter with a wide editorial max-width. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

/* Semantic section wrapper with scroll offset for the fixed nav. */
export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 py-24 sm:py-28 lg:py-36 ${className}`}
    >
      {children}
    </section>
  );
}

/* Small mono index label, e.g. “01 — WORK”. */
export function Eyebrow({
  index,
  children,
  className = "",
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.42em] text-dim ${className}`}
    >
      {index ? (
        <span className="text-accent">{index}</span>
      ) : (
        <span className="h-px w-8 bg-line" aria-hidden="true" />
      )}
      <span>{children}</span>
    </p>
  );
}

/* Large cinematic section heading. */
export function SectionTitle({
  children,
  className = "",
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <Tag
      className={`font-display font-light leading-[0.95] tracking-tight text-paper ${className}`}
    >
      {children}
    </Tag>
  );
}