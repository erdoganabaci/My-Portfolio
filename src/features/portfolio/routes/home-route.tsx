import {Reveal} from "@/components/ui/reveal";
import {ContactSection} from "@/features/portfolio/components/contact-section";
import {EducationSection} from "@/features/portfolio/components/education-section";
import {ExperienceSection} from "@/features/portfolio/components/experience-section";
import {GithubSection} from "@/features/portfolio/components/github-section";
import {HeroSection} from "@/features/portfolio/components/hero-section";
import {
  AchievementSection,
  BigProjectsSection,
  BlogsSection,
  PodcastSection,
  TalksSection
} from "@/features/portfolio/components/optional-sections";
import {ScrollToTop} from "@/features/portfolio/components/scroll-to-top";
import {SiteFooter} from "@/features/portfolio/components/site-footer";
import {SiteHeader} from "@/features/portfolio/components/site-header";
import {SkillsSection} from "@/features/portfolio/components/skills-section";
import {TechStackSection} from "@/features/portfolio/components/tech-stack-section";
import {getGithubProfile} from "@/features/github/lib/get-github-profile";

export function HomeRoute() {
  const profile = getGithubProfile();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
        <main className="mt-8">
          <HeroSection />
          <Reveal>
            <SkillsSection />
          </Reveal>
          <Reveal>
            <TechStackSection />
          </Reveal>
          <Reveal>
            <EducationSection />
          </Reveal>
          <Reveal>
            <ExperienceSection />
          </Reveal>
          <Reveal>
            <GithubSection profile={profile} />
          </Reveal>
          <BigProjectsSection />
          <AchievementSection />
          <BlogsSection />
          <TalksSection />
          <PodcastSection />
          <Reveal>
            <ContactSection profile={profile} />
          </Reveal>
        </main>
        <SiteFooter />
      </div>
      <ScrollToTop />
    </div>
  );
}
