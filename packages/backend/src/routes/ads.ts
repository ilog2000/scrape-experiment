import { Router, Request, Response } from 'express'
import { DbRecord, db } from '@scrape-experiment/shared'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  const ads: DbRecord[] = await db.getData()
  res.json(ads)
})

router.get('/:pageNr', async (req: Request, res: Response) => {
  const pageNumber = parseInt(req.params.pageNr)
  const ads: DbRecord[] = await db.getData(pageNumber)
  res.json(ads)
})

export default router
