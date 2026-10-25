# adarshji

The portfolio of **Adarsh Pandey**: Lead Engineer at SingleBit, building AI products, agent pipelines and the systems that keep them up.

**Live:** [adarshji.vercel.app](https://adarshji.vercel.app) · **Links:** [/atlas](https://adarshji.vercel.app/atlas) · **Hire me:** [/work-with-me](https://adarshji.vercel.app/work-with-me)

It's built as an art piece as much as a CV. A single WebGL layer sits behind every page; the text stays in plain HTML so the site is fast, accessible and indexable.

## What's inside

- **Ember silk backdrop**: a gradient bent by sine folds, a swirl and a voronoi shatter, then lens-blurred, all in one shader stack.
- **3D phoenix**: the phoenix SVG rasterised, turned into a signed distance field and inflated into a glossy, puffy mesh.
- **Cursor lens** (desktop): a GPU fluid simulation whose velocity warps the rendered scene, with thin RGB fringes and glitch tears on fast strokes.
- **WebGL project images**: each image follows its HTML box, curls toward the screen edges while you scroll, arrives colour-inverted and flips to normal, and a halftone wave sweeps across it on hover.
- **Hyperspace finale**: a pinned streak tunnel whose headline changes as you scroll.
- **/atlas**: a phone-first link page where the phoenix is drawn as a constellation on a 2D canvas.
- **Pages**: home, work, project case studies, experience, open source (a deduplicated Zulip PR ledger), skills, contact and a freelance work-with-me page.

Phones get a lighter version: no cursor effect, a simpler phoenix material, a cheaper blur and a lighter tunnel. With reduced motion on, the animation stops.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack), [React 19](https://react.dev/), TypeScript
- [three.js](https://threejs.org/) via [React Three Fiber](https://r3f.docs.pmnd.rs/) and [drei](https://drei.docs.pmnd.rs/), hand-written GLSL
- [Lenis](https://lenis.darkroom.engineering/) smooth scroll, [Framer Motion](https://motion.dev/) for text reveals
- [Tailwind CSS](https://tailwindcss.com/) with an ember-only theme; Mona Sans and Geist Mono
- Deployed on [Vercel](https://vercel.com)

## Run it

```bash
npm install
cp .env.copy .env   # fill in the values you need
npm run dev         # http://localhost:3000
```

Every environment variable is optional for local development:

| Variable | What it does |
| --- | --- |
| `GOOGLE_FORM_*` | Where the contact form posts (see `app/api/contact/route.ts`) |
| `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID` | Google Analytics; skipped when unset |
| `NEXT_PUBLIC_RESUME_LINK` | Target of `/resume` |

## Where things live

| What | Where |
| --- | --- |
| Projects, experience, skills | `config/projects.ts`, `config/experience.ts`, `config/skills.ts` |
| Open-source ledger | `config/open-source.ts` |
| Site name, links, favicon | `config/site.ts`, `config/socials.ts` |
| WebGL layer (pipeline, fluid, phoenix, image planes) | `components/gl/` |
| Grid frame, nav and readouts | `components/hud/hud.tsx` |
| Page sections | `components/home/`, `components/sections/` |
| Atlas link page | `app/(atlas)/atlas/`, `components/atlas/` |

Adding a project is one entry in `config/projects.ts`. Give it a `coverImg` to get a WebGL card (set `coverFit: "contain"` if the screenshot must not be cropped); without one it gets a typographic cover.

## Credits

- Phoenix artwork: [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (MIT).
- Fluid simulation adapted from Pavel Dobryakov's [WebGL Fluid Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation) (MIT).
- Visual direction inspired by [haoqi.design](https://haoqi.design/).
- Started from [minimal-next-portfolio](https://github.com/namanbarkiya/minimal-next-portfolio) by Naman Barkiya (MIT), since rebuilt.

## License

[MIT](LICENSE).
