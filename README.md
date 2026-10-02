# Nikhil K K — Portfolio (React + Node.js)

Advanced animated portfolio built with **React 18 + Vite + Tailwind CSS + Framer Motion** on the frontend and an **Express (Node.js)** API on the backend. All personal, skill, experience and project content lives in one JSON file so it can be swapped for Firebase later without touching the UI.

```
New-Portfolio/
├─ client/              React frontend (Vite)
│  ├─ public/           profile.png, favicon (resume is a Google Drive link in the JSON)
│  └─ src/
│     ├─ components/
│     │  ├─ layout/     Navbar, Footer
│     │  ├─ sections/   Hero, About, Skills, Services, Experience, Projects, Education, Contact
│     │  └─ ui/         Cursor, ParticleField, TiltCard, Magnetic, Reveal, Marquee, Counter…
│     ├─ pages/         Home, ProjectDetail (video + gallery), NotFound
│     ├─ hooks/         usePortfolio (data context), useLenis (smooth scroll)
│     └─ lib/api.js     API client with offline JSON fallback
├─ server/              Express API
│  └─ src/
│     ├─ routes/        /api/* routes
│     ├─ controllers/   request handlers
│     └─ services/      data.service.js  ← swap this for Firebase later
├─ data/portfolio.json  SINGLE SOURCE OF TRUTH for all content
└─ legacy/index.html    the old static portfolio (kept for reference)
```

## Run locally

```bash
npm run install:all   # installs root, client and server deps (first time only)
npm run dev           # starts client (http://localhost:5173) + API (http://localhost:5000)
```

Or run them separately: `npm run dev --prefix client` and `npm run dev --prefix server`.

## Editing your content

Everything is in [`data/portfolio.json`](data/portfolio.json):

| Key            | What it controls                                                     |
| -------------- | -------------------------------------------------------------------- |
| `profile`      | name, roles (typewriter), headline, about paragraphs, contact, `resumeUrl` (Google Drive link), `whatsapp` / `whatsappUrl` |
| `socials`      | GitHub / LinkedIn / WhatsApp / email / phone buttons                 |
| `stats`        | the animated counters in the hero                                    |
| `marquee`      | the scrolling logo rows: `{ "name": "React.js", "icon": "react" }`   |
| `heroCards`    | the four floating tech cards around the hero photo (label, title, logo keys) |
| `skills`       | skill categories + proficiency bars                                  |
| `services`     | RAG, MCP, Postman, API Integrations, AI in CRM, Full Stack cards     |
| `experience`   | timeline                                                             |
| `projects`     | project cards + case-study pages                                     |
| `education`, `certificates` | education & certificate cards                           |

### Technology logos

Logo keys (`react`, `node`, `django`, `postman`, `claude`, `rag`, `mcp`, …) are defined in
[`client/src/components/ui/TechIcon.jsx`](client/src/components/ui/TechIcon.jsx). To add a new technology, import its
icon from `react-icons/si`, add one line to `TECH_ICONS`, then use the key in `marquee` or `heroCards`.

### WhatsApp

`profile.whatsappUrl` is a `https://wa.me/<number>?text=...` link. It powers the floating button, the hero icon,
the contact row and the button on the back of the flip card. Change the number or the pre-filled message there
(and in the `whatsapp` entry of `socials`).

### Adding a project video / screenshots

Each project has a `media` block:

```json
"media": {
  "cover": "/projects/bmv/cover.png",
  "video": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  "gallery": ["/projects/bmv/1.png", "/projects/bmv/2.png"]
}
```

- `video` accepts **YouTube, Vimeo, Google Drive share links or a direct .mp4 URL**. Leave it `""` to show the "coming soon" placeholder.
- Put image files in `client/public/projects/<slug>/` and reference them with a leading `/`.
- `cover` is optional — a generated gradient cover is used when it is empty.

## API endpoints

| Method | Route                  | Description                     |
| ------ | ---------------------- | ------------------------------- |
| GET    | `/api/health`          | health check                    |
| GET    | `/api/portfolio`       | entire dataset                  |
| GET    | `/api/profile`         | profile                         |
| GET    | `/api/skills`          | skills                          |
| GET    | `/api/services`        | services                        |
| GET    | `/api/experience`      | experience                      |
| GET    | `/api/projects`        | projects (`?featured=true`)     |
| GET    | `/api/projects/:slug`  | single project                  |
| GET    | `/api/education`       | education                       |
| GET    | `/api/certificates`    | certificates                    |
| POST   | `/api/contact`         | contact form → `server/data/messages.json` |

A Postman collection can be generated from these routes; the API returns `{ success, data }` envelopes.

## Deploying

- **Frontend**: `npm run build --prefix client` and deploy `client/dist` to Vercel/Netlify. Add the six `VITE_FIREBASE_*` variables from `client/.env` to the host's environment settings. The site reads straight from Firestore, so the Node API is optional in production.
- **Backend (optional)**: deploy `server/` to Render/Railway/Fly with the variables from `server/.env.example`.

## Firebase (Firestore)

The site loads content in this order: **Firestore**, then the **Node API**, then the **bundled JSON**. It always renders even if Firebase is down or not seeded.

| Firestore path | Contents |
| -------------- | -------- |
| `site/profile` | profile object |
| `site/socials`, `site/stats`, `site/marquee`, `site/heroCards` | `{ items: [...] }` |
| `skills`, `services`, `experience`, `projects`, `education`, `certificates` | one document per item (id = item `id`), sorted by `order` |
| `messages` | contact form submissions (visitors can only create; read them in the console) |

### Pushing data/portfolio.json to Firestore

1. Firebase console > **Firestore Database > Rules**: paste [`firestore.seed.rules`](firestore.seed.rules) and click **Publish**. These allow content writes only until the date written inside the file.
2. Run:
   ```bash
   npm run seed:firebase
   ```
3. Paste [`firestore.rules`](firestore.rules) back into the console and **Publish**. Content becomes read-only and the contact form can only create messages.

Repeat these three steps whenever you edit `data/portfolio.json` (update the date in `firestore.seed.rules` first if it has passed). You can also edit documents directly in the Firebase console; changes show on the site on the next page load.

### Config

- Client: `client/.env` (`VITE_FIREBASE_*`). Restart `npm run dev` after changing it.
- Server and seed script: `server/.env` (`FIREBASE_*`, `DATA_SOURCE=firebase|json`).
- `GET /api/health` shows which source the API is currently using.

The Firebase web config is public by design. Access is controlled by the Firestore rules, so always switch back to `firestore.rules` after seeding.
