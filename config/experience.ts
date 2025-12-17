import { ValidSkills } from "./constants";

export interface ExperienceInterface {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: Date;
  endDate: Date | "Present";
  description: string[];
  achievements: string[];
  skills: ValidSkills[];
  companyUrl?: string;
  logo?: string;
}

export const experiences: ExperienceInterface[] = [
  {
    id: "singlebit",
    position: "Software Engineer",
    company: "SingleBit",
    location: "India",
    startDate: new Date("2024-10-01"),
    endDate: "Present",
    description: [
      "Delivered multiple client-facing full-stack applications in a fast-paced agency environment.",
      "Owned end-to-end feature development across frontend, backend APIs, database design, and admin tooling.",
      "Worked closely with client requirements to ship reliable, maintainable systems under production constraints.",
    ],
    achievements: [
      "Delivered OneTap, a production-grade engagement platform featuring a web app, Electron desktop companion, admin dashboard, and real-time Valorant integration via Overwolf.",
      "Built HospiHealth, a full-stack client website with blog publishing, job portal workflows, and administrative tooling.",
      "Implemented secure authentication, pagination, and performance optimizations across both user-facing and admin interfaces.",
      "Designed and built admin workflows for content management, job postings, and structured data export.",
      "Implemented an automated resume-generation pipeline converting structured applicant data into professionally formatted PDF resumes.",
    ],
    skills: [
      "Typescript",
      "Next.js",
      "React",
      "Redux",
      "Node.js",
      "Supabase",
      "Electron",
      "Overwolf",
      "Tailwind CSS",
      "ShadCN UI",
    ],
    companyUrl: "https://singlebit.xyz",
    logo: "/experience/singlebit-logo.png",
  },
  {
    id: "problem-solvers",
    position: "Software Development Intern",
    company: "Problem Solvers LLP",
    location: "Pune, India",
    startDate: new Date("2025-06-29"),
    endDate: new Date("2025-07-29"),
    description: [
      "Worked on a short-term, focused engagement to build a multi-model AI access platform providing unified access to 400+ language models via a single interface.",
      "Designed backend systems for usage tracking, credit-based billing, and concurrent model execution.",
      "Contributed across the full stack, including backend services, database design, and frontend feature development.",
    ],
    achievements: [
      "Built a wrapper platform over OpenRouter enabling access to 400+ AI models through a unified API and UI.",
      "Implemented a credit-based usage system that dynamically calculated and deducted credits based on per-request model costs.",
      "Designed and implemented concurrent execution pipelines allowing up to six AI model requests in parallel, with support for focused single-model interactions.",
      "Implemented persistent chat history and conversation management across sessions.",
      "Integrated DodoPayments to enable secure payments and credit top-ups.",
      "Migrated backend services from Next.js API routes to FastAPI, improving performance, scalability, and separation of concerns.",
      "Added full Markdown rendering support for AI responses to enhance readability and user experience.",
    ],
    skills: [
      "Typescript",
      "Next.js",
      "Python",
      "FastAPI",
      "Supabase",
      "DodoPayments",
    ],
    companyUrl: "https://joinmultibrain.com",
    logo: "/experience/multibrain-logo.png",
  },
  {
    id: "agentprod",
    position: "Software Development Intern",
    company: "AgentProd LLP",
    location: "Bengaluru, India",
    startDate: new Date("2023-12-01"),
    endDate: new Date("2024-09-30"),
    description: [
      "Contributed to the frontend and backend development of an agentic CRM platform, focusing on lead discovery, enrichment, and data synchronization.",
      "Worked on building agentic tools leveraging the Assistants API for automating workflows within Google Workspace.",
      "Built and integrated multiple third-party services to streamline CRM workflows and reduce dependency on paid enrichment providers.",
    ],
    achievements: [
      "Developed agentic tooling for Google Sheets using the Assistants API, enabling automated data manipulation and assisted workflows.",
      "Implemented Apollo-based lead search and enrichment within the CRM, handling frontend integration in Next.js and backend services in FastAPI.",
      "Designed and built backend enrichment pipelines using ScrapingBee to augment lead data from public sources, reducing reliance on paid Apollo enrichment APIs.",
      "Integrated external CRMs including Zoho CRM and Pipedrive, enabling bi-directional synchronization of leads and associated metadata.",
      "Implemented domain availability and management features using registrar APIs, allowing users to check domain availability and configure DNS records directly from the platform.",
    ],
    skills: ["Typescript", "Next.js", "Python", "FastAPI", "Assistants API"],
    companyUrl: "https://agentprod.com",
    logo: "/experience/agentprod-logo.png",
  },
];
