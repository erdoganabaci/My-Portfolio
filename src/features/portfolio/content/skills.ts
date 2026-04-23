import type {
  SkillsContent,
  TechStackContent
} from "@/features/portfolio/types";

export const skillsContent: SkillsContent = {
  display: true,
  skills: [
    "Develop highly interactive front end user interfaces for web and mobile applications.",
    "Build progressive web applications for both traditional and SPA stacks.",
    "Integrate third-party services such as Firebase, AWS, and DigitalOcean."
  ],
  softwareSkills: [
    {
      iconKey: "html5",
      skillName: "HTML5"
    },
    {
      iconKey: "css3",
      skillName: "CSS3"
    },
    {
      iconKey: "styled-components",
      skillName: "Styled Components"
    },
    {
      iconKey: "sass",
      skillName: "Sass"
    },
    {
      iconKey: "javascript",
      skillName: "JavaScript"
    },
    {
      iconKey: "react",
      skillName: "React"
    },
    {
      iconKey: "tailwindcss",
      skillName: "Tailwind CSS"
    },
    {
      iconKey: "redux",
      skillName: "Redux"
    },
    {
      iconKey: "rtk-query",
      skillName: "RTK Query"
    },
    {
      iconKey: "micro-frontends",
      skillName: "Micro Frontends"
    },
    {
      iconKey: "vite-module-federation",
      skillName: "Vite Module Federation"
    },
    {
      iconKey: "nodejs",
      skillName: "Node.js"
    },
    {
      iconKey: "npm",
      skillName: "npm"
    },
    {
      iconKey: "database",
      skillName: "SQL"
    },
    {
      iconKey: "aws",
      skillName: "AWS"
    },
    {
      iconKey: "azure",
      skillName: "Azure"
    },
    {
      iconKey: "firebase",
      skillName: "Firebase"
    },
    {
      iconKey: "python",
      skillName: "Python"
    },
    {
      iconKey: "docker",
      skillName: "Docker"
    },
    {
      iconKey: "kubernetes",
      skillName: "Kubernetes"
    }
  ],
  subtitle: "Crazy full stack engineer who wants to explore every tech stack.",
  title: "What I do"
};

export const techStackContent: TechStackContent = {
  display: true,
  experience: [
    {
      label: "React",
      progressPercentage: 90
    },
    {
      label: "TypeScript / JavaScript",
      progressPercentage: 90
    },
    {
      label: "Frontend",
      progressPercentage: 90
    },
    {
      label: "Backend",
      progressPercentage: 80
    },
    {
      label: "DevOps",
      progressPercentage: 90
    },
    {
      label: "Agile Scrum Collaboration",
      progressPercentage: 90
    }
  ]
};
