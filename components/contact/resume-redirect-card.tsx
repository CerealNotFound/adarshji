"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ResumeRedirectCard() {
  const [isHovered, setIsHovered] = useState(false);
  const resumeLink = process.env.NEXT_PUBLIC_RESUME_LINK || "/";

  return (
    <Card
      className="w-full h-fit max-w-sm overflow-hidden shadow-lg transition-all duration-300 ease-in-out transform hover:scale-102 mt-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-8 flex flex-col items-center text-center">
        <div className="mb-6">
          <Sparkles
            className={`w-12 h-12 transition-colors duration-300 ease-out ${
              isHovered ? "text-white" : "text-muted-foreground"
            }`}
          />
        </div>
        <h2 className="font-heading text-xl tracking-tight lg:text-3xl duration-300">
          View My Resume
        </h2>
        <p className="mt-2 mb-10 font-heading text-lg text-muted-foreground">
          Check out my professional experience and qualifications.
        </p>
      </CardContent>
      <CardFooter className="px-8 pb-8 pt-0">
        <Link
          href={resumeLink}
          target="_blank"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full bg-transparent border-2 transition-all duration-300 py-6"
          )}
        >
          <span className="mr-2">View Resume</span>
          <ExternalLink className="w-5 h-5" />
        </Link>
      </CardFooter>
      <div
        className={`h-1 bg-white transition-all duration-300 ease-out ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      ></div>
    </Card>
  );
}
