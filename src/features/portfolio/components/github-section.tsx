import {GoGitBranch, GoRepo, GoStar} from "react-icons/go";
import {HiOutlineArrowUpRight} from "react-icons/hi2";
import {SectionHeading} from "@/components/ui/section-heading";
import {SectionShell} from "@/components/ui/section-shell";
import {githubSectionContent, socialLinks} from "@/features/portfolio/content";
import type {GithubProfile} from "@/features/github/lib/get-github-profile";

type GithubSectionProps = {
  profile: GithubProfile;
};

export function GithubSection({profile}: GithubSectionProps) {
  if (!githubSectionContent.display || profile.pinnedProjects.length === 0) {
    return null;
  }

  const githubLink =
    socialLinks.find(link => link.platform === "github")?.href ??
    "https://github.com/erdoganabaci";

  return (
    <SectionShell id="opensource">
      <SectionHeading
        eyebrow="Open Source"
        subtitle="Pinned repositories pulled from a typed static snapshot rather than a build-time token flow."
        title="Selected repositories"
      />
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {profile.pinnedProjects.map(project => (
          <a
            className="group rounded-[2rem] border border-slate-200/80 bg-white/70 p-5 shadow-[0_18px_45px_-32px_var(--shadow)] transition hover:-translate-y-1 hover:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-300"
            href={project.url}
            key={project.id}
            rel="noreferrer"
            target="_blank"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex items-center gap-3 text-slate-900 dark:text-white">
                <div className="rounded-full bg-emerald-100 p-2 text-emerald-800 dark:bg-emerald-300/15 dark:text-emerald-200">
                  <GoRepo className="size-4" />
                </div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
              </div>
              <HiOutlineArrowUpRight className="size-5 text-slate-500 transition group-hover:text-emerald-700 dark:text-slate-300 dark:group-hover:text-emerald-300" />
            </div>
            <p className="mt-4 min-h-14 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {project.description ?? "No repository description provided."}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
              {project.primaryLanguage ? (
                <span className="inline-flex items-center gap-2">
                  <span
                    className="size-3 rounded-full"
                    style={{backgroundColor: project.primaryLanguage.color}}
                  />
                  {project.primaryLanguage.name}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2">
                <GoStar className="size-4" />
                {project.stars}
              </span>
              <span className="inline-flex items-center gap-2">
                <GoGitBranch className="size-4" />
                {project.forkCount}
              </span>
            </div>
          </a>
        ))}
      </div>
      <div className="mt-6">
        <a
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-900 transition hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200"
          href={githubLink}
          rel="noreferrer"
          target="_blank"
        >
          Explore more projects
          <HiOutlineArrowUpRight className="size-4" />
        </a>
      </div>
    </SectionShell>
  );
}
