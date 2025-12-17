import { ValidCategory, ValidExpType, ValidSkills } from "./constants";

interface PagesInfoInterface {
  title: string;
  imgArr: string[];
  description?: string;
}

interface DescriptionDetailsInterface {
  paragraphs: string[];
  bullets: string[];
}

export interface ProjectInterface {
  id: string;
  type: ValidExpType;
  companyName: string;
  category: ValidCategory[];
  shortDescription: string;
  websiteLink?: string;
  githubLink?: string;
  techStack: ValidSkills[];
  startDate: Date;
  endDate: Date;
  companyLogoImg: any;
  descriptionDetails: DescriptionDetailsInterface;
  pagesInfoArr: PagesInfoInterface[];
}

export const Projects: ProjectInterface[] = [
  {
    id: "erwins-hire-ai",
    companyName: "Erwin's Hire AI",
    type: "Personal",
    category: ["Web Dev", "Full Stack", "AI"],
    shortDescription:
      "AI-powered hiring copilot built in 72 hours - automating resume analysis, voice-based candidate search, AI-driven interviews, and recruiter analytics from end to end.",
    websiteLink: "https://youtu.be/IfJrJku7ZBM",
    githubLink: "https://github.com/CerealNotFound/erwins-hire-ai",
    techStack: ["Next.js", "React", "Typescript", "AWS"],
    startDate: new Date("2024-11-01"),
    endDate: new Date("2024-11-03"),
    companyLogoImg: "/projects/erwins-hire-ai/logo.png",
    pagesInfoArr: [
      {
        title: "Resume Ingestion & Indexing",
        description:
          "Automated resume analysis with private, recruiter-scoped storage and retrieval",
        imgArr: [],
      },
      {
        title: "Candidate Search Interface",
        description:
          "Multi-layered discovery using voice or text across skills, projects, and experience",
        imgArr: [],
      },
      {
        title: "Hiring Campaign Builder",
        description:
          "JD-based campaign creation with configurable interview depth and question count",
        imgArr: [],
      },
      {
        title: "Dynamic Question Generation",
        description:
          "AI-generated, candidate-specific questions spanning fundamentals, systems design, leadership, and standardized culture-fit evaluation",
        imgArr: [],
      },
      {
        title: "AI Interview System",
        description:
          "Voice-based interviews via an AI avatar with timestamped response capture",
        imgArr: [],
      },
      {
        title: "Recruiter Analytics Dashboard",
        description:
          "Live tracking of interview progress, completion rates, and AI-ranked candidate outcomes",
        imgArr: [],
      },
      {
        title: "Deployment & Demo",
        description:
          "Serverless deployment on Vercel, with a recorded demo showcasing the full flow",
        imgArr: [],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Erwin's Hire AI is an AI-powered hiring copilot designed to automate and compress the recruitment pipeline - from resume ingestion to interview evaluation - into a single, cohesive system. The project was conceived, built, and deployed within a 72-hour build window, with a deliberate focus on execution speed, system design, and end-to-end flow.",
        "Recruiters can upload resumes which are automatically analyzed, indexed, and stored in a private datastore, ensuring complete data isolation per recruiter. Candidate discovery is enabled through text and voice-based search, combining semantic understanding with structured signals such as skills, projects, and experience to surface relevant profiles.",
        "Shortlisted candidates are added to hiring campaigns and automatically invited via email using unique interview links. Interviews are conducted by an AI avatar with voice interaction, capturing timestamped responses to support integrity checks and detailed evaluation. Post-interview, AI-driven analysis ranks candidates and can trigger automated follow-up or confirmation emails based on recruiter-defined criteria.",
        "The system was built using Next.js without a dedicated backend to maximize iteration speed, orchestrating multiple AI services - including TTS/STT pipelines and concurrent LLM personas - and deployed as a fully functional demo on Vercel, supported by a walkthrough video.",
      ],
      bullets: [
        "Built an end-to-end AI hiring copilot within a 72-hour time constraint",
        "Implemented secure resume ingestion, private indexing, and candidate isolation per recruiter",
        "Enabled voice and text-based candidate search using semantic and contextual matching",
        "Designed an AI-driven interview system using a talking avatar with real-time voice interaction",
        "Orchestrated multiple specialized AI personas for concurrency, speed, and role-specific reasoning",
        "Deployed and demonstrated a working production-grade prototype on Vercel",
      ],
    },
  },
  {
    id: "onetap",
    companyName: "OneTap",
    type: "Professional",
    category: ["Web Dev", "Full Stack", "UI/UX"],
    shortDescription:
      "Production-grade engagement platform with web app, Electron desktop companion, and admin dashboard - featuring real-time Valorant integration via Overwolf and comprehensive rewards system.",
    websiteLink: "https://www.onetapp.xyz/",
    techStack: ["React", "Node.js", "Redux", "Typescript", "MongoDB"],
    startDate: new Date("2023-06-01"),
    endDate: new Date("2024-05-01"),
    companyLogoImg: "/projects/onetap/logo.png",
    pagesInfoArr: [
      {
        title: "Landing Web Application",
        description:
          "User authentication, points and score tracking, coupon marketplace browsing, and virtual currency spending",
        imgArr: [],
      },
      {
        title: "Desktop Companion App (Electron + Overwolf)",
        description:
          "Real-time data ingestion from Valorant, Redux-driven state management, and API synchronization for challenges and achievements",
        imgArr: [],
      },
      {
        title: "User Progress & Rewards System",
        description:
          "Centralized tracking of user actions, completed challenges, and earned rewards across platforms",
        imgArr: [],
      },
      {
        title: "Admin Panel",
        description:
          "Role-based management of users, coupons, marketplace items, and challenge definitions",
        imgArr: [],
      },
      {
        title: "Backend Architecture",
        description:
          "Monolithic server with clearly separated controllers and DAOs, designed for scalability and future microservices transition",
        imgArr: [],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "OneTap is a production-grade engagement platform built for a real client environment, spanning consumer-facing interfaces, a desktop companion app, and a full administrative control system. The project was designed as a multi-surface product, integrating web, desktop, and backend systems into a single cohesive ecosystem.",
        "The public-facing application handles user authentication, points and score tracking, coupon marketplace interactions, and virtual currency spending. These systems were engineered to be reliable, extensible, and consistent across platforms.",
        "A key component of the project is a desktop application built with Electron and Overwolf, tightly integrated with live game data from Valorant. I designed the data ingestion pipeline and Redux-based state management layer to process real-time events from Overwolf, synchronize user progress, and trigger API updates across the broader platform - including achievements, challenges, and user statistics.",
        "An admin panel completes the system, enabling full CRUD operations over coupons, marketplace items, challenges, and users. All components connect to a monolithic backend structured with modular controllers and DAOs, intentionally architected to allow future migration toward microservices without major refactors.",
      ],
      bullets: [
        "Built and integrated multiple product surfaces: web app, desktop app, and admin dashboard",
        "Implemented authentication, points, rewards, and coupon marketplace logic",
        "Designed Redux-based pipelines for real-time data processing from Overwolf (Valorant)",
        "Synced desktop app events with backend APIs to update user progress and achievements",
        "Developed a full-featured admin panel for operational control and content management",
        "Worked against a modular monolithic backend using controllers and DAOs, structured for future service decomposition",
      ],
    },
  },
  {
  id: "multibrain",
  companyName: "Multibrain",
  type: "Professional",
  category: ["Web Dev", "Full Stack", "AI"],
  shortDescription:
    "Unified multi-model AI platform providing access to 400+ language models with credit-based billing, concurrent execution, chat persistence, and integrated payments.",
  websiteLink: "https://joinmultibrain.com",
  techStack: [
    "Next.js",
    "Typescript",
    "Python",
    "FastAPI",
    "Supabase",
    "DodoPayments"
  ],
  startDate: new Date("2025-06-29"),
  endDate: new Date("2025-07-29"),
  companyLogoImg: "/projects/multibrain/logo.png",
  pagesInfoArr: [
    {
      title: "Multi-Model Chat Interface",
      description:
        "Unified chat interface enabling users to interact with 400+ AI models, with support for persistent chat history and markdown-rendered responses.",
      imgArr: [],
    },
    {
      title: "Concurrent Model Execution",
      description:
        "Parallel execution pipeline allowing up to six AI models to be queried concurrently, with support for focused single-model interactions.",
      imgArr: [],
    },
    {
      title: "Credit-Based Usage & Billing",
      description:
        "Dynamic credit deduction system calculating per-request costs based on model pricing and usage patterns.",
      imgArr: [],
    },
    {
      title: "Payments & Wallet Management",
      description:
        "Integrated payment flow using DodoPayments for secure credit top-ups and usage-based billing.",
      imgArr: [],
    },
    {
      title: "Backend Architecture & Migration",
      description:
        "Backend services migrated from Next.js API routes to FastAPI for improved scalability, performance, and separation of concerns.",
      imgArr: [],
    },
  ],
  descriptionDetails: {
    paragraphs: [
      "Multibrain is a unified AI access platform designed to simplify interaction with a wide range of language models through a single interface. Built as a wrapper over OpenRouter, the system provides structured access to more than 400 models while abstracting away cost management, concurrency, and persistence concerns.",
      "The platform implements a credit-based usage system that dynamically calculates request costs based on model pricing, ensuring transparent and predictable billing for users. To support advanced workflows, the system enables concurrent execution of up to six models in parallel, while also allowing focused single-model interactions when required.",
      "A persistent chat system maintains conversation history across sessions, with full Markdown rendering support for improved readability of model responses. Payments and wallet management are integrated directly into the platform using DodoPayments, enabling seamless credit top-ups and usage tracking.",
      "The backend architecture was migrated from Next.js API routes to FastAPI, improving performance, scalability, and long-term maintainability. Supabase was used for database management, handling user data, conversations, and usage metadata.",
    ],
    bullets: [
      "Built a unified platform providing access to 400+ AI models via OpenRouter",
      "Implemented a credit-based billing system with per-request cost calculation",
      "Designed concurrent execution pipelines supporting up to six parallel model queries",
      "Implemented persistent chat history with Markdown-rendered AI responses",
      "Integrated DodoPayments for secure payments and credit management",
      "Migrated backend services from Next.js to FastAPI for improved scalability and separation of concerns",
    ],
  },
}
,
  {
    id: "cloudcast",
    companyName: "CloudCast",
    type: "Personal",
    category: ["Web Dev", "Full Stack", "AWS"],
    shortDescription:
      "Engineering-first video platform built with Next.js, focusing on infrastructure, security, and scalable media delivery using AWS S3, CloudFront, and Supabase.",
    githubLink: "https://github.com/CerealNotFound/cloudcast-nextjs",
    techStack: ["Next.js", "React", "Supabase", "AWS", "Typescript"],
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-01"),
    companyLogoImg: "/projects/cloudcast/logo.png",
    pagesInfoArr: [
      {
        title: "Video Feed Interface",
        description:
          "Familiar, intuitive layout optimized for rapid development and usability testing",
        imgArr: [],
      },
      {
        title: "Media Upload System",
        description:
          "Secure client-side uploads to Amazon S3 using signed URLs to prevent unauthorized access",
        imgArr: [],
      },
      {
        title: "Thumbnail Management",
        description:
          "Dedicated pipeline for thumbnail uploads, storage, and CDN-backed delivery",
        imgArr: [],
      },
      {
        title: "Authentication & User Management",
        description:
          "Basic user accounts enabling controlled access and future personalization",
        imgArr: [],
      },
      {
        title: "Performance & Delivery",
        description:
          "Global content delivery via CloudFront, minimizing latency and improving load times",
        imgArr: [],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Building CloudCast was an exercise in engineering-first product development. Rather than focusing on novelty in UI, I prioritized infrastructure, security, and scalable media delivery. The application was built using Next.js, with a familiar video platform interface to reduce UX friction and keep attention on system design.",
        "Authentication and user management were implemented as foundational layers, enabling controlled access and personalized interactions. Video and thumbnail uploads were handled through Amazon S3, using signed URLs to ensure secure, time-bound access for upload operations.",
        "All media assets were distributed via Amazon CloudFront, enabling low-latency global delivery and offloading traffic from the core application. Supabase was used as the primary database for managing users, metadata, and application state, completing a full-stack pipeline optimized for performance and safety.",
      ],
      bullets: [
        "Developed a full-stack video platform using Next.js, focusing on backend architecture over UI novelty",
        "Implemented user authentication and basic account management",
        "Designed secure media upload workflows using S3 signed URLs",
        "Delivered video and image assets through CloudFront CDN for scalable, low-latency distribution",
        "Integrated Supabase for database management and application data handling",
      ],
    },
  },
];

export const featuredProjects = Projects.slice(0, 3);
