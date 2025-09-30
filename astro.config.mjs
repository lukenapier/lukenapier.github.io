import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { syncVault } from './scripts/sync-vault.mjs';

export default defineConfig({
  site: 'https://lukenapier.github.io',
  output: 'static',
  integrations: [tailwind({ applyBaseStyles: false })],
  markdown: {
    remarkPlugins: [remarkGfm, remarkSmartypants],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: {
            class: 'heading-anchor opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100',
            'aria-hidden': 'true',
          },
          content: {
            type: 'text',
            value: '#',
          },
        },
      ],
    ],
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
  vite: {
    server: {
      fs: {
        allow: ['.'],
      },
    },
  },
  hooks: {
    'astro:config:setup': async () => {
      await syncVault();
    },
  },
});
