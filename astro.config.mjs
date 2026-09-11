import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://22-factor-apps.github.io',
  trailingSlash: 'ignore',
  redirects: {
    '/factors/port-binding': '/retired#port-binding',
    '/factors/logs': '/retired#logs',
    '/factors/identity-least-privilege': '/factors/secure-by-design',
    '/factors/operational-ownership': '/research#revision-2026-3',
    '/factors/outcome-ownership': '/research#revision-2026-3',
    '/factors/cost-architecture': '/research#revision-2026-3',
  },
});
