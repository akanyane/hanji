// Writes public/sitemap.xml from the content (bun run generate-sitemap).
// A test fails when the committed file is out of date.
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { sitemapPaths, sitemapXml } from '../src/seo/sitemap'

const file = join(import.meta.dir, '..', 'public', 'sitemap.xml')
writeFileSync(file, sitemapXml())
console.log(`${sitemapPaths().length} URLs → ${file}`)
