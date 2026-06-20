# AGENTS.md

Canonical instructions for AI coding agents working in this project. Tool-neutral
and read by most agents (Cursor, Cline, Codex, Copilot, Gemini, …). `CLAUDE.md`
imports this file (`@AGENTS.md`) so Claude Code reads it too. Detailed,
topic-by-topic rules live in [`.clinerules/`](./.clinerules/) and are linked below.

## Project

A backend built on [`@adaptivestone/framework`](https://framework.adaptivestone.com/)
v5: TypeScript-first, ESM-only, runs `.ts` sources natively on **Node ≥ 24** (no
build step). MongoDB + Redis backed; convention-based controllers and Mongoose models.

## Commands

- `npm run dev` — generate types + start the watch server (auto-fills `AUTH_SALT`).
- `npm run gen` — regenerate `*.routes.gen.ts` + `genTypes.d.ts`. Run after changing a `routes` getter, a model, or config.
- `npm run check:types` — `npm run gen` then `tsc --noEmit`.
- `npm test` / `npm run t` — vitest.
- `npm run check` / `npm run check:fix` — Biome lint + format.
- Docker: `docker compose up` (Mongo replicaset + Redis + Mailpit). Most commands run inside the `backend` container — see [.clinerules/02-DockerCommands.md](./.clinerules/02-DockerCommands.md).

## Core conventions (read before writing code)

- **Types are generated — never hand-write request types.** Type each handler with the generated `…Request` type (PascalCased handler name, e.g. `createPerson` → `CreatePersonRequest`) from `./<Controller>.routes.gen.ts`. `getModel(...)` / `getConfig(...)` are typed via `genTypes.d.ts` — no `as` casts. Gen files are gitignored, so a fresh clone is red until the first `npm run gen`. Never edit a `*.routes.gen.ts` by hand — regenerate. → [.clinerules/03-ControllerPattern.md](./.clinerules/03-ControllerPattern.md)
- **Controllers** extend `AbstractController`; routes are a literal `routes` getter and middleware a literal `static get middleware()` Map (must be statically analyzable — no dynamic routes). The default middleware chain is `[GetUserByToken, Auth]` (**secure by default**); override with `[]` to make a controller public.
- **Validation** is [Standard Schema](https://standardschema.dev/). Use any Standard Schema validator as a route `request:` / `query:` schema — this project uses **[zod](https://zod.dev/)**; yup ≥1.7 / valibot / arktype work the same way. The schema's inferred output becomes the typed `req.appInfo.request` / `req.appInfo.query`.
- **Models** extend `BaseModel` — statics, instance methods, and virtuals via the `modelStatics` / `modelInstanceMethods` / `modelVirtuals` getters. → [.clinerules/05-TS.md](./.clinerules/05-TS.md)
- **Responses** follow the project envelope: `{ data, message?, errors?, total?/page?/limit? }`. → [.clinerules/01-ResponceType.md](./.clinerules/01-ResponceType.md)
- **Do not** wrap handler bodies in try/catch — the framework handles errors centrally. → [.clinerules/07-ErrorHandling.md](./.clinerules/07-ErrorHandling.md)
- **ESM only** (no CommonJS / `require`) and **i18n** for every user-facing string. → [.clinerules/04-Esm.md](./.clinerules/04-Esm.md), [.clinerules/08-Internationalization.md](./.clinerules/08-Internationalization.md)

## Boot requirements

MongoDB (`MONGO_DSN`) and `AUTH_SALT` are **required** — the server fails fast
without them. `npm run dev` generates a salt automatically; otherwise run
`npm run cli generateRandomBytes`.

## Rules

Detailed, topic-by-topic project rules live in [`.clinerules/`](./.clinerules/) —
response format, Docker, controller pattern, ESM, TypeScript, private fields,
error handling, i18n. Read the relevant one before non-trivial work. Cline reads
`.clinerules/` natively; 

## Framework documentation

- Full docs: <https://framework.adaptivestone.com/>
- **LLM-ready (whole site as one file): <https://framework.adaptivestone.com/llm-context.md>**
- `npm run docs:download` saves the llm-context locally to `.clinerules/framework-docs.md` (gitignored).
