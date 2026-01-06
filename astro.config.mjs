// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://asierzapata.com',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx({
    remarkPlugins: [remarkReadingTime],
  })]
});