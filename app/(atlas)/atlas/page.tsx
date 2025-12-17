import { Icons } from "@/components/common/icons";
import { FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AtlasPage() {
  const resumeLink = process.env.NEXT_PUBLIC_RESUME_LINK || "/resume";
  
  const socialLinks = [
    {
      name: "Portfolio",
      link: "/",
      icon: Icons.sparkles,
    },
    {
      name: "X",
      link: "https://x.com/CerealFound",
      icon: Icons.twitter,
    },
    {
      name: "WhatsApp",
      link: "https://wa.me/919810896646",
      icon: Icons.whatsapp,
    },
    {
      name: "Instagram",
      link: "https://www.instagram.com/cerealnotfound",
      icon: Icons.instagram,
    },
    {
      name: "LinkedIn",
      link: "https://www.linkedin.com/in/adarshji",
      icon: Icons.linkedin,
    },
    {
      name: "GitHub",
      link: "https://github.com/CerealNotFound",
      icon: Icons.gitHub,
    },
    {
      name: "Gmail",
      link: "https://mail.google.com/mail/?view=cm&fs=1&to=theadarshpandey17@gmail.com",
      icon: Icons.gmail,
    },
    {
      name: "Resume",
      link: resumeLink,
      icon: Icons.paper,
    },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center py-8 px-4">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Overlay for better text contrast */}
      </div>
      <div className="w-full max-w-[600px] flex flex-col gap-12 sm:gap-20">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 mt-4 sm:mt-10">
          {/* Profile Image */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-2 ring-primary/20">
            <Image
              src="/atlas-pfp.jpeg"
              alt="Adarsh Pandey"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Name and Title */}
          <div className="font-sans text-center">
            <div className="text-foreground font-bold text-lg sm:text-xl">
              @adarshpandey
            </div>
            <div className="text-muted-foreground text-sm sm:text-base mt-1">
              software engineer | ai
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 pb-8">
          {socialLinks.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className="w-full sm:w-3/4 group"
              >
                <div className="flex items-center h-14 sm:h-16 justify-between rounded-full border border-border/50 px-4 sm:px-6 w-full bg-card/30 backdrop-blur-sm hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md">
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-foreground group-hover:text-primary transition-colors" />
                  <div className="text-foreground text-sm sm:text-base font-medium group-hover:text-primary transition-colors">
                    {item.name}
                  </div>
                  <div className="w-6 sm:w-7" /> {/* Spacer for balance */}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
