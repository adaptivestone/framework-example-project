#!/usr/bin/env node

/**
 * Script to download Adaptive Stone Framework documentation
 * to the .clinerules folder for offline reference
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_URL = 'https://framework.adaptivestone.com/llm-context.md';
const OUTPUT_DIR = join(__dirname, '..', '.clinerules');
const OUTPUT_FILE = join(OUTPUT_DIR, 'framework-docs.md');

async function downloadDocs(): Promise<void> {
  try {
    console.log('📥 Downloading Adaptive Stone Framework documentation...');
    console.log(`   URL: ${DOCS_URL}`);

    const response = await fetch(DOCS_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const content = await response.text();

    // Ensure the .clinerules directory exists
    await mkdir(OUTPUT_DIR, { recursive: true });

    // Write the documentation file
    await writeFile(OUTPUT_FILE, content, 'utf8');

    console.log('✅ Documentation downloaded successfully!');
    console.log(`   Saved to: ${OUTPUT_FILE}`);
    console.log(`   Size: ${(content.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error(
      '❌ Error downloading documentation:',
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

downloadDocs();
