type SectionHeadingProps = {
  eyebrow?: string;
  subtitle?: string;
  title: string;
};

export function SectionHeading({
  eyebrow,
  subtitle,
  title
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-800 dark:text-emerald-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
