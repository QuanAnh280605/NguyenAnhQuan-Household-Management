# ADR-0009: Frontend Testing with Vitest and React Testing Library

- **Status:** Accepted
- **Date:** 2026-09-18
- **Deciders:** Principal Architect, Fullstack Lead, QA / SDET Lead
- **Consulted:** DevOps Engineer, Product Owner
- **Informed:** Core Engineering Team

---

## 1. Context and Problem Statement

ResidentHub features complex interactive UI flows across 7 operational modules:
1. **Dynamic Billing & Payments:** `PaymentModal` computing unpaid balances and rendering dynamic VietQR pay sessions.
2. **Civil Demographics Table:** `ResidentTable` with kinship relations, Head of Household badges, and unit links.
3. **Resilient API Fallback:** `residentApi` and `httpClient` transparently switching between live FastAPI responses and seeded mock stores.

Previously, ResidentHub had 26 automated unit and integration tests on the Python backend (0.41s), but **zero automated tests on the Next.js frontend**. 

In the absence of a dedicated frontend component test suite:
- UI regressions (broken form validations, state math errors in payment calculations, or missing demographic columns) could only be caught through manual browser clicks.
- CI pipelines lacked automated verification gates for client components.

We must decide on the frontend testing framework and assertion library.

## 2. Decision Drivers

- **Execution Velocity:** Sub-second to few-second test execution matching the speed of Backend Pytest.
- **Next.js 16 & React 19 Compatibility:** Native support for modern JSX transforms, server/client component boundaries, and path aliases (`@/*`).
- **Standardized Component Testing:** Adhering to the user-centric testing philosophy championed by the **Testing Library** community ("The more your tests resemble the way your software is used, the more confidence they can give you").
- **Alignment with FlowX Standard:** Adopting the modern Vite/Vitest toolchain used by enterprise reference platforms (e.g. `votrongdao/FlowX` in `crm-web`).

## 3. Considered Options

1. **Option 1: Jest + Babel / ts-jest**
   - *Pros:* Legacy industry standard with extensive documentation.
   - *Cons:* Heavyweight; slow cold starts; complex configuration to work with Next.js App Router and ESM modules; requires separate transformer packages.
2. **Option 2: Pure E2E Testing with Playwright or Cypress Only**
   - *Pros:* Tests real browser DOM and network stacks.
   - *Cons:* Heavy, slow (10x–50x slower than unit tests); requires spinning up the entire Next.js server and database before running tests; inverted test pyramid anti-pattern (ice-cream cone).
3. **Option 3: Vitest + JSDOM + React Testing Library (@testing-library/react)**
   - *Pros:* Native ESM, lightning-fast execution out of the box; seamless TypeScript support without Babel; drop-in Jest-compatible API (`describe`, `it`, `expect`, `vi`); official React 19 testing library support; identical to the FlowX reference toolchain.
   - *Cons:* Requires `@vitejs/plugin-react` and `jsdom` setup for DOM simulation.

## 4. Decision Outcome

**Chosen Option:** **Option 3 — Vitest + JSDOM + React Testing Library**.

Configured in [frontend/vitest.config.ts](../../frontend/vitest.config.ts) and [frontend/vitest.setup.ts](../../frontend/vitest.setup.ts):
```ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/__tests__/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 4.1 Initial Test Suite Coverage
Four core test suites were established:
1. `formatters.test.ts`: Asserts Vietnamese Dong currency formatting (`formatCurrencyVND`) and date formatting (`formatDateVN`).
2. `PaymentModal.test.tsx`: Tests modal visibility, balance computation, and `onConfirm` callback payload.
3. `ResidentTable.test.tsx`: Tests table headers, empty states, head badges, and 12-digit Citizen IDs.
4. `residentApi.test.ts`: Verifies resilient fallback store execution when the backend is offline.

### 4.2 Positive Consequences
- **Complete Test Pyramid:** ResidentHub now possesses automated test coverage across both backend and frontend layers.
- **Fast Developer Feedback:** Running `npm --prefix frontend run test` executes tests in ~1 second.
- **Monorepo Integration:** Root `npm test` runs both frontend Vitest and backend Pytest concurrently.

### 4.3 Negative Consequences / Trade-offs
- Developers must maintain `@testing-library` tests alongside new React components.

---

## 5. Pros and Cons of the Options

| Dimension | Option 1: Jest | Option 2: E2E Only (Playwright) | **Option 3: Vitest + Testing Library (Selected)** |
| :--- | :---: | :---: | :---: |
| **Execution Speed** | ⚠️ Moderate (2–5s) | ❌ Slow (15–60s) | ✅ Blazing Fast (< 1.5s) |
| **ESM & TypeScript** | ❌ Complex config | ✅ Built-in | ✅ Native Zero-Config |
| **Test Pyramid Level** | Unit / Component | End-to-End only | Unit & Component |
| **Toolchain Parity** | Legacy | Browser Integration | Matches FlowX Platform |

---

## 6. Links & References

- [Vitest Official Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [FlowX CRM-Web Testing Toolchain](https://github.com/votrongdao/FlowX)
- [Frontend Vitest Config](../../frontend/vitest.config.ts)
- [Frontend Vitest Setup](../../frontend/vitest.setup.ts)
