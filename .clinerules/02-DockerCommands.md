# Docker Command Execution Standard

This project runs inside Docker containers. All commands must be executed within the appropriate Docker container context.

## Command Execution Format

### Backend Commands
For any backend-related commands (TypeScript, Node.js, npm, etc.), use:
```bash
docker compose exec backend {command}
```

### Examples:

#### TypeScript Type Check
```bash
docker compose exec backend npm run check:types
```

#### Generate Types (Required after Model Changes)
**IMPORTANT**: After creating or updating any model, you MUST regenerate types:
```bash
docker compose exec backend npm run generateTypes
```
This generates type definitions that allow `this.app.getModel('ModelName')` to work with proper types without manual casting.

#### Install Dependencies
```bash
docker compose exec backend npm install
```

#### Run Tests
```bash
docker compose exec backend npm test
```

Run tests in watch mode:
```bash
docker compose exec backend npm run t
```

Run the CI suite with coverage thresholds and LCOV output:
```bash
docker compose exec -T backend npm run test:ci
```

CI runs this suite on the Node.js 24 LTS line.

#### Run Tests Under Bun

The framework is certified on Bun >= 1.4 as a second runtime. The `backend-bun`
service (compose profile `bun`) runs the same suite there. It is a `run`, not an
`exec` — the service exists only to execute the suite and exits when it is done:

```bash
docker compose run --rm backend-bun
```

It shares the project volume with `backend`, so it reads the `node_modules` that
`npm install` produced there, and it reuses the `mongo` service. To pass extra
`bun test` arguments, spell the command out — an argument given to
`docker compose run` **replaces** the service's command rather than extending it:

```bash
docker compose run --rm backend-bun bash scripts/bun-test.sh --test-name-pattern person
```

Bun never runs on the host. See [11-Testing.md](./11-Testing.md).

#### Run Development Server
```bash
docker compose exec backend npm run dev
```

#### Database Migrations
Create a migration (scaffolds the file — never hand-write one), then apply pending ones. See [10-Migrations.md](./10-Migrations.md).
```bash
docker compose exec backend npm run cli migration/create -- --name=someName
docker compose exec backend npm run cli migration/migrate
```

#### Linting
```bash
docker compose exec backend npm run lint
```

#### Build Project
```bash
docker compose exec backend npm run build
```

## Important Rules:

1. **Never run commands directly** on the host machine for backend operations
2. **Always prefix with `docker compose exec backend`** for any Node.js/TypeScript related commands
3. **Check if containers are running** before executing commands
4. **Use the correct service name** (`backend` for this project)

## Container Status Check
To check if containers are running:
```bash
docker compose ps
```

## Starting Containers
If containers are not running:
```bash
docker compose up 
```

## Accessing Container Shell
For interactive debugging:
```bash
docker compose exec backend bash
```

## Database Access
If database operations are needed:
```bash
docker compose exec mongo mongosh
```

This ensures all commands run in the correct environment with proper dependencies and configurations.
