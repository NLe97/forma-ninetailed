# Forma — Ninetailed Personalization Demo

A fictional B2B SaaS marketing site that uses the [Ninetailed](https://ninetailed.io) SDK to deliver real-time personalized content based on visitor audiences — no CMS required.

---

## What this demonstrates

- Initializing the **Ninetailed React SDK** with a real Client ID
- Calling `identify()` to attach traits to a visitor profile
- Switching personalized content across **hero copy**, **CTAs**, and **pricing plan highlights** based on the active audience
- The **Ninetailed Preview Plugin** sidebar (purple panel) for inspecting active experiences
- A self-contained setup that works entirely from code — no Contentful or CMS needed

---

## Live preview

| Audience | Hero headline | Pricing highlight |
|---|---|---|
| Default | "Build products your users will love" | Growth plan |
| Enterprise | "Enterprise-grade security. Startup-level speed." | Enterprise plan |
| Developer | "Ship faster with an API-first platform" | Growth plan |
| Small Business | "Everything your small team needs..." | Starter plan |

Switch audiences using the floating bar at the bottom of the page.

---

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Install dependencies

```bash
npm install -g pnpm   # if you don't have pnpm
pnpm install
```

### 3. Set your Ninetailed Client ID

Copy `.env.example` to `.env` and fill in your key:

```bash
cp .env.example .env
```

```
VITE_NINETAILED_CLIENT_ID=your_client_id_here
```

Get your Client ID from [app.ninetailed.io](https://app.ninetailed.io) → **Settings → API Keys**.

### 4. Run the dev server

```bash
pnpm --filter @workspace/ninetailed-explainer run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## File structure

```
.
├── artifacts/
│   └── ninetailed-explainer/       # The Forma marketing site
│       ├── src/
│       │   ├── App.tsx             # ★ Main file — all personalization logic lives here
│       │   ├── main.tsx            # React entry point
│       │   ├── index.css           # Global styles (Tailwind)
│       │   ├── components/
│       │   │   └── ui/             # Shadcn/ui primitives (Button, Badge, etc.)
│       │   ├── hooks/              # Shared React hooks
│       │   ├── lib/
│       │   │   └── utils.ts        # cn() helper and utilities
│       │   └── pages/              # Additional page components (if any)
│       ├── public/
│       │   └── favicon.svg
│       ├── index.html
│       ├── vite.config.ts          # Vite config (React + Tailwind)
│       ├── tsconfig.json
│       └── package.json
│
├── lib/                            # Shared workspace libraries
│   ├── api-client-react/           # Auto-generated React query hooks from OpenAPI spec
│   ├── api-spec/                   # OpenAPI YAML spec + Orval codegen config
│   ├── api-zod/                    # Auto-generated Zod validation schemas
│   └── db/                        # Drizzle ORM schema and database helpers
│
├── artifacts/api-server/           # Express API server (TypeScript)
│   └── src/
│       ├── app.ts                  # Express app setup
│       ├── index.ts                # Server entry point
│       ├── routes/                 # API route handlers
│       ├── middlewares/            # Auth, error handling, etc.
│       └── lib/                   # Server-side utilities
│
├── scripts/                        # Workspace automation scripts
│   └── post-merge.sh               # Runs after dependency updates
│
├── .env.example                    # Environment variable template
├── .gitignore
├── package.json                    # Root workspace package
├── pnpm-workspace.yaml             # pnpm monorepo config + version catalog
├── tsconfig.base.json              # Shared TypeScript config
└── tsconfig.json                   # Root TypeScript project references
```

---

## How the personalization works

All personalization logic is in [`artifacts/ninetailed-explainer/src/App.tsx`](artifacts/ninetailed-explainer/src/App.tsx).

### The pattern

```tsx
// 1. Wrap the app in NinetailedProvider
<NinetailedProvider clientId={VITE_NINETAILED_CLIENT_ID} environment="main">
  <App />
</NinetailedProvider>

// 2. When the visitor's audience is known, call identify()
const { identify } = useNinetailed();
identify("visitor-id", { audience: "enterprise-visitors", company_size: 1000 });

// 3. Read the active audience from React context → render the right content
const audience = useAudience(); // "default" | "enterprise" | "developer" | "smb"
const content = heroContent[audience];
```

### Why not use the `<Experience>` component?

The Ninetailed `<Experience>` component resolves variants by querying your **Ninetailed dashboard** for audience rules. Since this demo has no CMS or dashboard audiences configured, variant switching would never fire.

Instead, this demo uses `identify()` for visitor tracking (the data still lands in your Ninetailed analytics) and drives rendering through local React state — giving you instant, predictable switching that works out of the box.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS v4 |
| UI components | Shadcn/ui + Radix UI |
| Personalization | Ninetailed `@ninetailed/experience.js-react` |
| Preview panel | Ninetailed `@ninetailed/experience.js-plugin-preview` |
| Package manager | pnpm (workspaces monorepo) |
| Language | TypeScript |

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_NINETAILED_CLIENT_ID` | Yes | Your Ninetailed project Client ID |
| `PORT` | No | Dev server port (defaults to `3000`) |
| `BASE_PATH` | No | Base URL path (defaults to `/`) |
