import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://22-factor-apps.github.io',
  trailingSlash: 'ignore',
  redirects: {
    '/factors/port-binding': '/retired#port-binding',
    '/factors/logs': '/retired#logs',
    '/factors/identity-least-privilege': '/factors/secure-by-design',
    '/factors/operational-ownership': '/factors/outcome-ownership',
  },
});
