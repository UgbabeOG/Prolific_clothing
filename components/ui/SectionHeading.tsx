type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, className = '' }: SectionHeadingProps) {
  return (
    <div className={className}>
      <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">{eyebrow}</p>
      <h2 className="mt-4 max-w-2xl text-4xl font-serif leading-tight text-white sm:text-5xl">{title}</h2>
      {description ? <p className="mt-5 max-w-xl text-sm leading-8 text-[#c8b8a2]">{description}</p> : null}
    </div>
  );
}
