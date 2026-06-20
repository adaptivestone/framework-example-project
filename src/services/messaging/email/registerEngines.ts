import { readFile } from 'node:fs/promises';
import Mailer from '@adaptivestone/framework-module-email';

/**
 * Tiny, dependency-free email template engine.
 *
 * As of `@adaptivestone/framework-module-email` v2 no template engine is bundled.
 * Instead of pulling a heavy templating dependency (pug, ejs, …) we keep our
 * email templates as plain `.html` / `.text` files — so editors syntax-highlight
 * them natively — and support template-literal style `${variable}` interpolation
 * with a few lines here.
 *
 * We register it for the built-in `html` and `text` extensions, so every
 * `*.html` / `*.text` template in `./templates` gets interpolation.
 *
 * The registry is process-wide, so this side-effect module must be imported once
 * from every entry point that may send email: the worker bootstrap
 * (`src/server.ts`) and the test setup (`src/tests/setup.ts`).
 */
async function interpolate(
  fullPath: string,
  data: Record<string, unknown>,
): Promise<string> {
  const source = await readFile(fullPath, 'utf8');
  return source.replace(/\$\{\s*(\w+)\s*\}/g, (_, key) =>
    String(data[key] ?? ''),
  );
}

Mailer.registerTemplateEngine('html', interpolate);
Mailer.registerTemplateEngine('text', interpolate);
