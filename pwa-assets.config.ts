import {
  defineConfig,
  minimal2023Preset as preset,
} from '@vite-pwa/assets-generator/config'

// Regenerate the PNG icons in public/ with `bun run generate-pwa-assets`
// after changing public/logo.svg. The output is committed, so builds do not
// need to rasterize anything.
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset,
  images: ['public/logo.svg'],
})
