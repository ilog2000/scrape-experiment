import { AdDetails, AdInfo } from '@scrape-experiment/shared/models'
import { getLocatorStringValue, getSelectorStringValue, withPage } from './scrape'

export const getPageHtml = (url: string): Promise<string> => {
  return withPage(url, (page) => page.content())
}

export const getPageImages = (url: string): Promise<string[]> => {
  return withPage(url, async (page) => {
    const images = await page.evaluate(() => {
      const images = document.querySelectorAll('img')
      const urls = Array.from(images).map((v) => v.src)
      return urls
    })
    return images
  })
}

export const getPageLinks = (url: string): Promise<string[]> => {
  return withPage(url, async (page) => {
    await page.waitForSelector('a.btn-paging', {
      state: 'visible',
    })

    return page.$$eval('a.btn-paging', (elements: HTMLAnchorElement[]) => elements.map((element) => element.href))
  })
}

export const getAds = (url: string): Promise<AdInfo[]> => {
  return withPage(url, async (page) => {
    await page.waitForSelector('div.dir-property-list', {
      state: 'visible',
    })

    return page.$$eval('a', (elements) => {
      const ads: AdInfo[] = []
      for (const element of elements) {
        const href = element.href
        if (href && href.includes('/detail/')) {
          const id = href.split('/').pop()
          const span = element.querySelector('span')
          const title = span ? span.innerText : ''
          const img = element.querySelector('img')
          const src = img ? img.src : ''
          // find if record already exists
          const record = ads.find((link) => link.href === href)
          if (record) {
            if (!record.title) record.title = title
            if (src !== '') record.thumbnails.push(src)
          } else {
            ads.push({
              id,
              href,
              title,
              thumbnails: src !== '' ? [src] : [],
            } as AdInfo)
          }
        }
      }
      return ads
    })
  })
}

export const getAdDetails = (adInfo: AdInfo): Promise<AdDetails> => {
  return withPage(adInfo.href, async (page) => {
    const details: AdDetails = {} as AdDetails
    Object.assign(details, adInfo)

    // await page.waitForSelector('div.content-inner', {
    //   state: 'visible',
    // })

    details.description = await getLocatorStringValue(
      page,
      'div.description.ng-binding',
      (element) => element.innerText,
    )
    details.location = await getLocatorStringValue(
      page,
      'span.location-text.ng-binding',
      (element) => element.innerText,
    )
    details.price = await getLocatorStringValue(
      page,
      'span.price.ng-scope > span.microdata.ng-scope > span.ng-binding',
      (element) => element.innerText,
    )
    details.energyClass = await getLocatorStringValue(
      page,
      'span.energy-efficiency-rating__text.ng-binding',
      (element) => element.innerText,
    )

    return details
  })
}

export const getPageSelectorValue = (adInfo: AdInfo, selector: string): Promise<string> => {
  return withPage(adInfo.href, async (page) => {
    return getSelectorStringValue(page, selector, (element) => element.innerText)
  })
}

export const getPageLocatorValue = (adInfo: AdInfo, selector: string): Promise<string> => {
  return withPage(adInfo.href, async (page) => {
    return getLocatorStringValue(page, selector, (element) => element.innerText)
  })
}

export const collectAdInfos = async (searchURL: string, numberOfPages: number): Promise<AdInfo[]> => {
  // 20 items per page, 25 pages = 500 items
  const allAds: AdInfo[] = []
  for (let i = 0; i < numberOfPages; i++) {
    const url = i === 0 ? searchURL : `${searchURL}?strana=${i + 1}`
    const ads = await getAds(url)
    allAds.push(...ads)
  }
  return allAds
}
