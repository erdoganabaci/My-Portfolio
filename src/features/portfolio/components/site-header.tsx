import {useEffect, useId, useState} from "react";
import {FiMenu, FiMoon, FiSun, FiX} from "react-icons/fi";
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

const desktopNavigationQuery = "(min-width: 1024px)";

function getIsDesktopNavigation() {
  if (typeof window === "undefined" || !("matchMedia" in window)) {
    return true;
  }

  return window.matchMedia(desktopNavigationQuery).matches;
}

export function SiteHeader() {
  const {isDark, toggleTheme} = useTheme();
  const [isDesktopNavigation, setIsDesktopNavigation] = useState(
    getIsDesktopNavigation
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigationId = useId();

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) {
      return;
    }

    const mediaQuery = window.matchMedia(desktopNavigationQuery);
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsDesktopNavigation(event.matches);

      if (event.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const isNavigationVisible = isDesktopNavigation || isMobileMenuOpen;
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-4 z-40">
      <div className="rounded-[2rem] border border-white/50 bg-[var(--surface)] px-4 py-3 shadow-[0_20px_60px_-40px_var(--shadow)] backdrop-blur-xl sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link
              className="group inline-flex min-w-0 items-center gap-2"
              onClick={closeMobileMenu}
              to="/"
            >
              <span className="max-w-[14rem] truncate font-['Agustina_Regular'] text-[2.1rem] leading-none text-emerald-900 dark:text-emerald-200 sm:max-w-none sm:text-3xl">
                &lt;{heroContent.username}/&gt;
              </span>
            </Link>
            <div className="flex items-center gap-2 lg:hidden">
              <button
                aria-label="Toggle color theme"
                className="inline-flex size-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-700 transition hover:border-emerald-500 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-emerald-300 dark:hover:text-white"
                onClick={toggleTheme}
                type="button"
              >
                {isDark ? <FiSun className="size-5" /> : <FiMoon className="size-5" />}
              </button>
              {!isDesktopNavigation ? (
                <button
                  aria-controls={navigationId}
                  aria-expanded={isNavigationVisible}
                  aria-label={
                    isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
                  }
                  className="inline-flex size-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-700 transition hover:border-emerald-500 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-emerald-300 dark:hover:text-white"
                  onClick={() => setIsMobileMenuOpen(open => !open)}
                  type="button"
                >
                  {isMobileMenuOpen ? (
                    <FiX className="size-5" />
                  ) : (
                    <FiMenu className="size-5" />
                  )}
                </button>
              ) : null}
            </div>
          </div>

          {isNavigationVisible ? (
            <nav
              aria-label="Primary"
              className={
                isDesktopNavigation
                  ? "flex flex-col gap-3 lg:flex-row lg:items-center"
                  : "rounded-[1.5rem] border border-white/10 bg-slate-950/5 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:bg-white/5"
              }
              id={navigationId}
            >
              <div
                className={
                  isDesktopNavigation
                    ? "flex flex-wrap gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                    : "grid grid-cols-2 gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                }
              >
                {navigationItems.map((item, index) => {
                  const isLastOddItem =
                    !isDesktopNavigation &&
                    navigationItems.length % 2 === 1 &&
                    index === navigationItems.length - 1;

                  return (
                    <a
                      className={
                        isDesktopNavigation
                          ? "rounded-full px-3 py-2 whitespace-nowrap transition hover:bg-white/75 hover:text-slate-950 dark:hover:bg-white/10 dark:hover:text-white"
                          : `inline-flex min-h-11 items-center justify-center rounded-[1rem] border border-slate-200/80 bg-white/70 px-3 py-3 text-center shadow-sm transition hover:border-emerald-500 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-300 dark:hover:text-white ${
                              isLastOddItem ? "col-span-2" : ""
                            }`
                      }
                      href={item.href}
                      key={item.href}
                      onClick={!isDesktopNavigation ? closeMobileMenu : undefined}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
              <div
                className={
                  isDesktopNavigation
                    ? "flex items-center gap-2"
                    : "mt-3 flex flex-col gap-2 border-t border-white/10 pt-3"
                }
              >
                <NavLink
                  onClick={!isDesktopNavigation ? closeMobileMenu : undefined}
                  to="/chat"
                >
                  <Button
                    className={
                      isDesktopNavigation ? "w-full sm:w-auto" : "w-full justify-center"
                    }
                    variant="secondary"
                  >
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
          ) : null}
        </div>
      </div>
    </header>
  );
}
