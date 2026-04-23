export type SkillIconKey =
  | "aws"
  | "azure"
  | "css3"
  | "database"
  | "docker"
  | "firebase"
  | "html5"
  | "javascript"
  | "kubernetes"
  | "micro-frontends"
  | "nodejs"
  | "npm"
  | "python"
  | "react"
  | "redux"
  | "rtk-query"
  | "sass"
  | "styled-components"
  | "tailwindcss"
  | "vite-module-federation";

export type SocialPlatformKey =
  | "email"
  | "github"
  | "linkedin"
  | "twitter";

export type SocialLink = {
  href: string;
  label: string;
  platform: SocialPlatformKey;
};

export type HeroContent = {
  contactEmail: string;
  displayGreeting: boolean;
  resumeLink: string;
  subtitle: string;
  title: string;
  username: string;
};

export type IllustrationContent = {
  animated: boolean;
};

export type SkillsContent = {
  display: boolean;
  skills: string[];
  softwareSkills: Array<{
    iconKey: SkillIconKey;
    skillName: string;
  }>;
  subtitle: string;
  title: string;
};

export type TechStackContent = {
  display: boolean;
  experience: Array<{
    label: string;
    progressPercentage: number;
  }>;
};

export type EducationEntry = {
  desc?: string;
  descBullets?: string[];
  duration: string;
  logo: string;
  schoolName: string;
  subHeader: string;
};

export type EducationContent = {
  display: boolean;
  schools: EducationEntry[];
};

export type ExperienceEntry = {
  accentColor: string;
  company: string;
  companyLogo?: string;
  date: string;
  desc: string;
  descBullets?: string[];
  location?: string;
  role: string;
  techStack?: string[];
};

export type ExperienceContent = {
  display: boolean;
  experience: ExperienceEntry[];
};

export type ProjectLink = {
  name: string;
  url: string;
};

export type BigProjectEntry = {
  footerLink: ProjectLink[];
  image: string;
  projectDesc: string;
  projectName: string;
};

export type BigProjectsContent = {
  display: boolean;
  projects: BigProjectEntry[];
  subtitle: string;
  title: string;
};

export type AchievementCard = {
  footerLink: ProjectLink[];
  image: string;
  subtitle: string;
  title: string;
};

export type AchievementContent = {
  achievementsCards: AchievementCard[];
  display: boolean;
  subtitle: string;
  title: string;
};

export type BlogEntry = {
  description: string;
  title: string;
  url: string;
};

export type BlogContent = {
  blogs: BlogEntry[];
  display: boolean;
  subtitle: string;
  title: string;
};

export type TalkEntry = {
  eventUrl: string;
  slidesUrl: string;
  subtitle: string;
  title: string;
};

export type TalkContent = {
  display: boolean;
  subtitle: string;
  talks: TalkEntry[];
  title: string;
};

export type PodcastContent = {
  display: boolean;
  podcast: string[];
  subtitle: string;
  title: string;
};

export type ContactContent = {
  emailAddress: string;
  number: string;
  subtitle: string;
  title: string;
};

export type GithubSectionContent = {
  display: boolean;
  showGithubProfile: boolean;
};
