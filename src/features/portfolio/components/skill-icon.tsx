import {
  FaAws,
  FaCss3Alt,
  FaDocker,
  FaHtml5,
  FaJs,
  FaNodeJs,
  FaNpm,
  FaPython,
  FaReact,
  FaSass
} from "react-icons/fa6";
import {TbDatabase} from "react-icons/tb";
import {SiFirebase, SiKubernetes} from "react-icons/si";
import {TbBrackets} from "react-icons/tb";
import type {SkillIconKey} from "@/features/portfolio/types";

const iconMap: Record<SkillIconKey, (className: string) => React.JSX.Element> = {
  aws: className => <FaAws className={className} />,
  css3: className => <FaCss3Alt className={className} />,
  database: className => <TbDatabase className={className} />,
  docker: className => <FaDocker className={className} />,
  firebase: className => <SiFirebase className={className} />,
  html5: className => <FaHtml5 className={className} />,
  javascript: className => <FaJs className={className} />,
  kubernetes: className => <SiKubernetes className={className} />,
  nodejs: className => <FaNodeJs className={className} />,
  npm: className => <FaNpm className={className} />,
  python: className => <FaPython className={className} />,
  react: className => <FaReact className={className} />,
  sass: className => <FaSass className={className} />,
  "styled-components": className => <TbBrackets className={className} />
};

type SkillIconProps = {
  iconKey: SkillIconKey;
  skillName: string;
};

export function SkillIcon({iconKey, skillName}: SkillIconProps) {
  const renderIcon = iconMap[iconKey];

  return (
    <div className="group rounded-[1.5rem] border border-slate-200/80 bg-white/70 p-4 text-center shadow-[0_18px_45px_-32px_var(--shadow)] transition hover:-translate-y-1 hover:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-300">
      {renderIcon(
        "mx-auto size-8 text-emerald-800 transition group-hover:scale-110 dark:text-emerald-300"
      )}
      <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">
        {skillName}
      </p>
    </div>
  );
}
