// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from "node:url";

import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";

const projectRoot = new URL("./", import.meta.url);

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@images": fileURLToPath(new URL("./public/images", projectRoot)),
        "@icons": fileURLToPath(new URL("./public/icons", projectRoot)),
      },
    },
  },
});