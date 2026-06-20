# Database Migrations

Migrations let you change data or schema (or seed the database) exactly once per
deploy. Each migration file runs **once** — the framework records applied files in
the `Migration` model and skips them on the next run.

**Never hand-create a migration file.** Always scaffold it with the CLI so the
timestamped filename and `up()`/`down()` template are correct.

## Create a migration

```bash
# inside the container (preferred — see 02-DockerCommands.md)
docker compose exec backend npm run cli migration/create -- --name=addAdminFlagToUser

# or directly
node src/cli.ts migration/create --name=addAdminFlagToUser
```

Notes:

- `--name` is **required**. With `npm run cli` you MUST pass `--` before the flag
  (`npm run cli <command> -- --name=...`) so npm forwards it to the script.
- The name is camel-cased and **cannot start with a digit**.
- This writes `src/migrations/<timestamp>_<name>.ts`, e.g.
  `src/migrations/1718900000000_addAdminFlagToUser.ts`. The numeric timestamp
  prefix sets run order — do not rename the file.

The generated file looks like:

```ts
import Base from '@adaptivestone/framework/modules/Base.js';

class AddAdminFlagToUser extends Base {
  async up() {
    // put here your migration up logic
    // const User = this.app.getModel('User');
  }

  async down() {
    // put here your migration down logic
  }
}

export default AddAdminFlagToUser;
```

Implement the logic in `up()`. `this.app` is available, so use
`this.app.getModel('ModelName')` to reach models.

## Apply migrations

```bash
docker compose exec backend npm run cli migration/migrate
```

Runs all pending migrations in timestamp order. Safe to run repeatedly — already
applied files are skipped.

## Rules

- **Make `up()` idempotent.** Migrations are not wrapped in a transaction, and the
  "apply" and "record as done" steps are not atomic — if a deploy dies mid-run a
  migration can re-run. Guard against double application (e.g. check before
  writing, use upserts / `$setOnInsert`).
- One concern per migration; keep them small and ordered by the timestamp prefix.
- A branch-merged migration with an older timestamp still runs (pending = not yet
  recorded, not "newer than the last one"), so don't rely on wall-clock ordering
  across branches.
