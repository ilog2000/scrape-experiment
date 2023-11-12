import Playwright from 'playwright'

export async function withContext<TReturn>(
  callback: (context: Playwright.BrowserContext) => Promise<TReturn>,
): Promise<TReturn> {
  const browser = await Playwright.chromium.launch()
  const context = await browser.newContext()
  try {
    const result = await callback(context)
    return result
  } finally {
    await browser.close()
  }
}

export async function withPage<TReturn>(
  url: string,
  callback: (page: Playwright.Page) => Promise<TReturn>,
): Promise<TReturn> {
  return withContext(async (context) => {
    const page = await context.newPage()
    await page.goto(url)
    try {
      const result = await callback(page)
      return result
    } finally {
      await page.close()
    }
  })
}

export async function getSelectorStringValue(
  page: Playwright.Page,
  selector: string,
  callback: (element: HTMLElement) => string,
): Promise<string> {
  try {
    // await page.waitForSelector(selector, { state: 'visible' })
    const result = await page.$eval(selector, callback)
    return result
  } catch {
    return ''
  }
}

export async function getLocatorStringValue(
  page: Playwright.Page,
  selector: string,
  callback: (element: HTMLElement) => string,
): Promise<string> {
  try {
    const locator = page.locator(selector)
    // rely on locator auto wait
    const result = await locator.evaluate(callback)
    return result
  } catch {
    return ''
  }
}
