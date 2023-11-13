import path from 'path'
import dotenv from 'dotenv'
import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import adsRouter from './routes/ads'

dotenv.config()

const PORT: number = process.env.PORT ? parseInt(process.env.PORT as string, 10) : 5000

const app: Application = express()

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
)
app.use(cors())
app.use(express.json())
app.use('/ads', adsRouter)
app.use(express.static(path.join(__dirname, '../../frontend/dist')))

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`)
})

export default app
