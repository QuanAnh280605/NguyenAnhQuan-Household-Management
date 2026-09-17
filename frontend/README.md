# ResidentHub — Frontend Web Application

Modern Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4 frontend client for ResidentHub.

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> All `/api/v1/:path*` requests are automatically proxied to the FastAPI backend running at `http://localhost:8000` via Next.js rewrites in `next.config.ts`.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 🏛️ Directory Structure

```
frontend/
├── src/
│   ├── app/                # Next.js App Router routes & pages
│   ├── components/         # Atomic UI, Layout, Forms & Domain widgets
│   │   ├── layout/         # AppShell, Header, Sidebar
│   │   ├── ui/             # Atomic UI primitives
│   │   ├── forms/          # Form controllers
│   │   └── domain/         # Domain components (apartments, billing, etc.)
│   ├── services/api/       # HTTP client adapters for backend API
│   ├── hooks/              # Custom React hooks (useDebounce, ...)
│   ├── context/            # React context providers
│   ├── utils/              # Helper utilities & formatters
│   ├── lib/                # Mock data & shared utilities
│   └── types/              # TypeScript types & DTO definitions
├── public/                 # Static web assets & OpenAPI spec
├── next.config.ts          # Next.js rewrites to backend API
├── tsconfig.json           # TypeScript path mappings (@/* -> ./src/*)
└── package.json            # Dependencies & build scripts
```
