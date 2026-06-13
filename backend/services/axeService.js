
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { readFileSync } from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core')
const axeSource = readFileSync(axePath, 'utf8')

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const waitForPageToSettle = async (page) => {
  try {
    await page.waitForNetworkIdle({ idleTime: 1000, timeout: 15000 })
  } catch {
    console.log('Network did not become fully idle; continuing after fallback wait')
  }

  await delay(3000)
}

const scrollThroughPage = async (page) => {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let totalHeight = 0
      const distance = 600
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer)
          window.scrollTo(0, 0)
          resolve()
        }
      }, 150)
    })
  })
}

const getExecutablePath = async () => {
  if (process.env.NODE_ENV === 'production') {
    return await chromium.executablePath()
  }

  const { executablePath } = await import('puppeteer')
  return executablePath()
}

export const scanWebsite = async (url) => {
  let browser = null

  try {
    console.log('Starting scan:', url)

    const isProduction = process.env.NODE_ENV === 'production'

    browser = await puppeteer.launch(
      isProduction
        ? {
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        }
        : {
          executablePath: await getExecutablePath(),
          headless: true,
        }
    )

    const page = await browser.newPage()

    await page.setViewport({
      width: 1366,
      height: 900,
      deviceScaleFactor: 1
    })

    console.log('New page created')

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    })

    console.log('Page loaded')

    await waitForPageToSettle(page)
    await scrollThroughPage(page)
    await waitForPageToSettle(page)

    console.log('Loaded page title:', await page.title())
    console.log('Loaded page URL:', page.url())

    await page.evaluate(axeSource)
    console.log('Axe injected')

    const axeLoaded = await page.evaluate(() => typeof axe)
    console.log('Axe type:', axeLoaded)

    if (axeLoaded === 'undefined') {
      throw new Error('Axe-core failed to load on this page')
    }

    const results = await page.evaluate(async () => {
      return await axe.run()
    })

    console.log('Axe scan completed')

    const violations = results.violations.map(violation => ({
      id: violation.id,
      description: violation.description,
      impact: violation.impact,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map(node => ({
        html: node.html,
        failureSummary: node.failureSummary,
        target: node.target,
        xpath: node.xpath
      }))
    }))

    return violations

  } catch (error) {
    console.log('SCAN ERROR:')
    console.log(error)

    const msg = error.message || ''

    if (msg.includes('ERR_NAME_NOT_RESOLVED')) {
      throw new Error('Website not found. Please check the URL and try again.')
    }

    if (
      msg.includes('ERR_HTTP2_PROTOCOL_ERROR') ||
      msg.includes('ERR_HTTP_RESPONSE_CODE_FAILURE')
    ) {
      throw new Error('This website blocks automated scanners. Try a different URL.')
    }

    if (msg.includes('TimeoutError') || msg.includes('timeout')) {
      throw new Error('Website took too long to load. Please try again.')
    }

    if (msg.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error('Could not connect to this website. It may be down.')
    }

    if (msg.includes('failed to load')) {
      throw new Error('This website blocked the accessibility scanner. Try a different URL.')
    }

    throw new Error('Could not scan this website. Please try a different URL.')

  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
