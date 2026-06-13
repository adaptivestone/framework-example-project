import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

// Generate a local `.env` on first start so the app can boot: the framework
// requires AUTH_SALT and fails fast without it. Called explicitly from the
// `dev` script (before nodemon), so `npm run dev` and `docker compose up` both
// just work on a fresh clone.
//
// No-op when `.env` already exists — we never overwrite your secrets. The salt
// is persisted to `.env` (not regenerated per boot) so password hashes and
// tokens stay valid across restarts.

const ENV_FILE = '.env';
const EXAMPLE_FILE = '.env.example';

if (existsSync(ENV_FILE)) {
  process.exit(0);
}

const salt = randomBytes(64).toString('hex');
let contents = existsSync(EXAMPLE_FILE) ? readFileSync(EXAMPLE_FILE, 'utf8') : '';

if (/^AUTH_SALT=.*$/m.test(contents)) {
  contents = contents.replace(/^AUTH_SALT=.*$/m, `AUTH_SALT="${salt}"`);
} else {
  contents += `${contents === '' || contents.endsWith('\n') ? '' : '\n'}AUTH_SALT="${salt}"\n`;
}

writeFileSync(ENV_FILE, contents);
console.log(`Created ${ENV_FILE} from ${EXAMPLE_FILE} with a freshly generated AUTH_SALT.`);
