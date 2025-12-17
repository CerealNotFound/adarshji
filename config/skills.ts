import { Icons } from "@/components/common/icons";

export interface skillsInterface {
  name: string;
  description: string;
  rating: number;
  icon: any;
}

export const skillsUnsorted: skillsInterface[] = [
  {
    name: "Next.js",
    description:
      "Effortlessly build dynamic apps with routing, layouts, loading UI, and API routes.",
    rating: 5,
    icon: Icons.nextjs,
  },
  {
    name: "React",
    description:
      "Craft interactive user interfaces using components, state, props, and virtual DOM.",
    rating: 5,
    icon: Icons.react,
  },
  {
    name: "express.js",
    description:
      "Build web applications and APIs quickly using a fast, unopinionated Node.js framework.",
    rating: 5,
    icon: Icons.express,
  },
  {
    name: "Node.js",
    description:
      "Run JavaScript on the server side, enabling dynamic and responsive applications.",
    rating: 5,
    icon: Icons.nodejs,
  },
  {
    name: "Python",
    description:
      "Develop robust backend systems and data pipelines with a versatile, high-level programming language.",
    rating: 4,
    icon: Icons.python,
  },
  {
    name: "FastAPI",
    description:
      "Build high-performance REST APIs rapidly with automatic documentation and async support.",
    rating: 4,
    icon: Icons.fastapi,
  },
  {
    name: "Supabase",
    description:
      "Build scalable applications with an open-source Firebase alternative and Postgres database.",
    rating: 5,
    icon: Icons.supabase,
  },
  {
    name: "MongoDB",
    description:
      "Store and retrieve data seamlessly with a flexible and scalable NoSQL database.",
    rating: 3,
    icon: Icons.mongodb,
  },
  {
    name: "ShadCN",
    description:
      "Build accessible and customizable UI components with a modern React component library.",
    rating: 5,
    icon: Icons.shadcn,
  },
  
  {
    name: "Typescript",
    description:
      "Enhance JavaScript with static types, making code more understandable and reliable.",
    rating: 5,
    icon: Icons.typescript,
  },
  {
    name: "Javascript",
    description:
      "Create interactive and dynamic web experiences with the versatile scripting language.",
    rating: 5,
    icon: Icons.javascript,
  },
  {
    name: "Tailwind CSS",
    description:
    "Design beautiful, modern websites faster with a utility-first CSS framework.",
    rating: 5,
    icon: Icons.tailwindcss,
  },
  {
    name: "HTML 5",
    description:
      "Structure web content beautifully with the latest version of HyperText Markup Language.",
    rating: 4,
    icon: Icons.html5,
  },
  {
    name: "CSS 3",
    description:
      "Style web pages creatively with the latest iteration of Cascading Style Sheets.",
    rating: 4,
    icon: Icons.css3,
  },
  {
    name: "Redux",
    description:
      "Manage app state effectively using a predictable and centralized state container.",
    rating: 3,
    icon: Icons.redux,
  },
  {
    name: "AWS",
    description:
    "Utilize Amazon Web Services to build and deploy scalable, reliable, and secure applications.",
    rating: 3,
    icon: Icons.amazonaws,
  },
  {
    name: "Socket.io",
    description:
      "Enable real-time, bidirectional communication between clients and servers effortlessly.",
    rating: 2,
    icon: Icons.socketio,
  },
  {
    name: "MySQL",
    description:
      "Manage and organize relational databases efficiently for data-driven applications.",
    rating: 2,
    icon: Icons.mysql,
  },
  {
    name: "Netlify",
    description:
      "Deploy and host modern web applications instantly with continuous deployment and serverless functions.",
    rating: 4,
    icon: Icons.netlify,
  },
  {
    name: "Vercel",
    description:
      "Deploy and scale web applications effortlessly with edge functions and instant global distribution.",
    rating: 5,
    icon: Icons.vercel,
  },
  {
    name: "Gemini",
    description:
      "Build intelligent RAG and inference pipelines with Google's advanced multimodal AI models.",
    rating: 5,
    icon: Icons.gemini,
  },
  {
    name: "OpenAI",
    description:
      "Create powerful agentic AI systems and inference pipelines using state-of-the-art language models.",
    rating: 5,
    icon: Icons.openai,
  },
  {
    name: "Lemonfox",
    description:
      "Integrate high-quality text-to-speech and speech-to-text capabilities as an ElevenLabs alternative.",
    rating: 4,
    icon: Icons.lemonfox,
  },
];

export const skills = skillsUnsorted
  .slice()
  .sort((a, b) => b.rating - a.rating);

export const featuredSkills = skills.slice(0, 6);
