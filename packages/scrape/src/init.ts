import { db } from '@scrape-experiment/shared'
;(async () => {
  try {
    const exists = await db.databaseExists()
    if (!exists) {
      await db.createDatabase()
      await db.createTable()
    }
  } finally {
    await db.pool.end()
  }
})()
