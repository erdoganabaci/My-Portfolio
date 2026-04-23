import {SectionHeading} from "@/components/ui/section-heading";
import {SectionShell} from "@/components/ui/section-shell";
import {experienceContent} from "@/features/portfolio/content";

export function ExperienceSection() {
  if (!experienceContent.display) {
    return null;
  }

  return (
    <SectionShell id="experience">
      <SectionHeading
        eyebrow="Work"
        subtitle="Roles and product contexts that shaped the portfolio narrative."
        title="Professional experience"
      />
      <div className="mt-8 grid gap-6">
        {experienceContent.experience.map(item => (
          <article
            className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/70 shadow-[0_18px_45px_-32px_var(--shadow)] dark:border-white/10 dark:bg-white/5"
            key={`${item.company}-${item.role}-${item.date}`}
          >
            <div
              className="px-6 py-5 text-white"
              style={{
                background: `linear-gradient(135deg, ${item.accentColor}, rgba(15, 23, 42, 0.92))`
              }}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex size-18 shrink-0 items-center justify-center rounded-[1.4rem] bg-white/15 p-3 backdrop-blur">
                    <img alt={`${item.company} logo`} src={item.companyLogo} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{item.role}</h3>
                    <p className="mt-1 text-sm uppercase tracking-[0.22em] text-white/80">
                      {item.company}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/80">
                  {item.date}
                </p>
              </div>
            </div>
            <div className="px-6 py-6">
              <p className="text-base leading-7 text-slate-700 dark:text-slate-200">
                {item.desc}
              </p>
              {item.descBullets?.length ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {item.descBullets.map(bullet => (
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
