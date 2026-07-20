# AdaptiveStone Framework starter project

Clone this repository and use it as a template for your projects.

Read the [AdaptiveStone Framework documentation](https://framework.adaptivestone.com/docs/intro)
for installation, configuration, and API guides.

## Included features

This project includes working examples of the framework features commonly used
when building an application.

| Feature | Where to look |
|---|---|
| Controller auto-loading and pathless route-group directories | [`src/controllers/(public)/PathlessRouteGroups.ts`](src/controllers/(public)/PathlessRouteGroups.ts) is physically grouped but serves `GET /pathlessroutegroups`; its test also proves `/(public)/pathlessroutegroups` is not public. |
| Standard Schema validation, generated request types, Zod input coercion, and resilient OpenAPI | [`PathlessRouteGroups.ts`](src/controllers/(public)/PathlessRouteGroups.ts) uses `z.coerce.date()`; [`Person.ts`](src/controllers/Person.ts) validates a request body. `npm run gen` types both handlers and `npm run openapi` documents them. |
| Cache with memory/Redis driver portability | [`PathlessRouteGroups.ts`](src/controllers/(public)/PathlessRouteGroups.ts) uses the default memory-backed `app.cache.getSetValue()` API; selecting Redis requires no controller change. |
| Typed HTTP errors | [`Person.ts`](src/controllers/Person.ts) throws `NotFoundError` and lets the framework render the response centrally. |
| Authentication middleware and typed authenticated users | [`Profile.ts`](src/controllers/Profile.ts) uses `GetUserByToken` + `Auth`; generated types make `req.appInfo.user` non-null. |
| Typed config and named rate-limit policies | [`rateLimiter.ts`](src/config/rateLimiter.ts) declares the policy consumed by [`Person.ts`](src/controllers/Person.ts). |
| Model schemas, statics, instance methods, and virtuals | [`Person.ts`](src/models/Person.ts) demonstrates every model extension surface. |
| Email module, custom template engines, and localized templates | [`Email.ts`](src/controllers/Email.ts), [`registerEngines.ts`](src/services/messaging/email/registerEngines.ts), and [`src/locales/`](src/locales/). |
| HTTP boot hook and external observability integration | [`server.ts`](src/server.ts) keeps the typed `bootHttp` hook next to its owner, registers the live `GET /health` route, and initializes Sentry. |
| Single-process and clustered deployment | [`server.ts`](src/server.ts) is supervisor-friendly; [`index.ts`](src/index.ts) uses the public `runCluster()` helper. |
| Framework-aware testing | [`src/tests/`](src/tests/) integrates Node's test runner with the framework lifecycle; [`setupHooks.ts`](src/tests/setupHooks.ts) shows safe server readiness, and controller/model tests are colocated. |
| Operational CLI | [`src/cli.ts`](src/cli.ts) propagates command failures through the process exit code; `npm run routes`, `npm run openapi`, `npm run gen`, and `npm run cli migration/create -- --name=<name>` expose routing, API contracts, generated types, and migrations. |

## Runtime support

Node.js 24 or newer is required. CI currently runs on the Node.js 24 LTS line.

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
- When using `t.plan(n)`, make every assertion through `t.assert.*`; separately
  imported `node:assert` calls are not counted by the plan.

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
