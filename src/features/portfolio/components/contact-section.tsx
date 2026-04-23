import {GoLocation} from "react-icons/go";
import {MdOutlineAlternateEmail, MdOutlinePhone} from "react-icons/md";
import {Button} from "@/components/ui/button";
import {SectionHeading} from "@/components/ui/section-heading";
import {SectionShell} from "@/components/ui/section-shell";
import {contactContent, githubSectionContent} from "@/features/portfolio/content";
import type {GithubProfile} from "@/features/github/lib/get-github-profile";
import {SocialLinks} from "@/features/portfolio/components/social-links";

type ContactSectionProps = {
  profile: GithubProfile;
};

export function ContactSection({profile}: ContactSectionProps) {
  return (
    <SectionShell id="contact">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 shadow-[0_18px_45px_-32px_var(--shadow)] dark:border-white/10 dark:bg-white/5">
          <SectionHeading
            eyebrow="Contact"
            subtitle={contactContent.subtitle}
            title={contactContent.title}
          />
          <div className="mt-8 space-y-4">
            <a
              className="flex items-center gap-3 rounded-[1.25rem] bg-slate-100/80 px-4 py-4 text-slate-700 transition hover:bg-slate-100 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
              href={`tel:${contactContent.number}`}
            >
              <MdOutlinePhone className="size-5 shrink-0 text-emerald-800 dark:text-emerald-300" />
              <span>{contactContent.number}</span>
            </a>
            <a
              className="flex items-center gap-3 rounded-[1.25rem] bg-slate-100/80 px-4 py-4 text-slate-700 transition hover:bg-slate-100 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
              href={`mailto:${contactContent.emailAddress}`}
            >
              <MdOutlineAlternateEmail className="size-5 shrink-0 text-emerald-800 dark:text-emerald-300" />
              <span>{contactContent.emailAddress}</span>
            </a>
          </div>
          <SocialLinks className="mt-6" />
        </div>

        {githubSectionContent.showGithubProfile ? (
          <article className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 shadow-[0_18px_45px_-32px_var(--shadow)] dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <img
                alt={profile.name}
                className="size-28 rounded-[1.75rem] object-cover shadow-lg shadow-emerald-950/10"
                src={profile.avatarUrl}
              />
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
                  {profile.name}
                </h3>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                  Open for opportunities: {profile.isHireable ? "Yes" : "No"}
                </p>
                {profile.location ? (
                  <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <GoLocation className="size-4" />
                    {profile.location}
                  </p>
                ) : null}
                <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                  {profile.bio?.startsWith("http")
                    ? "Personal website available below."
                    : profile.bio ??
                      "Senior full stack software engineer based in Brussels."}
                </p>
                {profile.bio?.startsWith("http") ? (
                  <div className="mt-5">
                    <Button href={profile.bio} newTab variant="secondary">
                      Visit website
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        ) : null}
      </div>
    </SectionShell>
  );
}
