import {SectionHeading} from "@/components/ui/section-heading";
import {SectionShell} from "@/components/ui/section-shell";
import {skillsContent} from "@/features/portfolio/content";
import {SkillIcon} from "@/features/portfolio/components/skill-icon";

export function SkillsSection() {
  if (!skillsContent.display) {
    return null;
  }

  return (
    <SectionShell id="skills">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <SectionHeading
            eyebrow="Core Strengths"
            subtitle={skillsContent.subtitle}
            title={skillsContent.title}
          />
          <ul className="mt-8 space-y-4">
            {skillsContent.skills.map(skill => (
              <li
                className="rounded-[1.5rem] border border-slate-200/80 bg-white/70 px-5 py-4 text-base leading-7 text-slate-700 shadow-[0_18px_45px_-32px_var(--shadow)] dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                key={skill}
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {skillsContent.softwareSkills.map(skill => (
            <SkillIcon
              iconKey={skill.iconKey}
              key={skill.skillName}
              skillName={skill.skillName}
            />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
