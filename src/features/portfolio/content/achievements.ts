import codeInLogo from "@/assets/images/codeInLogo.webp";
import googleAssistantLogo from "@/assets/images/googleAssistantLogo.webp";
import pwaLogo from "@/assets/images/pwaLogo.webp";
import type {AchievementContent} from "@/features/portfolio/types";

export const achievementContent: AchievementContent = {
  achievementsCards: [
    {
      footerLink: [
        {
          name: "Certification",
          url: "https://drive.google.com/file/d/0B7kazrtMwm5dYkVvNjdNWjNybWJrbndFSHpNY2NFV1p4YmU0/view?usp=sharing"
        },
        {
          name: "Award Letter",
          url: "https://drive.google.com/file/d/0B7kazrtMwm5dekxBTW5hQkg2WXUyR3QzQmR0VERiLXlGRVdF/view?usp=sharing"
        },
        {
          name: "Google Code-in Blog",
          url: "https://opensource.googleblog.com/2019/01/google-code-in-2018-winners.html"
        }
      ],
      image: codeInLogo,
      subtitle:
        "First Pakistani selected as a Google Code-in finalist from 4,000 students across 77 countries.",
      title: "Google Code-In Finalist"
    },
    {
      footerLink: [
        {
          name: "View Google Assistant Action",
          url: "https://assistant.google.com/services/a/uid/000000100ee688ee?hl=en"
        }
      ],
      image: googleAssistantLogo,
      subtitle:
        "Developed a Google Assistant Action called JavaScript Guru available on billions of devices worldwide.",
      title: "Google Assistant Action"
    },
    {
      footerLink: [
        {
          name: "Certification",
          url: ""
        },
        {
          name: "Final Project",
          url: "https://pakistan-olx-1.firebaseapp.com/"
        }
      ],
      image: pwaLogo,
      subtitle: "Completed certification from SMIT for PWA web app development.",
      title: "PWA Web App Engineer"
    }
  ],
  display: false,
  subtitle:
    "Achievements, certifications, award letters, and some cool work completed along the way.",
  title: "Achievements and Certifications 🏆"
};
