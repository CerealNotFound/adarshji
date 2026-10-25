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
  // Revamp card fields
  coverImg?: string;
  /** "contain" for screenshots that must never be cropped. */
  coverFit?: "cover" | "contain";
  coverMatte?: string;
  tagline?: string;
  label?: string;
}

export const Projects: ProjectInterface[] = [
  {
    id: "thnkrr",
    companyName: "Thnkrr",
    type: "Professional",
    category: ["Full Stack", "Backend", "AI"],
    tagline: "A professional network for high-school students, safe by design.",
    label: "Teen professional network · AI moderation",
    shortDescription:
      "LinkedIn for high-school students. I lead the platform rebuild: a Fastify + Postgres API, a React 19 SPA, AI moderation before anything is published, and compliance (COPPA, FERPA, DPDP) built in from the architecture up.",
    websiteLink: "https://thnkrr.com",
    techStack: [
      "Typescript",
      "Fastify",
      "PostgreSQL",
      "Drizzle",
      "React",
      "Vite",
      "TanStack",
      "AWS",
      "AWS Bedrock",
    ],
    startDate: new Date("2026-08-29"),
    endDate: new Date("2026-10-25"),
    companyLogoImg: "/projects/thnkrr/logo.png",
    coverImg: "/projects/thnkrr/cover.jpg",
    pagesInfoArr: [
      {
        title: "Pre-publication moderation",
        description:
          "Every post, message, and profile field is checked before anyone else can see it. Our own rules screen first, then a policy model on Amazon Bedrock (retention locked off), then a human queue with named reviewers.",
        imgArr: [],
      },
      {
        title: "Guardian consent, verified by schools",
        description:
          "Students under 18 name a guardian. The school confirms that guardian against its own records before a consent email is ever sent.",
        imgArr: [],
      },
      {
        title: "Roles and surfaces",
        description:
          "Students, mentors, and educators get a feed, gamified learning, mentorship matching, appointments, messaging, and educator dashboards with PDF reports.",
        imgArr: [],
      },
      {
        title: "Sized before it scales",
        description:
          "Search and load were benchmarked on a pilot-sized network (9,000 students, 700 mentors, 300 educators) to choose production infrastructure before the first school.",
        imgArr: [],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Thnkrr is an AI-matched mentorship, networking, and learning platform for students aged 13 to 18. As lead engineer through SingleBit, I took it from a working MVP to a platform rebuilt for scale.",
        "Because the users are minors, compliance is the moat. COPPA, FERPA, SOPIPA, US state design codes, and India's DPDP shape the data model, the onboarding flow, and the moderation stack. Every decision is written down in a decision log with sources.",
        "The API is Fastify + TypeScript on Postgres with Drizzle, with internal auth (argon2) and S3 media behind presigned URLs. The web app is a React 19 + Vite SPA on TanStack Router and Query.",
      ],
      bullets: [
        "Rebuilt the platform end to end across 220+ commits: API, data model, SPA, and infrastructure",
        "Designed a staged moderation pipeline that runs before publication, with all models on Amazon Bedrock",
        "Built guardian-consent onboarding verified by schools, plus per-student privacy controls",
        "Benchmarked search and load at pilot scale before choosing production database sizes",
        "Wrote the architecture, safety runbook, and AWS deployment decision records",
      ],
    },
  },
  {
    id: "aulora",
    companyName: "Aulora",
    type: "Personal",
    category: ["Backend", "AI"],
    tagline: "One terminal workspace for every Claude Code session you run.",
    label: "Open-source Rust TUI · agent workspace",
    shortDescription:
      "A Rust TUI and daemon that shows which coding agents are working, which finished, and which are waiting on you, across all your projects. Claude Code runs in its panes, with Changes and Files views that mark which agent wrote each line.",
    websiteLink: "https://github.com/CerealNotFound/aulora",
    githubLink: "https://github.com/CerealNotFound/aulora",
    techStack: ["Rust", "Ratatui", "Claude Code"],
    startDate: new Date("2026-10-19"),
    endDate: new Date("2026-10-25"),
    companyLogoImg: "/projects/aulora/wordmark.svg",
    coverImg: "/projects/aulora/cover.jpg",
    coverFit: "contain",
    coverMatte: "#0d0f14",
    pagesInfoArr: [
      {
        title: "What needs you",
        description:
          "Permission prompts, questions, and plans waiting for review turn the agent red in the sidebar. n jumps straight to the next one.",
        imgArr: ["/projects/aulora/overview.png"],
      },
      {
        title: "What changed, and who changed it",
        description:
          "A source-control view with syntax-highlighted diffs and a coloured dot for the Claude session that wrote each change, read from its transcript.",
        imgArr: ["/projects/aulora/changes.png"],
      },
      {
        title: "Real terminals, owned by a daemon",
        description:
          "Claude Code and your shells run in panes that keep running after you close the dashboard. Each shell's status shows whether its dev server is running, crashed, or exited.",
        imgArr: ["/projects/aulora/pane.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "If you run Claude Code in several projects at once, you end up with a VS Code window per project, mostly to hold Claude's terminal. Aulora replaces those windows with one terminal workspace that tracks every session through Claude Code's hooks.",
        "It's a Rust workspace with a core crate (model, protocol, reducer, transcript reader), a daemon that owns the PTYs, and a Ratatui dashboard. Everything stays on your machine.",
      ],
      bullets: [
        "Daemon-owned PTYs, so sessions survive closing the UI, and `aulora attach` opens any pane in another terminal",
        "Hook-driven session state: working, waiting on permission, asking a question, or done",
        "Changes view with per-agent attribution read from session transcripts",
        "gitignore-aware file tree, fuzzy file finder, and ripgrep-engine search",
        "A VS Code extension to prompt sessions running in editor terminals",
      ],
    },
  },
  {
    id: "agentic-ads-factory",
    companyName: "Agentic Ads Factory",
    type: "Professional",
    category: ["AI", "Backend"],
    tagline: "Raw footage and a script in. A finished vertical ad out.",
    label: "Multi-agent pipeline · footage to ad",
    shortDescription:
      "Two agent pipelines run by Claude Code. One turns raw talking-head footage from Google Drive into a finished 9:16 ad, rendered locally with Remotion. The other turns a script into motion-graphic b-roll clips with HyperFrames. No outside LLM APIs.",
    techStack: [
      "Claude Code",
      "Remotion",
      "HyperFrames",
      "whisper.cpp",
      "Typescript",
      "Node.js",
    ],
    startDate: new Date("2026-06-18"),
    endDate: new Date("2026-09-04"),
    companyLogoImg: "/projects/agentic-ads-factory/frame-2.jpg",
    coverImg: "/projects/agentic-ads-factory/frame-2.jpg",
    pagesInfoArr: [
      {
        title: "Drive to reel",
        description:
          "A Drive agent pulls new footage folders. A transcription agent runs whisper.cpp locally and finds hooks and emphasis. A video-editor agent builds the edit plan and renders the reel with Remotion.",
        imgArr: [
          "/projects/agentic-ads-factory/frame-2.jpg",
          "/projects/agentic-ads-factory/frame-6.jpg",
        ],
      },
      {
        title: "Script to b-roll",
        description:
          "A beat-selector skill splits a narration script into up to seven beats. Each beat becomes a HyperFrames composition, and each one is linted, previewed, approved by a person, then rendered to transparent WebM with a manifest for the editor.",
        imgArr: ["/projects/agentic-ads-factory/frame-12.jpg"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "The ads factory turns raw creative inputs into finished short-form ads with almost no human editing. Claude Code is the orchestrator, and every agent hands off through files on disk. Subagents don't share context, so each output is an artifact, not a message.",
        "It has made real ads for live brands, including Thnkrr's summer campaign.",
      ],
      bullets: [
        "Multi-agent pipeline whose hand-offs are files on disk, so runs can be resumed and audited",
        "Local transcription with whisper.cpp and analysis of hooks and emphasis",
        "Data-driven Remotion edits with 9:16 renders",
        "A HyperFrames b-roll generator with lint and validate gates, plus a human approval step before rendering",
      ],
    },
  },
  {
    id: "pico",
    companyName: "Pico",
    type: "Professional",
    category: ["AI", "Backend"],
    tagline: "An operations manager that lives in your team's chat.",
    label: "Chat-to-Notion ops agent · MCP",
    shortDescription:
      "Pico listens for the work decided in chat (meeting notes, a task thrown out mid-thread) and turns it into structured, labelled, deduplicated cards on your Notion board. It always shows what it plans to file, and you correct it by replying.",
    githubLink: "https://github.com/CerealNotFound/pico-ticket-bot",
    techStack: ["Python", "Claude Code", "Notion API"],
    startDate: new Date("2026-08-04"),
    endDate: new Date("2026-10-07"),
    companyLogoImg: "/projects/pico/logo.svg",
    pagesInfoArr: [],
    descriptionDetails: {
      paragraphs: [
        "Pico is an agentic operations manager. An always-on gateway speaks to the chat platform (Pumble today), and a brain agent decomposes messages into Notion cards through an MCP tool surface. Chat is pluggable: swapping platforms means rewriting one directory.",
      ],
      bullets: [
        "Notion OAuth so it can write to anyone's workspace",
        "Dedupe, validation, editing, and undo before anything is filed",
        "Shows its plan first, and takes corrections as chat replies",
      ],
    },
  },
  {
    id: "spiral-studios",
    companyName: "Spiral Studios",
    type: "Professional",
    category: ["Frontend", "UI/UX", "Web Dev"],
    tagline: "Landing pages for a narrative film studio for deep tech.",
    label: "Deep-tech film studio · cold-email landings",
    shortDescription:
      "Two conversion landing pages for Spiral, a studio that films deep-tech companies: a founder-credibility page built for cold-email traffic, and a workshop page with a hyperspace streak field drawn on canvas.",
    websiteLink: "https://spiral-founder-credibility-landing.vercel.app",
    techStack: ["Next.js", "React", "Typescript", "Tailwind CSS", "Framer Motion"],
    startDate: new Date("2026-08-20"),
    endDate: new Date("2026-09-01"),
    companyLogoImg: "/projects/spiral/cover.jpg",
    coverImg: "/projects/spiral/cover.jpg",
    pagesInfoArr: [
      {
        title: "Founder credibility page",
        description:
          "Statically prerendered and built for people arriving from cold email: proof first, one clear call to book.",
        imgArr: ["/projects/spiral/cover.jpg", "/projects/spiral/section.jpg"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Spiral turns what's actually happening in labs and on factory floors into films investors watch to the end. I built two landing pages for their outbound: one to make the founder credible in seconds, one to sell a workshop.",
      ],
      bullets: [
        "Statically prerendered Next.js pages, tuned for cold-email traffic",
        "A canvas streak field calibrated against a reference frame",
        "Motion built with Framer Motion springs, while canvas owns every pixel",
      ],
    },
  },
  {
    id: "orbit",
    companyName: "Orbit",
    type: "Professional",
    category: ["Full Stack", "Backend"],
    tagline: "Project management for several companies working as one team.",
    label: "Multi-company PM · row-level security",
    shortDescription:
      "A project-management and business-document workspace for multiple companies working together: Linear's simplicity, plus software that carries part of the project-management discipline itself.",
    techStack: ["Typescript", "React", "Vite", "TanStack", "Fastify", "Drizzle", "PostgreSQL"],
    startDate: new Date("2026-10-08"),
    endDate: new Date("2026-10-25"),
    companyLogoImg: "/projects/pico/logo.svg",
    pagesInfoArr: [],
    descriptionDetails: {
      paragraphs: [
        "Orbit is a TypeScript monorepo: a React + Vite SPA, a Fastify REST API with Better Auth and an MCP server, pg-boss background jobs, and a single authorization layer backed by Postgres row-level security.",
      ],
      bullets: [
        "Multi-company workspaces with one authorization layer",
        "Row-level security policies in Postgres, managed with Drizzle migrations",
        "An MCP server, so agents can work inside projects",
      ],
    },
  },
  {
    id: "hospihealth",
    companyName: "HospiHealth",
    type: "Professional",
    category: ["Full Stack", "Web Dev"],
    tagline: "A healthcare staffing site with a job portal and resume engine.",
    label: "Healthcare hiring · PDF resume engine",
    shortDescription:
      "A full-stack client site with blog publishing, job-portal workflows, admin tooling, and an automated pipeline that turns applicant data into formatted PDF resumes.",
    techStack: ["Next.js", "Typescript", "Supabase", "Tailwind CSS"],
    // TODO(adarsh): confirm dates
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-06-01"),
    companyLogoImg: "/projects/pico/logo.svg",
    pagesInfoArr: [],
    descriptionDetails: {
      paragraphs: [
        "Built through SingleBit: a public site with blog publishing and a job portal, and the admin workflows behind them.",
      ],
      bullets: [
        "Admin tooling for content, job postings, and structured data export",
        "Automated PDF resume generation from structured applicant data",
        "Secure auth, pagination, and performance work across user and admin views",
      ],
    },
  },
  {
    id: "arista-botanicals",
    companyName: "Arista Botanicals",
    type: "Professional",
    category: ["Frontend", "Web Dev"],
    tagline: "A launch page that collects interest straight into Google Sheets.",
    label: "Brand launch page · Sheets signups",
    shortDescription:
      "A fast static landing page for a botanicals brand, with an interest form that writes straight into Google Sheets. No backend to run.",
    techStack: ["Javascript", "HTML 5", "CSS 3"],
    startDate: new Date("2026-10-22"),
    endDate: new Date("2026-10-22"),
    companyLogoImg: "/projects/pico/logo.svg",
    pagesInfoArr: [],
    descriptionDetails: {
      paragraphs: [
        "A static landing page with a Google Sheets interest integration, so the client sees signups in a sheet they already use.",
      ],
      bullets: ["Static and fast", "Google Sheets integration with no server"],
    },
  },
  {
    id: "erwins-hire-ai",
    companyName: "Erwin's Hire AI",
    label: "AI hiring copilot · built in 72h",
    tagline: "An AI hiring copilot, built end to end in 72 hours.",
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
    coverImg: "/projects/erwins-hire-ai/cover.jpg",
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
    label: "Gaming rewards · Valorant via Overwolf",
    tagline: "Play games, earn rewards: a web app, desktop companion and admin.",
    type: "Professional",
    category: ["Web Dev", "Full Stack", "UI/UX"],
    shortDescription:
      "Production-grade engagement platform with web app, Electron desktop companion, and admin dashboard - featuring real-time Valorant integration via Overwolf and comprehensive rewards system.",
    websiteLink: "https://www.onetapp.xyz/",
    techStack: ["React", "Node.js", "Redux", "Typescript", "MongoDB"],
    startDate: new Date("2023-06-01"),
    endDate: new Date("2024-05-01"),
    companyLogoImg: "/projects/onetap/logo.png",
    coverImg: "/projects/onetap/cover.jpg",
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
  label: "400+ AI models · credit billing",
  tagline: "One workspace for 400+ AI models, billed by the credit.",
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
    coverImg: "/projects/multibrain/cover.jpg",
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
    label: "Video platform · S3 + CloudFront",
    tagline: "A video platform with signed uploads and CDN delivery.",
    type: "Personal",
    category: ["Web Dev", "Full Stack", "AWS"],
    shortDescription:
      "Engineering-first video platform built with Next.js, focusing on infrastructure, security, and scalable media delivery using AWS S3, CloudFront, and Supabase.",
    githubLink: "https://github.com/CerealNotFound/cloudcast-nextjs",
    techStack: ["Next.js", "React", "Supabase", "AWS", "Typescript"],
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-01"),
    companyLogoImg: "/projects/cloudcast/logo.png",
    coverImg: "/projects/cloudcast/cover.jpg",
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

export const featuredProjects = Projects.slice(0, 6);
