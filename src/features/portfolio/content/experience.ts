import asBuiltLogo from "@/assets/images/asbuilt.png";
import pluxboxLogo from "@/assets/images/pluxboxIcon.jpeg";
import sentigrateLogo from "@/assets/images/sentigrate.jpeg";
import turkTelekomLogo from "@/assets/images/turkTelekomIcon.png";
import vestelLogo from "@/assets/images/vestel.png";
import type {ExperienceContent} from "@/features/portfolio/types";

export const experienceContent: ExperienceContent = {
  display: true,
  experience: [
    {
      accentColor: "#0f766e",
      company: "AsBuilt",
      companyLogo: asBuiltLogo,
      date: "Sep 2023 - Present",
      desc:
        "Developing a digital drawing web application for the electrical sector, with a focus on situation plans, circuit tables, and wire schemas.",
      descBullets: [
        "Built an export flow for complex Leaflet diagrams with seamless PDF generation.",
        "Developed an intuitive tree dropdown for smooth component navigation.",
        "Upgraded drawing tools to support more complex electrical schemas.",
        "Optimized single-line diagram generation with a refined recursive algorithm.",
        "Enforced AREI-compliant validation for electrical components.",
        "Streamlined requirement analysis to deliver clean, efficient solutions."
      ],
      role: "Senior Software Engineer"
    },
    {
      accentColor: "#b45309",
      company: "Sentigrate",
      companyLogo: sentigrateLogo,
      date: "Sep 2022 - Jun 2023",
      desc:
        "Developed software solutions in the health and wellness industry, focusing on data visualization and frontend development.",
      descBullets: [
        "Worked on Ecoterian, a meal planning app.",
        "Developed MyHabeat, a fitness planning application.",
        "Contributed to Inovigate, a patient data visualization platform.",
        "Implemented frontend solutions using React, Angular, and TypeScript.",
        "Used Git, Bitbucket, and Jira for version control and project management."
      ],
      role: "Software Engineer"
    },
    {
      accentColor: "#1d4ed8",
      company: "Turk Telekom",
      companyLogo: turkTelekomLogo,
      date: "Feb 2021 - Sep 2023",
      desc:
        "Visualized data on maps in the R&D department of Turkey's largest telecommunications company.",
      descBullets: [
        "Frontend stack: custom React, TypeScript, JavaScript, Storybook, and Leaflet.",
        "Version control: GitLab."
      ],
      role: "Software Engineer"
    },
    {
      accentColor: "#7c3aed",
      company: "Pluxbox",
      companyLogo: pluxboxLogo,
      date: "Sep 2020 - Feb 2021",
      desc:
        "Worked in a highly motivated team building a SaaS platform with Kubernetes microservices, using TypeScript, JavaScript, GraphQL, Docker, Jira, Git, and Bitbucket while developing and maintaining tools for radio stations.",
      role: "Software Engineer Intern"
    },
    {
      accentColor: "#be123c",
      company: "Vestel",
      companyLogo: vestelLogo,
      date: "Mar 2020 - Jun 2020",
      desc:
        "Developed an Android test application at one of Turkey's largest industrial companies.",
      role: "Software Engineer Intern"
    }
  ]
};
