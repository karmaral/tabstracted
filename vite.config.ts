import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { defineConfig } from "vite";

const srcDir = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
    resolve: {
        alias: {
            src: srcDir,
            '$features': resolve(srcDir, 'main', 'features'),
            '$lib': resolve(srcDir, 'main', 'lib'),
            '$types': resolve(srcDir, 'types'),
        },
    },
    build: {
      minify: import.meta.env.PROD,
      rollupOptions: {
          input: {
              background: resolve(srcDir, 'background', 'index.ts'),
              main: resolve(srcDir, 'main', 'index.html'),
          },
          output: {
              entryFileNames: (chunk) => `src/${chunk.name}/index.js`,
          },
      },
    },
});
