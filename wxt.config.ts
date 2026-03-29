import { defineConfig } from 'wxt';
import { resolve } from 'node:path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  alias: {
    '$types': resolve('src/types'),
    '$lib': resolve('src/lib'),
    '$libF': resolve('src/lib/frontend'),
    '$libB': resolve('src/lib/background'),
    '$features': resolve('src/entrypoints/tabstracted/features'),
    '$states': resolve('src/lib/frontend/states.svelte.ts'),
  },
  manifest: {
    name: 'Tabstracted - Tab Manager',
    version: '0.4.0',
    action: {
      default_title: 'Tabstracted',
    },
    default_locale: 'en',
    permissions: [
      'storage',
      'unlimitedStorage',
      'tabs',
      'tabGroups',
      'activeTab',
      'scripting',
    ],
    host_permissions: [
      'http://*/*',
      'https://*/*',
    ],
  },
});
