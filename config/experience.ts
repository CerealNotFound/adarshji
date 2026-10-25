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
    position: "Lead Engineer",
    company: "SingleBit",
    location: "India",
    startDate: new Date("2024-10-01"),
    endDate: "Present",
    description: [
      "Lead the engineering on SingleBit's client and partner products, from first architecture call to production.",
      "Own systems end to end: backend APIs, data models, infrastructure, AI pipelines, and the frontends on top.",
      "Lead engineer on Thnkrr, a partner company: a professional network for high-school students, built to be safe and compliant from the architecture up.",
    ],
    achievements: [
      "Thnkrr: architected and built the platform rebuild (Fastify + TypeScript API, Postgres with Drizzle, React 19 + Vite SPA) across 220+ commits, with student, mentor, and educator roles.",
      "Thnkrr: designed pre-publication AI moderation, where every post and message is checked before anyone sees it. Models run on Amazon Bedrock with retention locked off, plus a human review queue.",
      "Thnkrr: built guardian-consent onboarding verified by schools, and privacy controls designed around COPPA, FERPA, and India's DPDP.",
      "Thnkrr: benchmarked search and load at pilot scale (9,000 students, 700 mentors, 300 educators) to size production infrastructure on AWS before the first school.",
      "Built agentic production pipelines, including an ads factory that turns raw footage and scripts into finished vertical ads, with Claude Code as the orchestrator.",
      "Delivered OneTap: a web app, an Electron + Overwolf desktop companion with real-time Valorant integration, and an admin dashboard.",
      "Built HospiHealth: a client site with blog publishing, a job portal, admin tooling, and automated PDF resume generation.",
    ],
    skills: [
      "Typescript",
      "Fastify",
      "PostgreSQL",
      "Drizzle",
      "React",
      "Vite",
      "AWS",
      "AWS Bedrock",
      "Claude Code",
      "Remotion",
      "Next.js",
      "Node.js",
      "Electron",
      "Overwolf",
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
