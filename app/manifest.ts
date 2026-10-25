import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Adarsh Pandey Portfolio",
    short_name: "Adarsh Pandey",
    description: "Adarsh Pandey - Full-Stack Engineer | AI & Systems",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0908",
    theme_color: "#0b0908",
    icons: [
      { src: "/brand/phoenix.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    categories: [
      "portfolio",
      "template",
      "development",
      "nextjs",
      "react",
      "developer",
      "web development",
      "open source",
    ],
    lang: "en",
    dir: "ltr",
    scope: "/",
  };
}
