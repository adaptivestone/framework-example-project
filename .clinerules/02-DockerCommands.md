# Docker Command Execution Standard

This project runs inside Docker containers. All commands must be executed within the appropriate Docker container context.

## Command Execution Format

### Backend Commands
For any backend-related commands (TypeScript, Node.js, npm, etc.), use:
```bash
docker compose exec backend {command}
```

### Examples:

#### TypeScript Compilation Check
```bash
docker compose exec backend npx tsc --noEmit
```

#### Install Dependencies
```bash
docker compose exec backend npm install
```

#### Run Tests
```bash
docker compose exec backend npm test
```

#### Run Development Server
```bash
docker compose exec backend npm run dev
```

#### Database Operations
```bash
docker compose exec backend npm run migrate
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
