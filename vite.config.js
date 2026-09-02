import { join } from 'node:path'

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

import { loadPosts, CONTENT_DIR } from './scripts/blog/posts.mjs'
import { loadHeroEvents } from './scripts/hero-events.mjs'

const VIRTUAL_ID = 'virtual:blog-posts'
const RESOLVED_ID = '\0' + VIRTUAL_ID

// Compiles content/blog on the server and hands the result to the browser as a
// module. Markdown, highlighting, and math all stay in Node, so none of
// marked/shiki/katex ships to the client.
//
// Drafts are included in dev and dropped from production builds, which is also
// what keeps them out of the prerendered pages, RSS, and sitemap.
const blogPlugin = () => {
  let isDev = false

  return {
    name: 'blog-content',

    configResolved(config) {
      isDev = config.command === 'serve'
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    async load(id) {
      if (id !== RESOLVED_ID) return
      const posts = await loadPosts({ includeDrafts: isDev, root: process.cwd() })
      return `export const posts = ${JSON.stringify(posts)}`
    },

    configureServer(server) {
      server.watcher.add(join(process.cwd(), CONTENT_DIR))

      // Editing a post should refresh the page, not require a restart.
      const invalidate = (file) => {
        if (!file.includes(CONTENT_DIR)) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }

      server.watcher.on('add', invalidate)
      server.watcher.on('change', invalidate)
      server.watcher.on('unlink', invalidate)
    },
  }
}

// Real GitHub activity, fetched in Node at build time. The token stays here:
// only the normalised events cross into the bundle. A failure inside
// loadHeroEvents resolves to fewer events rather than throwing, so the worst
// case is an empty array and a hero with no panel.
const heroEventsPlugin = () => {
  const VIRTUAL = 'virtual:hero-events'
  const RESOLVED = '\0' + VIRTUAL

  return {
    name: 'hero-events',

    resolveId(id) {
      if (id === VIRTUAL) return RESOLVED
    },

    async load(id) {
      if (id !== RESOLVED) return
      const events = await loadHeroEvents({
        token: process.env.GITHUB_TOKEN,
        root: process.cwd(),
      })
      return `export const events = ${JSON.stringify(events)}`
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    blogPlugin(),
    heroEventsPlugin(),
  ],
})
