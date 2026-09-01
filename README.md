# AdaptiveStone Framework starter project

Clone this repository and use it as a template for your projects.

Read the [AdaptiveStone Framework documentation](https://framework.adaptivestone.com/docs/intro)
for installation, configuration, and API guides.

## Included features

This project includes working examples of the framework features commonly used
when building an application.

| Feature | Where to look |
|---|---|
| Controller auto-loading, pathless route groups, and framework overrides | [`PathlessRouteGroups.ts`](src/controllers/(public)/PathlessRouteGroups.ts) is physically grouped but serves `GET /pathlessroutegroups`; [`Auth.ts`](src/controllers/(framework)/Auth.ts) stays at `/auth` and replaces the framework controller even from inside a group. |
| Standard Schema validation, generated request types, Zod input coercion, and resilient OpenAPI | [`PathlessRouteGroups.ts`](src/controllers/(public)/PathlessRouteGroups.ts) uses `z.coerce.date()` and Pagination; [`Person.ts`](src/controllers/Person.ts) validates a request body. `npm run gen` types both handlers and `npm run openapi` documents them, including Pagination's `page` and `limit`. |
| Cache with memory/Redis driver portability | [`PathlessRouteGroups.ts`](src/controllers/(public)/PathlessRouteGroups.ts) uses the default memory-backed `app.cache.getSetValue()` API; selecting Redis requires no controller change. |
| Typed HTTP errors | [`Person.ts`](src/controllers/Person.ts) throws `NotFoundError` and lets the framework render the response centrally. |
| Authentication middleware and typed authenticated users | [`Profile.ts`](src/controllers/Profile.ts) uses `GetUserByToken` + `Auth`; generated types make `req.appInfo.user` non-null. |
| Typed config and named rate-limit policies | [`rateLimiter.ts`](src/config/rateLimiter.ts) declares the policy consumed as route-level middleware by [`Person.ts`](src/controllers/Person.ts); [`http.ts`](src/config/http.ts) demonstrates homogeneous arrays generated as reusable `string[]` types. |
| Static and runtime model lookup | [`Person.ts`](src/controllers/Person.ts) uses precise literal `getModel('Person')`; [`Person.test.ts`](src/models/Person.test.ts) demonstrates the explicit throwing `getModelOrThrow(name)` boundary for a runtime string. |
| Model schemas, statics, instance methods, and virtuals | [`Person.ts`](src/models/Person.ts) keeps one readonly runtime schema, uses private schema-derived authoring contexts inside the unfinished class, and exports only the complete normal Mongoose model type. |
| Email module, custom template engines, and localized templates | [`Email.ts`](src/controllers/Email.ts), [`registerEngines.ts`](src/services/messaging/email/registerEngines.ts), and [`src/locales/`](src/locales/). |
| Overriding and translating framework messages | [`src/locales/`](src/locales/) define `middleware.auth.notLoggedIn`, so the auth 401 answers with this project's wording — and its Russian translation — instead of the framework's built-in English. See [Translating framework messages](#translating-framework-messages). |
| Bun as a second runtime | the `backend-bun` compose service runs the whole suite under Bun ≥ 1.4 via [`scripts/bun-test.sh`](scripts/bun-test.sh); [`setupBunTest.ts`](src/tests/setupBunTest.ts) is the one Bun-specific line of test glue. |
| HTTP boot hook, tested, and external observability integration | [`bootHttp.ts`](src/bootHttp.ts) holds the typed `bootHttp` hook that registers the live `GET /health` route; [`server.ts`](src/server.ts) passes it to the production server and initializes Sentry, while [`configureServer.ts`](src/tests/configureServer.ts) passes the same hook to the test server through `configureTestServer`, so [`bootHttp.test.ts`](src/bootHttp.test.ts) covers `/health`. |
| Single-process and clustered deployment | [`server.ts`](src/server.ts) is supervisor-friendly; [`index.ts`](src/index.ts) uses the public `runCluster()` helper. |
| Framework-aware testing | [`src/tests/`](src/tests/) integrates Node's test runner with the framework lifecycle; [`setupHooks.ts`](src/tests/setupHooks.ts) shows safe server readiness, and controller/model tests are colocated. |
| Operational CLI | [`src/cli.ts`](src/cli.ts) propagates command failures through the process exit code; `npm run routes`, `npm run openapi`, `npm run gen`, and `npm run cli migration/create -- --name=<name>` expose routing, API contracts, generated types, and migrations. |

## Runtime support

Node.js 24 or newer is required, and is the primary runtime — CI runs on the
Node.js 24 LTS line. Framework 5.4 also certifies **Bun 1.4 or newer**: the same
sources, the same Express adapter, no Bun-specific build. This project's test
suite passes on both; see [Testing](#testing). Two things stay Node-only —
`npm run start:cluster` (the framework's `runCluster()` is tested only on Node,
so run single-process under Bun) and Node's test-runner CLI, which Bun replaces
with `bun test`.

## Testing

Run backend commands inside Docker:

```bash
docker compose exec -T backend npm test
docker compose exec backend npm run t
docker compose exec -T backend npm run test:ci
```

- `npm test` runs the suite once with Node's built-in test runner.
- `npm run t` reruns affected tests in watch mode.
- `npm run test:ci` enforces 80% line coverage, 80% branch coverage, and 75%
  function coverage, and writes `coverage/lcov.info`.
- A root-level application setup hook must call `await ensureTestServerReady()`
  before it reads framework config, models, or the HTTP server.
- App-wide HTTP wiring is tested, not just deployed:
  [`src/tests/configureServer.ts`](src/tests/configureServer.ts) declares the
  test server's options with `configureTestServer({ bootHttp })`, so the
  `GET /health` route the hook registers answers under test exactly as in
  production. The call has to happen before the framework preload boots the
  server, which is why [`setupNodeTest.ts`](src/tests/setupNodeTest.ts) imports
  that module first.
- When using `t.plan(n)`, make every assertion through `t.assert.*`; separately
  imported `node:assert` calls are not counted by the plan.

### Under Bun

The same suite runs on Bun through its own container — nothing Bun-related runs
on the host:

```bash
docker compose run --rm backend-bun
```

The `backend-bun` service (compose profile `bun`) shares the project volume, so
it reads the `node_modules` the `backend` service installed, and it reuses the
`mongo` service instead of starting a database of its own.

`bun test` implements the `node:test` API but not `node --test`, so
[`scripts/bun-test.sh`](scripts/bun-test.sh) maps the flags: `--import` becomes
`--preload`, `--test-global-setup` becomes a `TEST_MONGO_URI` handed over
through the environment, and `--isolate` gives each test file its own module
registry — and therefore its own `Server`, exactly as under Node. Point
`TEST_MONGO_URI` somewhere else to use a different database. One extra preload,
[`setupBunTest.ts`](src/tests/setupBunTest.ts), awaits the server-readiness gate
that `bun test` does not await on its own. No test in this project uses
`mock.module()`, which Bun does not implement, so nothing is excluded from the
Bun run.

## Translating framework messages

Every message the framework returns — the auth 401, role and rate-limit
refusals, request-parser errors, the 404 and 500 sinks, the built-in auth
validation and emails — is emitted as an i18n key carrying its current English
text as an in-code default. Nothing has to be copied for those to read as
English sentences, and **a key present in this project's locales wins**, so
translating or rewording one needs only that key in
`src/locales/<lng>/translation.json`.

`src/locales/en` and `src/locales/ru` show this with the auth middleware:

```jsonc
// src/locales/en/translation.json — reworded, not translated
{ "middleware": { "auth": { "notLoggedIn": "Please sign in to continue" } } }
// src/locales/ru/translation.json
{ "middleware": { "auth": { "notLoggedIn": "Пожалуйста, войдите в систему, чтобы продолжить" } } }
```

```console
$ curl -s localhost:3300/profile
{"error":"AUTH001","message":"Please sign in to continue"}
$ curl -s -H 'X-Lang: ru' localhost:3300/profile
{"error":"AUTH001","message":"Пожалуйста, войдите в систему, чтобы продолжить"}
```

Without the key the framework would answer with its own default,
`Please login to application`. The request locale comes from the `X-Lang`
header, the `?lng=` query parameter, or the authenticated user's `locale` —
not from `Accept-Language`.

The translation engine itself is **this project's** dependency: framework 5.4
made `i18next` and `i18next-fs-backend` optional peers, so any app that ships
locale files must depend on them directly, as this one does. Drop them and the
framework keeps serving every message in English, logging one warning on the
first request that would have needed a translator.

## Inspect the application contract

```bash
npm run routes
npm run openapi
```

`routes` prints the runtime route tree. `openapi` writes the generated OpenAPI
3.1 document to the gitignored `openapi.json` file without opening a database,
network connection, or listening port.

## Production process

- `npm start` runs one server process. Use this under Docker, Kubernetes,
  systemd, PM2, or another external supervisor.
- `npm run start:cluster` uses the framework's public `runCluster()` helper to
  run one worker per available CPU, forward shutdown signals, and apply the
  framework's fixed crash-loop safety policy. Use it only when this Node
  process should supervise all workers on a single host.

Do not combine framework clustering with PM2 cluster mode or multiple workers
inside each container; choose one owner for process count and restarts.
