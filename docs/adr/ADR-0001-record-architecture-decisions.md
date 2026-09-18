# ADR-0001: Record Architecture Decisions

- **Status:** Accepted
- **Date:** 2026-09-18
- **Deciders:** Principal Architect, Lead Backend Engineer, Lead Frontend Engineer
- **Consulted:** Product Owner, SRE / DevOps, Security Officer
- **Informed:** Core Engineering Team

---

## 1. Context and Problem Statement

As **ResidentHub** expands in scope across property inventories, civil residency demographics, complex multi-tier utility tariffs, underground parking allocations, and digital payment switches, critical technical decisions are made daily. 

In the absence of a standardized, version-controlled repository of architectural choices:
- The historical context, rationale, and discarded alternatives are lost over time as team composition changes.
- Architectural erosion occurs when new features inadvertently contradict earlier design invariants (e.g., embedding business rules inside HTTP routes or bypassing pessimistic locks).
- Auditors, external partners, and new engineers lack technical transparency regarding why specific design choices (such as 3NF normalization, AsyncPG, or UUID v4) were favored over alternatives.

## 2. Decision Drivers

- **Long-Term Maintainability:** Preserve the institutional memory and rationale of technical trade-offs.
- **Auditability & Compliance:** Provide a concrete audit trail aligned with IEEE 42010 (arc42 Section 9) and ISO/IEC 25010.
- **Developer Ergonomics:** Keep documentation close to code within the Git monorepo, versioned and reviewed via standard Pull Requests.
- **Low Overhead:** Use human-readable, lightweight Markdown rather than heavyweight proprietary architecture tools.

## 3. Considered Options

1. **Option 1: Informal Wiki / Confluence Pages**
   - *Pros:* Easy editing for non-developers; rich WYSIWYG editing.
   - *Cons:* Disconnected from Git version history; high risk of drift between codebase and wiki; lack of atomic PR reviews.
2. **Option 2: Formal Word/PDF Architectural Documents**
   - *Pros:* High formatting polish for executive presentations.
   - *Cons:* Heavyweight, difficult to diff in code reviews, quickly becomes obsolete.
3. **Option 3: Markdown Architectural Decision Records (MADR 3.0) in Git Repository**
   - *Pros:* Version-controlled alongside source code; reviewed via Pull Requests; zero external license cost; compatible with standard Markdown renderers.
   - *Cons:* Requires discipline from engineers to update docs when making foundational changes.

## 4. Decision Outcome

**Chosen Option:** **Option 3 — Adopt MADR 3.0 in Git Repository (`docs/adr/`)**.

All significant architectural, data modeling, concurrency, and security choices will be recorded in `docs/adr/` using sequential numbering (`ADR-0001`, `ADR-0002`, ...).

### 4.1 Positive Consequences
- Architectural decisions are transparent, immutable once accepted, and reviewable in PRs.
- Engineering onboarding time is minimized as new team members can trace the exact justification for platform constraints.
- Direct alignment with the **Documentation-First** ethos established by world-class software platforms (e.g. FlowX, Kubernetes, arc42).

### 4.2 Negative Consequences / Trade-offs
- Additional documentation step required during sprint planning and architecture reviews.
- Team members must maintain the ADR status index in [docs/adr/README.md](README.md) when proposing or superseding decisions.

---

## 5. Pros and Cons of the Options

| Evaluation Criterion | Option 1: Wiki / Confluence | Option 2: Word/PDF Docs | **Option 3: MADR in Git (Selected)** |
| :--- | :---: | :---: | :---: |
| **Git Version Parity** | ❌ None | ❌ Binary blobs | ✅ 100% Atomic with Code Commits |
| **Review Workflow** | ⚠️ Comments only | ❌ Out-of-band | ✅ GitHub PR Reviews & Fitness Gates |
| **Searchability & Grep** | ⚠️ Browser only | ❌ Opaque | ✅ Local ripgrep, IDE, and GitHub Search |
| **Long-Term Drift Risk** | ❌ High | ❌ Extremely High | ✅ Low (Directly tracked in monorepo) |

---

## 6. Links & References

- [MADR Template Repository (GitHub)](https://github.com/adr/madr)
- [Michael Nygard — Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [arc42 Template — Section 9: Architecture Decisions](https://arc42.org)
- [FlowX Architecture & ADR Specification](https://github.com/votrongdao/FlowX)
