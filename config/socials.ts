import { Icons } from "@/components/common/icons";

interface SocialInterface {
  name: string;
  username: string;
  icon: any;
  link: string;
}

const resumeLink = process.env.NEXT_PUBLIC_RESUME_LINK || "/";

export const SocialLinks: SocialInterface[] = [
  {
    name: "Github",
    username: "@CerealNotFound",
    icon: Icons.gitHub,
    link: "https://github.com/CerealNotFound",
  },
  {
    name: "LinkedIn",
    username: "Adarsh Pandey",
    icon: Icons.linkedin,
    link: "https://www.linkedin.com/in/adarshji",
  },
  {
    name: "Gmail",
    username: "theadarshpandey17",
    icon: Icons.gmail,
    link: "mailto:theadarshpandey17@gmail.com",
  },
  {
    name: "Resume",
    username: "Resume",
    icon: Icons.paper,
    link: resumeLink,
  },
];
