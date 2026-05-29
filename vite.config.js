import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import VueDevTools from 'vite-plugin-vue-devtools'

// Paksa agar editor yang dibuka saat inspeksi adalah Antigravity IDE
process.env.LAUNCH_EDITOR = 'antigravity-ide'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueDevTools({
      launchEditor: 'antigravity-ide',
    }),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => (tag.startsWith('Tres') && tag !== 'TresCanvas') || tag === 'primitive',
        },
      },
    }),
    tailwindcss(),
  ],
})
