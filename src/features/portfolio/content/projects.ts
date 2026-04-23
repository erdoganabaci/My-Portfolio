import nextuLogo from "@/assets/images/nextuLogo.webp";
import saayaHealthLogo from "@/assets/images/saayaHealthLogo.webp";
import type {BigProjectsContent} from "@/features/portfolio/types";

export const bigProjectsContent: BigProjectsContent = {
  display: false,
  projects: [
    {
      footerLink: [
        {
          name: "Visit Website",
          url: "http://saayahealth.com/"
        }
      ],
      image: saayaHealthLogo,
      projectDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      projectName: "Saayahealth"
    },
    {
      footerLink: [
        {
          name: "Visit Website",
          url: "http://nextu.se/"
        }
      ],
      image: nextuLogo,
      projectDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      projectName: "Nextu"
    }
  ],
  subtitle: "Some startups and companies that I helped to create their tech.",
  title: "Big Projects"
};
