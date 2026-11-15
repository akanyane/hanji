// Renders scripts/og/og-image.html to public/og-image.jpg (1200×630), the
// image shown when a link to the app is shared.
//
//   bun run generate-og-image
//
// Needs a Chromium: set CHROME_PATH, or have Chrome installed.
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright-core'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const browser = await chromium.launch(
  process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : { channel: 'chrome' },
)
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.goto(pathToFileURL(join(root, 'scripts/og/og-image.html')).href)
await page.evaluate(() => document.fonts.ready)
// JPEG keeps it well under the ~300 KB that link previews (WhatsApp) accept.
await page.screenshot({
  path: join(root, 'public/og-image.jpg'),
  type: 'jpeg',
  quality: 90,
})
await browser.close()
console.log('public/og-image.jpg')
