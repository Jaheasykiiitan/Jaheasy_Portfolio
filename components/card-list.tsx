export function CardListRow({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative grid grid-cols-1 gap-3 border-b border-line-soft py-9 transition-colors duration-500 hover:bg-cine-panel lg:grid-cols-12 lg:items-baseline lg:gap-8 lg:px-6 lg:py-11">
      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent lg:col-span-1">
        {index}
      </span>
      <h3 className="font-display text-3xl font-light leading-none text-paper transition-transform duration-500 group-hover:translate-x-1 lg:col-span-6 sm:text-4xl lg:text-[2.6rem]">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-haze lg:col-span-5 lg:pl-4">
        {description}
      </p>
    </div>
  );
}