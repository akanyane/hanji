import { describe, expect, it } from 'vitest'
import committed from '../../public/sitemap.xml?raw'
import { sitemapPaths, sitemapXml } from './sitemap'

describe('sitemap', () => {
  it('lists unique paths', () => {
    const paths = sitemapPaths()
    expect(new Set(paths).size).toBe(paths.length)
    expect(paths).toContain('/grammar/passive-voice')
    expect(paths).toContain('/progress/exam/mock-3')
  })

  it('is up to date (run `bun run generate-sitemap` after adding content)', () => {
    expect(committed).toBe(sitemapXml())
  })
})
