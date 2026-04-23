import {FaLinkedinIn, FaXTwitter} from "react-icons/fa6";
import {MdOutlineMail} from "react-icons/md";
import {SiGithub} from "react-icons/si";
import {socialLinks} from "@/features/portfolio/content";
import type {SocialPlatformKey} from "@/features/portfolio/types";

const iconMap: Record<SocialPlatformKey, (className: string) => React.JSX.Element> = {
  email: className => <MdOutlineMail className={className} />,
  github: className => <SiGithub className={className} />,
  linkedin: className => <FaLinkedinIn className={className} />,
  twitter: className => <FaXTwitter className={className} />
};

type SocialLinksProps = {
  className?: string;
};

export function SocialLinks({className = ""}: SocialLinksProps) {
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`.trim()}>
      {socialLinks.map(link => {
        const renderIcon = iconMap[link.platform];

        return (
          <li key={link.platform}>
            <a
              className="inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-emerald-300 dark:hover:text-white"
              href={link.href}
              rel="noreferrer"
              target="_blank"
            >
              {renderIcon("size-4")}
              <span>{link.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
