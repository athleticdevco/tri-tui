#!/usr/bin/env node
// Load .env BEFORE any other imports (must be synchronous at top level)
import { config } from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '..', '.env'), quiet: true });

// Now import the app (after env is loaded)
const { default: React } = await import('react');
const { render } = await import('ink');
const { App } = await import('./App.js');

render(<App />);
