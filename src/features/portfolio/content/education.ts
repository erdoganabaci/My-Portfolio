import mcbuLogo from "@/assets/images/mcbu.png";
import vubLogo from "@/assets/images/vub.png";
import type {EducationContent} from "@/features/portfolio/types";

export const educationContent: EducationContent = {
  display: true,
  schools: [
    {
      duration: "September 2022 - September 2025",
      logo: vubLogo,
      schoolName: "Vrije Universiteit Brussel",
      subHeader: "Master of Science - MS, Computer Science / GPA 3.3/4"
    },
    {
      desc: "Participated in an Erasmus Plus internship in the Netherlands.",
      descBullets: [
        "Completed the bachelor degree with a certificate of honor."
      ],
      duration: "September 2016 - June 2020",
      logo: mcbuLogo,
      schoolName: "Manisa Celal Bayar University",
      subHeader: "Bachelor of Science in Computer Science / GPA 3.24/4"
    }
  ]
};
