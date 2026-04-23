import manOnTableIllustration from "@/assets/images/manOnTable.svg";
import standManGreeting from "@/assets/lottie/standManGreeting.json";
import type {HeroContent, IllustrationContent} from "@/features/portfolio/types";

export const illustration: IllustrationContent = {
  animated: true
};

export const heroContent: HeroContent = {
  contactEmail: "erdoganabaci97@gmail.com",
  displayGreeting: true,
  resumeLink:
    "https://drive.google.com/file/d/199bZAPBff4TFPj5uOMn0MbVuR5xBCBmn/view?usp=sharing",
  subtitle:
    "A passionate senior full stack software engineer with experience building web and mobile applications with JavaScript, TypeScript, Python, Java, Kotlin, React, Scala, React Native, Angular, Node.js, GraphQL, Kubernetes, Docker, and other modern tools.",
  title: "Hi all, I'm Erdogan",
  username: "Erdogan ABACI"
};

export const heroIllustration = {
  animationData: standManGreeting,
  fallbackImage: manOnTableIllustration
};
