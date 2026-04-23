import {GoMortarBoard} from "react-icons/go";
import {SectionHeading} from "@/components/ui/section-heading";
import {SectionShell} from "@/components/ui/section-shell";
import {educationContent} from "@/features/portfolio/content";

export function EducationSection() {
  if (!educationContent.display) {
    return null;
  }

  return (
    <SectionShell id="education">
      <SectionHeading
        eyebrow="Education"
        subtitle="Academic foundations that shaped the engineering work behind the portfolio."
        title="Study and specialization"
      />
      <div className="mt-8 grid gap-5">
        {educationContent.schools.map(school => (
          <article
            className="grid gap-5 rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 shadow-[0_18px_45px_-32px_var(--shadow)] dark:border-white/10 dark:bg-white/5 md:grid-cols-[96px_minmax(0,1fr)]"
            key={`${school.schoolName}-${school.duration}`}
          >
            <div className="flex size-24 items-center justify-center rounded-[1.5rem] bg-slate-100/80 p-4 dark:bg-white/10">
              <img alt={`${school.schoolName} logo`} src={school.logo} />
            </div>
            <div>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
                    {school.schoolName}
                  </h3>
                  <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
                    {school.subHeader}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100/80 px-4 py-2 text-sm text-slate-600 dark:bg-white/10 dark:text-slate-300">
                  <GoMortarBoard className="size-4" />
                  {school.duration}
                </div>
              </div>
              {school.desc ? (
                <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                  {school.desc}
                </p>
              ) : null}
              {school.descBullets?.length ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {school.descBullets.map(bullet => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
