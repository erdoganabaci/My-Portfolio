import {HiOutlineArrowUpRight} from "react-icons/hi2";
import {SectionHeading} from "@/components/ui/section-heading";
import {SectionShell} from "@/components/ui/section-shell";
import {experienceContent} from "@/features/portfolio/content";

function getCompanyInitials(company: string) {
  const parts = company.split(/[\s-]+/).filter(Boolean);

  if (parts.length === 1) {
    return company.slice(0, 2).toUpperCase();
  }

  return parts
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getWebsiteLabel(websiteUrl: string) {
  try {
    return new URL(websiteUrl).hostname.replace(/^www\./, "");
  } catch {
    return websiteUrl;
  }
}

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
                    {item.companyLogo ? (
                      <img alt={`${item.company} logo`} src={item.companyLogo} />
                    ) : (
                      <span className="text-xl font-semibold tracking-[0.18em] text-white">
                        {getCompanyInitials(item.company)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{item.role}</h3>
                    <p className="mt-1 text-sm uppercase tracking-[0.22em] text-white/80">
                      {item.company}
                    </p>
                    {item.location ? (
                      <p className="mt-2 text-sm text-white/75">{item.location}</p>
                    ) : null}
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
              {item.websiteUrl ? (
                <a
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900 transition hover:-translate-y-0.5 hover:border-emerald-500 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
                  href={item.websiteUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {getWebsiteLabel(item.websiteUrl)}
                  <HiOutlineArrowUpRight className="size-4" />
                </a>
              ) : null}
              {item.techStack?.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.techStack.map(tech => (
                    <span
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
                      key={tech}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
