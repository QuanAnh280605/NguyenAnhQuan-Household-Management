# ADR-0008: Monorepo Next.js 16 + FastAPI with Resilient Fallback Store

- **Status:** Accepted
- **Date:** 2026-09-18
- **Deciders:** Principal Architect, Fullstack Lead
- **Consulted:** DevOps Engineer, Product Owner
- **Informed:** Core Engineering Team

---

## 1. Context and Problem Statement

Modern full-stack web applications for residential management demand high interaction fidelity on the client (rich dashboards, responsive tables, interactive modal payments) combined with high-throughput, typed asynchronous processing on the backend (AsyncPG, Pydantic, OpenAPI generation).

Developing across two disparate repositories (polyrepo):
- Increases coordination friction when evolving API contracts and TypeScript interfaces.
- Complicates CI/CD setups, requiring version cross-pinning between frontend and backend.
- Impedes local development when external developers or stakeholders evaluate the platform without having a local PostgreSQL daemon running.

We must decide on the repository structure, client-server bridging strategy, and offline developer ergonomics.

## 2. Decision Drivers

- **Developer Ergonomics:** Single `git clone`, unified dependencies, and coordinated full-stack commits.
- **Contract Synchronization:** Synchronized data transfer objects (DTOs) between backend Pydantic models and frontend TypeScript types.
- **Zero-Friction Evaluation & Demo:** The frontend must remain fully interactive and render authentic demo datasets even when the backend API or PostgreSQL database is offline.
- **No CORS in Local Development:** Seamless reverse proxying from Next.js to FastAPI.

## 3. Considered Options

1. **Option 1: Polyrepo (Separate Git Repositories for Frontend and Backend)**
   - *Pros:* Independent versioning and deployment lifecycles.
   - *Cons:* High friction for small agile teams; PRs spanning frontend and backend are split across two repos; contract drift.
2. **Option 2: Single-Stack Next.js Fullstack (Next.js Server Actions + Prisma)**
   - *Pros:* 100% TypeScript throughout.
   - *Cons:* Ties the entire system to Node.js runtime; Python is far superior for data engineering, complex tariff algorithms, and future AI agent workflows; limited native pessimistic locking compared to raw AsyncPG.
3. **Option 3: Unified Monorepo (Next.js 16 App Router + FastAPI + In-Memory Fallback Store)**
   - *Pros:* Best of both worlds: React 19 / Next.js 16 for UI + FastAPI / AsyncPG for high-performance Python backend; reverse proxy rewrite via [next.config.ts](../../frontend/next.config.ts) (`/api/v1/:path*` $\rightarrow$ `http://localhost:8000`); resilient `httpClient.ts` with transparent fallback to `mock-data.ts` when backend is offline.
   - *Cons:* Requires both Node.js and Python installed in development environments.

## 4. Decision Outcome

**Chosen Option:** **Option 3 — Unified Monorepo with Next.js 16, FastAPI, and Resilient Fallback Store**.

The monorepo structure consolidates all artifacts under one roof:
```
chung-cu-household-management/
├── backend/            # Python 3.11, FastAPI, AsyncPG, Pytest
├── frontend/           # Next.js 16 (React 19), TypeScript 5, Tailwind CSS v4
├── database/           # DDL, DBML, Seeds
├── docs/               # arc42, C4, INVEST, ADRs, OpenAPI
├── package.json        # Unified root orchestration scripts
```

### 4.1 Transparent Fallback Architecture
Implemented in [frontend/src/services/api/httpClient.ts](../../frontend/src/services/api/httpClient.ts) and domain APIs (e.g. [residentApi.ts](../../frontend/src/services/api/residentApi.ts)):
- Next.js proxies all `/api/v1/*` calls to FastAPI at `http://localhost:8000`.
- If FastAPI is running and connected to PostgreSQL, live data is rendered with an active indicator badge (`FastAPI Live`).
- If FastAPI is offline or PostgreSQL pool is unreachable, `httpClient.ts` catches the network timeout (with an AbortController after 6s) and seamlessly falls back to pre-seeded local mock fixtures (`Demo Store`), ensuring zero UI crashes during presentations or client reviews.

### 4.2 Positive Consequences
- Single-command orchestration from root `package.json` (`npm run dev:frontend`, `npm run dev:backend`, `npm test`).
- Atomic Pull Requests modifying both backend Pydantic schemas and frontend React components simultaneously.
- 100% functional demo capability on any machine with just `npm run dev`.

### 4.3 Negative Consequences / Trade-offs
- Monorepo requires keeping both Python 3.11+ and Node.js 20+ environments installed.
- Developers must maintain mock fixtures in [mock-data.ts](../../frontend/src/lib/mock-data.ts) when introducing new API fields.

---

## 5. Pros and Cons of the Options

| Dimension | Option 1: Polyrepo | Option 2: Fullstack Next.js | **Option 3: Monorepo + FastAPI (Selected)** |
| :--- | :---: | :---: | :---: |
| **Commit Atomicity** | ❌ Split across 2 PRs | ✅ Single PR | ✅ Single PR |
| **Computational Backend** | ⚠️ Python | ❌ Node.js (Heavy math overhead) | ✅ Python 3.11 (FastAPI + AsyncPG) |
| **Offline Demo Resiliency** | ❌ Fails without DB | ⚠️ Mock Prisma required | ✅ Transparent Fallback Store |
| **API Contract Drift** | ❌ High risk | ⚠️ Moderate | ✅ Synchronized in single repo |

---

## 6. Links & References

- [Root Monorepo Configuration](../../package.json)
- [Next.js Rewrite Configuration](../../frontend/next.config.ts)
- [HTTP Client with Fallback Store](../../frontend/src/services/api/httpClient.ts)
- [Resident API Implementation](../../frontend/src/services/api/residentApi.ts)
- [FlowX Monorepo & Samples Architecture](https://github.com/votrongdao/FlowX)
