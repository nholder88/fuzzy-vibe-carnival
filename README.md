# Home Organization System (fuzzy-vibe-carnival)

> Polyglot microservices app for household management - chores, inventory, shopping lists with Instacart, household membership. The GitHub repo name is auto-generated; the real project is spec'd in `VibeCodingSpec.md`.

## Problem

Households coordinate chores, pantry state, and shopping across several people and apps. This is both a unified household app and a deliberate playground for event-driven polyglot microservices (Node, Python, .NET, Kafka, Postgres, Redis) with two frontends (Next.js + Angular).

## Goal

Build a realistic multi-language microservice stack where chores, inventory, shopping (with Instacart), households, and auth live in their own services, talk over Kafka, and share a single Postgres - runnable locally with `docker compose` and deployable via the included Terraform.

## Approach

Monorepo: `backend/` + `frontend/` + `infrastructure/`, orchestrated by a root `docker-compose.yml`. Services by language:

- `backend/auth-service` - **NestJS** (TS): JWT auth, users, seeds, tests
- `backend/chore-service` - **Express** (Node/TS): routes, controllers, cron, `schema.sql`, tests
- `backend/inventory-service` - **FastAPI** (Python)
- `backend/shopping-service` - **.NET** (ASP.NET Core); intended owner of Instacart integration
- `backend/household-service` - **Express** (Node): skeleton for households + membership

Frontends live side-by-side: `frontend/next` (Next.js, login + chores pages) and `frontend/angular` (scaffold). `infrastructure/` holds Terraform + Docker. `start-services.sh` brings up Kafka/Postgres/Redis/Zookeeper in Docker and launches each service in its own terminal; `docker compose up` runs everything in-container. pnpm workspaces cover Node services and the Next frontend.

## Implemented features

- Auth service: NestJS app with JWT, user model, seeds, Dockerfile, passing tests
- Chore service: Express routes + controllers, cron, `schema.sql`, tests
- Inventory service: FastAPI skeleton (`app/`)
- Shopping service: .NET solution with `src/ShoppingService.API` entry
- Household service: Express skeleton
- Next.js frontend with login + chores pages (shadcn/ui, Tailwind)
- Angular frontend scaffold
- Root `docker-compose.yml` with Postgres, Redis, Kafka, Zookeeper
- Conventional commits (`commitlint` + `commitizen` + Husky)
- Active Dependabot (bumps through Nov 2025)

## What's left to reach the goal

- [ ] Wire Kafka as an actual event bus between services (topics and consumers are spec'd, not running)
- [ ] Instacart API integration inside the .NET shopping service
- [ ] Flesh out the household service (membership, invitations, roles per `VibeCodingSpec.md`)
- [ ] End-to-end flow across services (inventory low -> shopping list entry -> Instacart order)
- [ ] Apply the Terraform in `infrastructure/` against a real cloud target
- [ ] Pick one frontend (Next vs Angular) instead of maintaining both
- [ ] Optional: rename repo to `home-organization-system` so search matches

## Getting started

Everything runs from the repo root.

**Docker-only (simplest):**

```bash
docker compose build
docker compose up -d
```

Ports: frontend `:4200`, auth `:3003`, chore `:3001`, inventory `:8000`, shopping `:5000`, household `:3002`.

**Hybrid local dev** (infra in Docker, services on host):

```bash
./start-services.sh
```

This is the main entry point - brings up Postgres/Redis/Kafka/Zookeeper in Docker, then opens one terminal per service (`pnpm start` for Node, `uvicorn app.main:app --reload` for FastAPI, `dotnet run --project src/ShoppingService.API` for .NET). Prereqs: Node 18+, pnpm 8+, Python 3.10+, .NET 7+, Docker.

Commits go through `npm run commit`. See `VibeCodingSpec.md` for the data model.

## Status

**Current:** prototype - 40% complete

The most ambitious repo in this cleanup batch: ~7MB, 11 commits in the last year, active Dependabot. Individual services build and run, and the Next frontend talks to auth and chores. The cross-service story (Kafka, Instacart, full "inventory -> shopping -> order" loop) is not there yet. Last commit: 2025-11-06 (Dependabot). Repo rename on GitHub is optional but recommended.

---

*Part of Nigel's personal project cleanup (April 2026). See problem statement above for what this is supposed to solve.*
