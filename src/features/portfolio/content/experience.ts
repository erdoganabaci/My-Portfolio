import asBuiltLogo from "@/assets/images/asbuilt.png";
import pluxboxLogo from "@/assets/images/pluxboxIcon.jpeg";
import sentigrateLogo from "@/assets/images/sentigrate.jpeg";
import turkTelekomLogo from "@/assets/images/turkTelekomIcon.png";
import type {ExperienceContent} from "@/features/portfolio/types";

export const experienceContent: ExperienceContent = {
  display: true,
  experience: [
    {
      accentColor: "#7c3aed",
      company: "MonaGen",
      date: "Jan 2026 - Present",
      desc:
        "Founded an AI image generation platform for prompt-based image creation, background removal, headshots, and photo restoration.",
      location: "Brussels, Belgium",
      role: "Founder",
      websiteUrl: "https://monagenie.com/",
      techStack: [
        "Cloud Functions",
        "Node.js",
        "React Native",
        "Tailwind",
        "Vertex AI",
        "Firebase",
        "Supabase"
      ]
    },
    {
      accentColor: "#0f766e",
      company: "AuroraChatPDF",
      date: "Dec 2025 - Present",
      desc:
        "Founded an AI PDF assistant for multi-PDF chat, smart document grouping, and AI-powered document Q&A.",
      location: "Brussels, Belgium",
      role: "Founder",
      websiteUrl: "https://auroragenie.com/",
      techStack: [
        "Cloud Functions",
        "Node.js",
        "React Native",
        "Tailwind",
        "Vector DB",
        "LangChain",
        "Text Embeddings",
        "Firebase",
        "Supabase"
      ]
    },
    {
      accentColor: "#0f766e",
      company: "ZAIA",
      date: "Apr 2025 - Present",
      desc:
        "Building a reliable and personalized GenAI workspace for multiple organizations.",
      descBullets: [
        "Owned frontend architecture for AI workflow features, including state management, API integration, validation, and maintainability.",
        "Integrated OpenAI, Mistral, Llama, and Anthropic under one unified interface for scalable AI workflows.",
        "Reduced duplicate AI workflow setup by 50% with reusable task templates and micro-frontend architecture.",
        "Automated production-ready deployment with GitHub Actions CI/CD on Azure."
      ],
      location: "Antwerp, Belgium",
      role: "Senior Software Engineer",
      techStack: [
        "React",
        "TypeScript",
        "RTK Query",
        "Redux",
        "Zod",
        "Azure",
        "GitHub Actions",
        "OpenAI",
        "Mistral",
        "Llama",
        "Anthropic"
      ]
    },
    {
      accentColor: "#14532d",
      company: "AsBuilt",
      companyLogo: asBuiltLogo,
      date: "Sep 2023 - Mar 2025",
      desc: "Digital drawing web application for the electrical sector.",
      descBullets: [
        "Led implementation of the diagram export workflow from technical design through testing and production delivery.",
        "Built Leaflet-based PDF export and recursive diagram generation, reducing export time from 2 minutes to 10 seconds.",
        "Added AREI-compliant Zod validation, reducing validation-related export errors by 100% and supporting on-demand diagram/document generation."
      ],
      location: "Brussels, Belgium",
      role: "Senior Software Engineer",
      techStack: ["React", "TypeScript", "Jotai", "Vitest", "Zod", "Leaflet"]
    },
    {
      accentColor: "#b45309",
      company: "Sentigrate",
      companyLogo: sentigrateLogo,
      date: "Sep 2022 - Jun 2023",
      desc:
        "Developed health and wellness features for Ecoterian, MyHabeat, and Inovigate, including meal planning, fitness planning, and patient data visualization.",
      descBullets: [
        "Built reusable frontend modules and data visualization screens.",
        "Worked in an Agile environment with Git, Bitbucket, and JIRA to deliver maintainable product features."
      ],
      location: "Leuven, Belgium",
      role: "Software Engineer",
      techStack: [
        "React",
        "Angular",
        "TypeScript",
        "JavaScript",
        "Flutter",
        "Git",
        "Bitbucket",
        "JIRA"
      ]
    },
    {
      accentColor: "#1d4ed8",
      company: "Turk Telekom",
      companyLogo: turkTelekomLogo,
      date: "Feb 2021 - Sep 2023",
      desc: "Map-based telecom data visualization for Turk Telekom R&D.",
      descBullets: [
        "Developed interactive telecom map visualizations using React, TypeScript, Redux, and Leaflet.",
        "Visualized 81M location data points and improved map rendering performance by 90%.",
        "Owned testing strategy for complex map and chart interactions, increasing E2E coverage to 95% with Cypress and Jest."
      ],
      location: "Istanbul, Turkey",
      role: "Software Engineer",
      techStack: ["React", "TypeScript", "Redux", "Leaflet", "Cypress", "Jest"]
    },
    {
      accentColor: "#7c3aed",
      company: "Pluxbox",
      companyLogo: pluxboxLogo,
      date: "Sep 2020 - Feb 2021",
      desc:
        "Creating commercial-grade software solutions and developing radio system engine interfaces using Kubernetes microservice architecture.",
      location: "Hilversum - Utrecht, Netherlands",
      role: "Full Stack Engineer",
      techStack: [
        "Web Components",
        "TypeScript",
        "GraphQL",
        "MongoDB",
        "Docker",
        "Kubernetes"
      ]
    }
  ]
};
