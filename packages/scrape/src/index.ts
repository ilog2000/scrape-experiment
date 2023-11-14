import dotenv from 'dotenv'
import { collectAdInfos, getAdDetails } from './parse'
import { AdInfo, DbRecord, db } from '@scrape-experiment/shared'

dotenv.config()

const searchURL = process.env.SEARCH_URL ?? 'https://www.sreality.cz/hledani/prodej/byty'

;(async () => {
  try {
    // 20 items per page, 25 pages = 500 items
    const allAds = await collectAdInfos(searchURL, 25)

    // check for duplicates
    console.log(allAds.length)
    const ids = allAds.map((ad) => ad.id)
    const uniqueIds = [...new Set(ids)]
    console.log(uniqueIds.length)

    // split into batches
    const batchSize = 5
    const batches: AdInfo[][] = []
    for (let i = 0; i < allAds.length; i += batchSize) {
      const batch = allAds.slice(i, i + batchSize)
      batches.push(batch)
    }

    for (const batch of batches) {
      const promises = batch.map((ad) => getAdDetails(ad))
      const results = await Promise.all(promises)

      const records = results.map((result) => {
        const record: DbRecord = {
          id: result.id,
          data: result,
        }
        return record
      })
      await db.setDataArray(records)
    }
  } finally {
    await db.pool.end()
  }
})()
