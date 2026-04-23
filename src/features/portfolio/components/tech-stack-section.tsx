import {SectionHeading} from "@/components/ui/section-heading";
import {SectionShell} from "@/components/ui/section-shell";
import {techStackContent} from "@/features/portfolio/content";

export function TechStackSection() {
  if (!techStackContent.display) {
    return null;
  }

  return (
    <SectionShell id="stack">
      <SectionHeading
        eyebrow="Delivery Range"
        subtitle="A practical snapshot of the areas I currently drive most confidently."
        title="Current focus"
      />
      <div className="mt-8 grid gap-4">
        {techStackContent.experience.map(item => (
          <div
            className="rounded-[1.5rem] border border-slate-200/80 bg-white/70 px-5 py-4 shadow-[0_18px_45px_-32px_var(--shadow)] dark:border-white/10 dark:bg-white/5"
            key={item.label}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-800 dark:text-slate-100">
                {item.label}
              </p>
              <span className="text-sm text-slate-500 dark:text-slate-300">
                {item.progressPercentage}%
              </span>
            </div>
            <div className="mt-4 h-3 rounded-full bg-slate-200/80 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-500 dark:from-emerald-300 dark:via-teal-300 dark:to-cyan-200"
                style={{width: `${item.progressPercentage}%`}}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
