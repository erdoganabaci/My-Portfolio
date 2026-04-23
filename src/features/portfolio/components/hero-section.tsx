import Lottie from "lottie-react";
import {HiOutlineArrowUpRight} from "react-icons/hi2";
import {Button} from "@/components/ui/button";
import {Reveal} from "@/components/ui/reveal";
import {SectionShell} from "@/components/ui/section-shell";
import {heroContent, heroIllustration, illustration} from "@/features/portfolio/content";
import {SocialLinks} from "@/features/portfolio/components/social-links";

export function HeroSection() {
  if (!heroContent.displayGreeting) {
    return null;
  }

  return (
    <SectionShell className="pt-8 sm:pt-14" id="greeting">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Reveal>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-800 dark:text-emerald-300">
              Senior full stack software engineer
            </p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl dark:text-white">
              {heroContent.title}{" "}
              <span className="inline-block origin-bottom-right animate-[wave_2.6s_ease-in-out_infinite]">
                👋
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {heroContent.subtitle}
            </p>
            <SocialLinks className="mt-8" />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`mailto:${heroContent.contactEmail}`}>
                Contact me
              </Button>
              <Button href={heroContent.resumeLink} newTab variant="secondary">
                See my resume
                <HiOutlineArrowUpRight className="size-4" />
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delayClassName="delay-150">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-[var(--surface)] p-6 shadow-[0_30px_90px_-50px_var(--shadow)] backdrop-blur-xl">
            <div className="absolute inset-x-8 top-8 h-32 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-300/10" />
            {illustration.animated ? (
              <Lottie
                animationData={heroIllustration.animationData}
                className="relative z-10 mx-auto max-w-md"
                loop
              />
            ) : (
              <img
                alt="Engineer illustration"
                className="relative z-10 mx-auto max-w-md"
                src={heroIllustration.fallbackImage}
              />
            )}
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
