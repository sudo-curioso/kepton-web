/**
 * CDN / edge SEO audit — production crawl with AI user-agent.
 *
 * Usage:
 *   node test-cdn-seo.js
 *
 * Reads local sitemap.xml, requests each URL as ChatGPT-User, and validates:
 * - final HTTP 200
 * - Cache-Control is not private / no-store
 * - X-Robots-Tag does not contain noindex
 * - Location redirects are reported (flag multi-hop / loops)
 */

const fs = require('fs')
const path = require('path')

const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml')
const PRODUCTION_ORIGIN = 'https://kepton.app'
const AI_UA = 'ChatGPT-User'
const FETCH_TIMEOUT_MS = 20_000
const MAX_REDIRECT_HOPS = 5

function parseSitemapUrls(xml) {
  const urls = []
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi
  let match
  while ((match = re.exec(xml)) !== null) {
    urls.push(match[1].trim())
  }
  return [...new Set(urls)]
}

function isBadCacheControl(value) {
  if (!value) return { bad: true, reason: 'missing Cache-Control' }
  const v = value.toLowerCase()
  if (/\bprivate\b/.test(v)) return { bad: true, reason: 'contains private' }
  if (/\bno-store\b/.test(v)) return { bad: true, reason: 'contains no-store' }
  return { bad: false }
}

function isBadRobotsTag(value) {
  if (!value) return { bad: false, note: 'absent (OK for public pages)' }
  const v = value.toLowerCase()
  if (/\bnoindex\b/.test(v)) return { bad: true, reason: 'contains noindex' }
  return { bad: false, note: value }
}

async function fetchHop(url, signal) {
  return fetch(url, {
    method: 'GET',
    redirect: 'manual',
    signal,
    headers: {
      'User-Agent': AI_UA,
      Accept: 'text/html,application/xhtml+xml',
    },
  })
}

/**
 * Follow redirects manually so we can log every Location hop and detect loops.
 */
async function fetchWithRedirectAudit(startUrl) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  const hops = []
  let current = startUrl
  const seen = new Set()

  try {
    for (let i = 0; i < MAX_REDIRECT_HOPS; i += 1) {
      if (seen.has(current)) {
        return {
          ok: false,
          status: 0,
          finalUrl: current,
          hops,
          headers: {},
          error: `redirect loop detected at ${current}`,
        }
      }
      seen.add(current)

      const res = await fetchHop(current, controller.signal)
      const location = res.headers.get('location')
      hops.push({ url: current, status: res.status, location: location || null })

      if (res.status >= 300 && res.status < 400 && location) {
        current = new URL(location, current).toString()
        continue
      }

      // Drain body so sockets close cleanly
      await res.arrayBuffer().catch(() => null)

      const headers = {
        'cache-control': res.headers.get('cache-control'),
        'x-robots-tag': res.headers.get('x-robots-tag'),
        location: location,
      }

      return {
        ok: res.status === 200,
        status: res.status,
        finalUrl: current,
        hops,
        headers,
        error: null,
      }
    }

    return {
      ok: false,
      status: 0,
      finalUrl: current,
      hops,
      headers: {},
      error: `exceeded ${MAX_REDIRECT_HOPS} redirect hops`,
    }
  } finally {
    clearTimeout(timer)
  }
}

async function main() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`✗ Missing local sitemap: ${SITEMAP_PATH}`)
    process.exit(1)
  }

  const urls = parseSitemapUrls(fs.readFileSync(SITEMAP_PATH, 'utf8'))
  console.log(`CDN SEO audit — origin ${PRODUCTION_ORIGIN}`)
  console.log(`UA: ${AI_UA}`)
  console.log(`URLs from sitemap: ${urls.length}`)
  console.log('')

  let passed = 0
  let failed = 0

  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[i]
    console.log(`[${i + 1}/${urls.length}] ${url}`)

    try {
      const result = await fetchWithRedirectAudit(url)

      if (result.hops.length > 1) {
        for (const hop of result.hops.slice(0, -1)) {
          console.log(`  ↳ ${hop.status} Location: ${hop.location}`)
        }
      } else if (result.hops[0]?.location) {
        console.log(`  ⚠ unexpected Location on final hop: ${result.hops[0].location}`)
      }

      if (result.error) {
        failed += 1
        console.log(`  ✗ FAIL ${result.error}`)
        console.log('')
        continue
      }

      const statusOk = result.status === 200
      console.log(`  HTTP: ${result.status}${statusOk ? ' OK' : ' ✗ expected 200'}`)
      if (result.finalUrl !== url) {
        console.log(`  Final URL: ${result.finalUrl}`)
      }

      const cc = result.headers['cache-control']
      const ccCheck = isBadCacheControl(cc)
      console.log(`  Cache-Control: ${cc || '(none)'}${ccCheck.bad ? ` ✗ ${ccCheck.reason}` : ' ✓'}`)

      const robots = result.headers['x-robots-tag']
      const robotsCheck = isBadRobotsTag(robots)
      console.log(
        `  X-Robots-Tag: ${robots || '(none)'}${robotsCheck.bad ? ` ✗ ${robotsCheck.reason}` : ' ✓'}`,
      )

      const redirectsSuspicious =
        result.hops.filter(h => h.status === 301 || h.status === 308).length > 1

      if (redirectsSuspicious) {
        console.log('  ⚠ multiple 301/308 hops — possible redirect loop risk')
      }

      if (statusOk && !ccCheck.bad && !robotsCheck.bad && !result.error) {
        passed += 1
        console.log('  Result: PASS')
      } else {
        failed += 1
        console.log('  Result: FAIL')
      }
    } catch (err) {
      failed += 1
      const reason = err?.name === 'AbortError' ? 'timeout' : err?.message || String(err)
      console.log(`  ✗ FAIL ${reason}`)
    }

    console.log('')
  }

  console.log('—— Summary ——')
  console.log(`Passed: ${passed}`)
  console.log(`Failed: ${failed}`)

  if (failed > 0) process.exit(1)
  console.log('CDN SEO audit passed.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
