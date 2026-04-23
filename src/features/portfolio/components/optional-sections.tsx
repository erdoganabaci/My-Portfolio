import {SectionHeading} from "@/components/ui/section-heading";
import {SectionShell} from "@/components/ui/section-shell";
import {
  achievementContent,
  bigProjectsContent,
  blogContent,
  podcastContent,
  talkContent
} from "@/features/portfolio/content";

export function BigProjectsSection() {
  if (!bigProjectsContent.display) {
    return null;
  }

  return (
    <SectionShell id="projects">
      <SectionHeading
        eyebrow="Projects"
        subtitle={bigProjectsContent.subtitle}
        title={bigProjectsContent.title}
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {bigProjectsContent.projects.map(project => (
          <article
            className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 shadow-[0_18px_45px_-32px_var(--shadow)] dark:border-white/10 dark:bg-white/5"
            key={project.projectName}
          >
            <div className="flex h-24 items-center">
              <img alt={project.projectName} className="max-h-full" src={project.image} />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
              {project.projectName}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {project.projectDesc}
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

export function AchievementSection() {
  if (!achievementContent.display) {
    return null;
  }

  return (
    <SectionShell id="achievements">
      <SectionHeading
        eyebrow="Achievements"
        subtitle={achievementContent.subtitle}
        title={achievementContent.title}
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {achievementContent.achievementsCards.map(item => (
          <article
            className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 shadow-[0_18px_45px_-32px_var(--shadow)] dark:border-white/10 dark:bg-white/5"
            key={item.title}
          >
            <img alt={item.title} className="h-24 w-auto object-contain" src={item.image} />
            <h3 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {item.subtitle}
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

export function BlogsSection() {
  if (!blogContent.display) {
    return null;
  }

  return (
    <SectionShell id="blogs">
      <SectionHeading
        eyebrow="Writing"
        subtitle={blogContent.subtitle}
        title={blogContent.title}
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {blogContent.blogs.map(blog => (
          <a
            className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 shadow-[0_18px_45px_-32px_var(--shadow)] transition hover:-translate-y-1 hover:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-300"
            href={blog.url}
            key={blog.url}
            rel="noreferrer"
            target="_blank"
          >
            <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
              {blog.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {blog.description}
            </p>
          </a>
        ))}
      </div>
    </SectionShell>
  );
}

export function TalksSection() {
  if (!talkContent.display) {
    return null;
  }

  return (
    <SectionShell id="talks">
      <SectionHeading
        eyebrow="Talks"
        subtitle={talkContent.subtitle}
        title={talkContent.title}
      />
      <div className="mt-8 grid gap-6">
        {talkContent.talks.map(talk => (
          <article
            className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 shadow-[0_18px_45px_-32px_var(--shadow)] dark:border-white/10 dark:bg-white/5"
            key={talk.title}
          >
            <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
              {talk.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {talk.subtitle}
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

export function PodcastSection() {
  if (!podcastContent.display) {
    return null;
  }

  return (
    <SectionShell>
      <SectionHeading
        eyebrow="Podcast"
        subtitle={podcastContent.subtitle}
        title={podcastContent.title}
      />
      <div className="mt-8 grid gap-4">
        {podcastContent.podcast.map(url => (
          <div
            className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 shadow-[0_18px_45px_-32px_var(--shadow)] dark:border-white/10 dark:bg-white/5"
            key={url}
          >
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              Podcast embed preserved for later migration:
            </p>
            <a
              className="mt-3 inline-block text-sm font-semibold text-emerald-900 underline-offset-4 hover:underline dark:text-emerald-300"
              href={url}
              rel="noreferrer"
              target="_blank"
            >
              Open podcast link
            </a>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
