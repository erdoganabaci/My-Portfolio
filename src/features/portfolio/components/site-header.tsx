import {FiMoon, FiSun} from "react-icons/fi";
import {LuMessageSquareMore} from "react-icons/lu";
import {Link, NavLink} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {
  achievementContent,
  blogContent,
  githubSectionContent,
  heroContent,
  skillsContent,
  talkContent
} from "@/features/portfolio/content";
import {experienceContent} from "@/features/portfolio/content";
import {useTheme} from "@/features/theme/theme-provider";

const navigationItems = [
  skillsContent.display
    ? {
        href: "#skills",
        label: "Skills"
      }
    : null,
  experienceContent.display
    ? {
        href: "#experience",
        label: "Experience"
      }
    : null,
  githubSectionContent.display
    ? {
        href: "#opensource",
        label: "Open Source"
      }
    : null,
  achievementContent.display
    ? {
        href: "#achievements",
        label: "Achievements"
      }
    : null,
  blogContent.display
    ? {
        href: "#blogs",
        label: "Blogs"
      }
    : null,
  talkContent.display
    ? {
        href: "#talks",
        label: "Talks"
      }
    : null,
  {
    href: "#contact",
    label: "Contact"
  }
].filter(Boolean) as Array<{href: string; label: string}>;

export function SiteHeader() {
  const {isDark, toggleTheme} = useTheme();

  return (
    <header className="sticky top-4 z-40">
      <div className="rounded-[2rem] border border-white/50 bg-[var(--surface)] px-4 py-3 shadow-[0_20px_60px_-40px_var(--shadow)] backdrop-blur-xl sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link className="group inline-flex items-center gap-2" to="/">
              <span className="font-['Agustina_Regular'] text-3xl text-emerald-900 dark:text-emerald-200">
                &lt;{heroContent.username}/&gt;
              </span>
            </Link>
            <button
              aria-label="Toggle color theme"
              className="inline-flex size-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-700 transition hover:border-emerald-500 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-emerald-300 dark:hover:text-white lg:hidden"
              onClick={toggleTheme}
              type="button"
            >
              {isDark ? <FiSun className="size-5" /> : <FiMoon className="size-5" />}
            </button>
          </div>

          <nav aria-label="Primary" className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex flex-wrap gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              {navigationItems.map(item => (
                <a
                  className="rounded-full px-3 py-2 transition hover:bg-white/75 hover:text-slate-950 dark:hover:bg-white/10 dark:hover:text-white"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <NavLink to="/chat">
                <Button className="w-full sm:w-auto" variant="secondary">
                  <LuMessageSquareMore className="size-4" />
                  Chat
                </Button>
              </NavLink>
              <button
                aria-label="Toggle color theme"
                className="hidden size-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-700 transition hover:border-emerald-500 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-emerald-300 dark:hover:text-white lg:inline-flex"
                onClick={toggleTheme}
                type="button"
              >
                {isDark ? (
                  <FiSun className="size-5" />
                ) : (
                  <FiMoon className="size-5" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
