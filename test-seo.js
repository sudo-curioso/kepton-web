/**
 * Lightweight SEO smoke test — sequential URL + JSON-LD checks.
 *
 * Usage:
 *   node test-seo.js
 *
 * Optional:
 *   BASE_URL=http://localhost:3000 node test-seo.js
 *   (rewrites https://kepton.app → BASE_URL for local verification)
 */

const fs = require('fs')
const path = require('path')

const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml')
const EXPECTED_URL_COUNT = 17
const BASE_URL = (process.env.BASE_URL || '').replace(/\/$/, '')
const FETCH_TIMEOUT_MS = 20_000

function parseSitemapUrls(xml) {
  const urls = []
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi
  let match
  while ((match = re.exec(xml)) !== null) {
    urls.push(match[1].trim())
  }
  return [...new Set(urls)]
}

function rewriteToBase(url) {
  if (!BASE_URL) return url
  try {
    const u = new URL(url)
    const base = new URL(BASE_URL)
    return `${base.origin}${u.pathname}${u.search}`
  } catch {
    return url
  }
}

function hasJsonLd(html) {
  // Matches <script type="application/ld+json"> (attribute order flexible)
  return /<script[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(html)
}

async function fetchPage(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'KeptonSEOTest/1.0 (+https://kepton.app)',
        Accept: 'text/html,application/xhtml+xml',
      },
    })
    const html = await res.text()
    return { status: res.status, html, ok: res.status === 200 }
  } finally {
    clearTimeout(timer)
  }
}

async function main() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`✗ Missing local sitemap: ${SITEMAP_PATH}`)
    process.exit(1)
  }

  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8')
  const urls = parseSitemapUrls(xml)

  console.log(`Sitemap: ${SITEMAP_PATH}`)
  console.log(`Parsed ${urls.length} unique URL(s) (expected ${EXPECTED_URL_COUNT})`)
  if (BASE_URL) console.log(`BASE_URL rewrite → ${BASE_URL}`)
  console.log('')

  if (urls.length !== EXPECTED_URL_COUNT) {
    console.warn(
      `⚠ Expected ${EXPECTED_URL_COUNT} URLs from sitemap, found ${urls.length}. Continuing…`,
    )
  }

  let passed = 0
  let failed = 0
  let missingSchema = 0

  for (let i = 0; i < urls.length; i += 1) {
    const canonical = urls[i]
    const target = rewriteToBase(canonical)
    const label = `[${i + 1}/${urls.length}]`

    process.stdout.write(`${label} GET ${target} … `)

    try {
      const { status, html, ok } = await fetchPage(target)

      if (!ok) {
        failed += 1
        console.log(`FAIL HTTP ${status}`)
        continue
      }

      const schemaOk = hasJsonLd(html)
      if (!schemaOk) {
        missingSchema += 1
        console.log('OK 200 — ⚠ missing application/ld+json')
      } else {
        passed += 1
        console.log('OK 200 — schema ✓')
      }
    } catch (err) {
      failed += 1
      const reason = err?.name === 'AbortError' ? 'timeout' : err?.message || String(err)
      console.log(`FAIL ${reason}`)
    }
  }

  console.log('')
  console.log('—— Summary ——')
  console.log(`Passed (200 + JSON-LD): ${passed}`)
  console.log(`HTTP failures:          ${failed}`)
  console.log(`Missing structured data: ${missingSchema}`)

  if (failed > 0 || missingSchema > 0 || urls.length !== EXPECTED_URL_COUNT) {
    process.exit(1)
  }

  console.log('All SEO smoke checks passed.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
