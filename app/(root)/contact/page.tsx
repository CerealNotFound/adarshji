import { Metadata } from "next";

import PageContainer from "@/components/common/page-container";
import GithubRedirectCard from "@/components/contact/github-redirect-card";
import ResumeRedirectCard from "@/components/contact/resume-redirect-card";
import { ContactForm } from "@/components/forms/contact-form";
import { pagesConfig } from "@/config/pages";

export const metadata: Metadata = {
  title: pagesConfig.contact.metadata.title,
  description: pagesConfig.contact.metadata.description,
};

export default function ContactPage() {
  return (
    <PageContainer
      title={pagesConfig.contact.title}
      description={pagesConfig.contact.description}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[50%]">
          <ContactForm />
        </div>
        <div className="w-full lg:w-[50%] flex justify-center">
          <ResumeRedirectCard />
        </div>
      </div>
    </PageContainer>
  );
}
