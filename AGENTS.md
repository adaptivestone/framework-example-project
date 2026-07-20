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
- `npm run routes` — print the resolved route tree; `npm run openapi` — write the OpenAPI 3.1 contract to gitignored `openapi.json`.
- `npm test` — Node's built-in test runner; `npm run test:ci` — coverage thresholds and CI reports; `npm run t` — watch mode. CI runs the suite on Node 24.
- `npm run check` / `npm run check:fix` — Biome lint + format.
- `npm run cli migration/create -- --name=<name>` — scaffold a migration; `npm run cli migration/migrate` — apply pending ones. **Never hand-write a migration file.** → [.clinerules/10-Migrations.md](./.clinerules/10-Migrations.md)
- Docker: `docker compose up` (Mongo replicaset + Redis + Mailpit). Most commands run inside the `backend` container — see [.clinerules/02-DockerCommands.md](./.clinerules/02-DockerCommands.md).

## Core conventions (read before writing code)

- **Don't guess framework behavior — read the docs first.** Before non-trivial framework work (validation, file uploads, config, lifecycle, models), read the relevant section of the framework docs (`npm run docs:download` → `.clinerules/framework-docs.md`, or <https://framework.adaptivestone.com/>). Reaching for an escape hatch (`z.any()`, `as`, `@ts-ignore`) means you don't know the API yet → **read the docs, don't bypass.** Don't assume existing code is correct — verify the pattern, especially after a dependency bump.
- **Types are generated — never hand-write request types.** Type each handler with the generated `…Request` type (PascalCased handler name, e.g. `createPerson` → `CreatePersonRequest`) from `./<Controller>.routes.gen.ts`. `getModel(...)` / `getConfig(...)` are typed via `genTypes.d.ts` — no `as` casts. Gen files are gitignored, so a fresh clone is red until the first `npm run gen`. Never edit a `*.routes.gen.ts` by hand — regenerate. → [.clinerules/03-ControllerPattern.md](./.clinerules/03-ControllerPattern.md)
- **Controllers** extend `AbstractController`; routes are a literal `routes` getter and middleware a literal `static get middleware()` Map (must be statically analyzable — no dynamic routes). The default middleware chain is `[GetUserByToken, Auth]` (**secure by default**); override with `[]` to make a controller public.
- **Controller routing: route-bearing folder prefix + lowercased CLASS name.** The framework autoloads every `.ts` under `src/controllers/` and mounts each controller at `/<folder>/<classname>` lowercased (`controllers/public/Impact.ts` with `class Impact` → `/public/impact`) — the FILENAME is irrelevant to routing (it only matters for overriding framework-internal controllers by file-name collision). A fully parenthesized folder is an organizational **route group** (also called a pathless route-group directory) and contributes no URL segment: `controllers/(public)/PathlessRouteGroups.ts` → `/pathlessroutegroups`; generated `*.routes.gen.ts` files stay beside the source. Use ordinary folders for real URL prefixes and `(group)` folders only for source organization. Groups are not namespaces: if two controllers collapse onto the same method/path, boot fails. Class names can't contain dashes, so a multi-word kebab-case leaf (`/impact-surveys`) requires a `getHttpPath()` override returning the full path. Name the file after the class (PascalCase). Never export the same controller from two files — autoloading registers both and double-mounts the routes.
- **Validation** is [Standard Schema](https://standardschema.dev/). Use any Standard Schema validator as a route `request:` / `query:` schema — this project uses **[zod](https://zod.dev/)**; yup ≥1.7 / valibot / arktype work the same way. The schema's inferred output becomes the typed `req.appInfo.request` / `req.appInfo.query`. Schema error messages should be i18n **keys**; the framework translates them through the request locale before returning the HTTP 400, so never catch/retranslate them in controllers. The standard test setup intentionally leaves this project's locale folder unloaded, so ordinary API tests assert stable raw keys and status codes, not rendered prose. A route **without** a `request:`/`query:` schema leaves `req.appInfo.request`/`req.appInfo.query` **undefined** — the parser puts the parsed body (incl. multipart **files**) on `req.body`. Validate uploaded **files** with `import { File } from '@adaptivestone/framework/types.js'` + an instanceof check (zod: `z.instanceof(File)`); a file field may arrive array-wrapped. **Never `z.any()`/`as` to dodge a type** (`YupFile` is deprecated).
- **Never leak internal IDs in public URLs.** Public/CDN-served assets (avatars, uploads) and any URL visible to other users must use **opaque random keys** (e.g. a `randomUUID()`), never the user `_id` or any internal identifier in the path/filename.
- **Models** extend `BaseModel` — statics, instance methods, and virtuals via the `modelStatics` / `modelInstanceMethods` / `modelVirtuals` getters. → [.clinerules/05-TS.md](./.clinerules/05-TS.md)
- **Responses** follow the project envelope: `{ data, message?, errors?, total?/page?/limit? }`. → [.clinerules/01-ResponceType.md](./.clinerules/01-ResponceType.md)
- **Do not** wrap handler bodies in try/catch — the framework handles errors centrally. → [.clinerules/07-ErrorHandling.md](./.clinerules/07-ErrorHandling.md)
- **ESM only** (no CommonJS / `require`) and **i18n** for every user-facing string. → [.clinerules/04-Esm.md](./.clinerules/04-Esm.md), [.clinerules/08-Internationalization.md](./.clinerules/08-Internationalization.md)
- **Config & env — never read `process.env` in controllers/services.** Env vars are read **only inside `src/config/<name>.ts`** files (e.g. `config/http.ts`); code consumes them via `app.getConfig('<name>')` (sync; typed by `genTypes.d.ts` after `npm run gen` — no `as` cast). This keeps config tracked in one place. Env-specific, non-secret defaults go in `config/<name>.<NODE_ENV>.ts` (e.g. `sample.production.ts`), which the framework merges over the base config when `NODE_ENV` matches — prefer this to adding more env vars; keep only **secrets** in `.env`. → framework-docs "Environment Variables" / "NODE_ENV".
- **Rate-limit policy values belong in config.** Declare named option objects under `src/config/rateLimiter.ts` `policy`, read the typed merged config with `getAppInstance().getConfig('rateLimiter')`, and pass the selected object directly. Type the getter as `Map<string, TMiddleware>` and use `[[RateLimiter, policy.personCreate]]`; this stays type-safe and remains analyzable by the project's minimum supported framework version. Do not repeat points/duration in controllers or introduce string-based policy lookup.
- **Choose one process supervisor.** `src/server.ts` is the single-process entry for Docker, Kubernetes, systemd, and PM2. `src/index.ts` uses the framework's public `runCluster()` for a standalone multi-core host. Never combine both layers. Keep the server import inside the `runCluster` callback so the primary process supervises only and never constructs an application server.
- **Respect node:test lifecycle ordering.** Root-level `before()` hooks registered by separate modules may run concurrently. Before project setup reads config, models, `appInstance`, or the HTTP server, call `await ensureTestServerReady()` from the framework test helpers; file-local setup should live inside the relevant `describe()`. If a test uses `t.plan(n)`, every counted assertion must use `t.assert.*`. See [`.clinerules/11-Testing.md`](./.clinerules/11-Testing.md).

## Boot requirements

MongoDB (`MONGO_DSN`) and `AUTH_SALT` are **required** — the server fails fast
without them. `npm run dev` generates a salt automatically; otherwise run
`npm run cli generateRandomBytes`.

## Rules

- **Keep this repository an executable framework showcase.** For every new stable, recommended public framework capability, add the smallest runnable example, a focused test where practical, and an entry in the README feature table; if an optional capability is intentionally not enabled, record that decision there. Do not leave the only example as commented pseudocode or agent-only guidance. CI must keep the route tree and OpenAPI commands runnable.

Detailed, topic-by-topic project rules live in [`.clinerules/`](./.clinerules/) —
response format, Docker, controller pattern, ESM, TypeScript, private fields,
error handling, i18n, migrations, and testing. Read the relevant one before non-trivial work.
Cline reads `.clinerules/` natively;

## Framework documentation

- Full docs: <https://framework.adaptivestone.com/>
- **LLM-ready (whole site as one file): <https://framework.adaptivestone.com/llm-context.md>**
- `npm run docs:download` saves the llm-context locally to `.clinerules/framework-docs.md` (gitignored).
