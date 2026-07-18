# Sample project for ADS-framework

Clone this repository and use it as a template for your projects.

The whole documentation can be found here: [AdaptiveStone Framework Documentation](https://framework.adaptivestone.com/docs/intro)

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

## Production process

- `npm start` runs one server process. Use this under Docker, Kubernetes,
  systemd, PM2, or another external supervisor.
- `npm run start:cluster` uses the framework's public `runCluster()` helper to
  run one worker per available CPU, forward shutdown signals, and apply the
  framework's fixed crash-loop safety policy. Use it only when this Node
  process should supervise all workers on a single host.

Do not combine framework clustering with PM2 cluster mode or multiple workers
inside each container; choose one owner for process count and restarts.
